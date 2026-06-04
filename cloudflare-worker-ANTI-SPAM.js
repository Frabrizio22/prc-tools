// PRC Peptides - Cloudflare Worker with Anti-Spam Protection
// Handles: POST / (Coinbase Commerce charge creation)
//          POST /order (order notification via Telegram)

const COINBASE_API_KEY = 'eebc936a-18a8-4286-aa5d-dca4ba6a9464';
const ALLOWED_ORIGINS = [
  'https://frabrizio22.github.io',
  'https://prcpeptides.com',
  'https://www.prcpeptides.com',
  'http://prcpeptides.com',
  'http://www.prcpeptides.com'
];

// ANTI-SPAM CONFIGURATION
const RATE_LIMIT_WINDOW = 600; // 10 minutes in seconds
const MAX_ORDERS_PER_IP = 2;    // 2 orders per IP per 10 minutes
const BLOCKED_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 
  'throwaway.email', 'mailinator.com', 'trashmail.com'
];

// In-memory rate limiting (resets on worker restart, but good enough)
const orderCache = new Map();

function getCorsHeaders(origin) {
  var allowed = ALLOWED_ORIGINS.indexOf(origin) !== -1;
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxsxYIsA8fjA31rVIVewQfbS05ZmibqhlLzb1oMJfiHOgKjLVoPLAX3Z9aNwSWsu3OP/exec';

// ANTI-SPAM: Check rate limit
function checkRateLimit(ip) {
  const now = Date.now();
  const key = `ip:${ip}`;
  
  if (orderCache.has(key)) {
    const lastOrder = orderCache.get(key);
    const timeSinceLastOrder = (now - lastOrder) / 1000; // seconds
    
    if (timeSinceLastOrder < RATE_LIMIT_WINDOW) {
      return {
        allowed: false,
        retryAfter: Math.ceil(RATE_LIMIT_WINDOW - timeSinceLastOrder)
      };
    }
  }
  
  orderCache.set(key, now);
  return { allowed: true };
}

// ANTI-SPAM: Validate email
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Check against disposable email domains
  const domain = email.split('@')[1].toLowerCase();
  if (BLOCKED_EMAIL_DOMAINS.includes(domain)) return false;
  
  return true;
}

// ANTI-SPAM: Check for spam patterns
function detectSpam(body) {
  const reasons = [];
  
  // Check honeypot field (if bot filled it)
  if (body.website || body.url || body.homepage) {
    reasons.push('honeypot_triggered');
  }
  
  // Check for test/spam keywords in name
  const nameKeywords = ['test', 'spam', 'xxx', 'asdf', 'qwerty'];
  const nameLower = (body.name || '').toLowerCase();
  if (nameKeywords.some(kw => nameLower.includes(kw))) {
    reasons.push('suspicious_name');
  }
  
  // Check email validity
  if (!isValidEmail(body.email)) {
    reasons.push('invalid_email');
  }
  
  // Check if name is too short (likely fake)
  if (body.name && body.name.trim().length < 2) {
    reasons.push('name_too_short');
  }
  
  // Check if phone looks fake
  const phone = (body.phone || '').replace(/\D/g, '');
  if (phone && (phone === '0000000000' || phone === '1234567890' || phone.length < 10)) {
    reasons.push('suspicious_phone');
  }
  
  return reasons;
}

async function sendToGoogleSheet(data) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch(e) { /* best effort */ }
}

async function sendTelegram(botToken, chatId, text) {
  var resp = await fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    })
  });
  return resp.ok;
}

function formatOrderMessage(body) {
  var lines = [];
  lines.push('🛒 <b>NEW ORDER</b>');
  lines.push('');
  lines.push('📦 <b>Order #' + body.orderId + '</b>');
  lines.push('');
  lines.push('👤 <b>Customer:</b>');
  lines.push(body.name);
  lines.push(body.email);
  lines.push(body.phone || 'No phone');
  lines.push('');
  lines.push('📍 <b>Shipping:</b>');
  lines.push(body.address || 'No address');
  lines.push((body.city || '') + ', ' + (body.state || '') + ' ' + (body.zip || ''));
  lines.push('');
  lines.push('🧪 <b>Items:</b>');
  if (body.items && body.items.length) {
    body.items.forEach(function(item) {
      lines.push('• ' + item.name + ' x' + item.quantity + ' — $' + (item.price * item.quantity).toFixed(2));
    });
  }
  lines.push('');
  lines.push('💰 <b>Total:</b> $' + (body.total || '0.00'));
  lines.push('🚚 <b>Shipping:</b> ' + (body.shippingMethod || 'Standard'));
  lines.push('💳 <b>Payment:</b> ' + (body.paymentMethod || 'Unknown'));
  
  return lines.join('\n');
}

async function handleOrderNotification(request, env) {
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  const body = await request.json();
  
  // ANTI-SPAM: Rate limit check
  const rateCheck = checkRateLimit(clientIP);
  if (!rateCheck.allowed) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Rate limit exceeded',
      retryAfter: rateCheck.retryAfter
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // ANTI-SPAM: Spam detection
  const spamReasons = detectSpam(body);
  if (spamReasons.length > 0) {
    console.log('Spam detected:', spamReasons, 'IP:', clientIP);
    
    // Log spam attempt but don't notify
    await sendToGoogleSheet({
      ...body,
      status: 'SPAM_BLOCKED',
      spamReasons: spamReasons.join(', '),
      ip: clientIP
    });
    
    // Return success to bot (don't let them know we blocked it)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Legitimate order - proceed normally
  const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = env.TELEGRAM_CHAT_ID;
  
  if (BOT_TOKEN && CHAT_ID) {
    const msg = formatOrderMessage(body);
    await sendTelegram(BOT_TOKEN, CHAT_ID, msg);
  }
  
  await sendToGoogleSheet({ ...body, status: 'New', ip: clientIP });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCoinbaseCharge(request) {
  var body = await request.json();
  var name = body.name || 'Anonymous';
  var description = body.description || 'Order';
  var amount = body.amount || '50.00';
  var pricingType = body.pricing_type || 'fixed_price';
  
  var chargeData = {
    name: name,
    description: description,
    pricing_type: pricingType,
    local_price: {
      amount: amount,
      currency: 'USD'
    },
    metadata: {
      customer_name: body.customer_name || name,
      customer_id: body.customer_id || ''
    }
  };
  
  var coinbaseResp = await fetch('https://api.commerce.coinbase.com/charges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CC-Api-Key': COINBASE_API_KEY,
      'X-CC-Version': '2018-03-22'
    },
    body: JSON.stringify(chargeData)
  });
  
  if (!coinbaseResp.ok) {
    var errorText = await coinbaseResp.text();
    return new Response(JSON.stringify({ error: errorText }), { 
      status: coinbaseResp.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  var coinbaseData = await coinbaseResp.json();
  return new Response(JSON.stringify(coinbaseData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    var origin = request.headers.get('Origin') || '';
    var corsHeaders = getCorsHeaders(origin);
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    var headers = { ...corsHeaders, 'Content-Type': 'application/json' };
    
    if (request.method === 'POST' && url.pathname === '/order') {
      var resp = await handleOrderNotification(request, env);
      Object.keys(corsHeaders).forEach(function(k) {
        resp.headers.set(k, corsHeaders[k]);
      });
      return resp;
    }
    
    if (request.method === 'POST' && url.pathname === '/') {
      var resp = await handleCoinbaseCharge(request);
      Object.keys(corsHeaders).forEach(function(k) {
        resp.headers.set(k, corsHeaders[k]);
      });
      return resp;
    }
    
    return new Response(JSON.stringify({ error: 'Not Found' }), { 
      status: 404,
      headers: headers
    });
  }
};

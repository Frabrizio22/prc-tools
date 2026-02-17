// PRC Peptides - Cloudflare Worker
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

function getCorsHeaders(origin) {
  var allowed = ALLOWED_ORIGINS.indexOf(origin) !== -1;
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzw7r3qHQR3rPiYlCEWl-eFmzlIUKdYLNOPzbKM--pD6k6WZNVAEct95d8ks2NyXZLp_g/exec';

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
  lines.push('🛒 <b>NEW ORDER: ' + body.order_number + '</b>');
  lines.push('');
  lines.push('<b>Customer:</b> ' + (body.customer_name || 'N/A'));
  lines.push('<b>Email:</b> ' + (body.customer_email || 'N/A'));
  if (body.customer_phone) lines.push('<b>Phone:</b> ' + body.customer_phone);
  lines.push('');
  lines.push('<b>Items:</b>');
  if (body.items && body.items.length) {
    for (var i = 0; i < body.items.length; i++) {
      var item = body.items[i];
      lines.push('  • ' + item.name + ' ×' + item.quantity + ' — $' + (item.price * item.quantity).toFixed(2));
    }
  }
  lines.push('');
  lines.push('<b>Subtotal:</b> $' + Number(body.subtotal).toFixed(2));
  if (body.discount > 0) lines.push('<b>Discount:</b> -$' + Number(body.discount).toFixed(2));
  lines.push('<b>Shipping:</b> ' + (Number(body.shipping) === 0 ? 'FREE' : '$' + Number(body.shipping).toFixed(2)) + ' (' + (body.shipping_name || 'Standard') + ')');
  lines.push('<b>Total:</b> $' + Number(body.total).toFixed(2));
  lines.push('');
  lines.push('<b>Payment:</b> ' + (body.payment === 'crypto' ? 'Crypto (Coinbase)' : body.payment === 'zelle' ? 'Zelle (5% off)' : body.payment));
  lines.push('');
  lines.push('<b>Ship to:</b>');
  lines.push(body.customer_name);
  lines.push(body.customer_address);
  lines.push(body.customer_city + ', ' + body.customer_state + ' ' + body.customer_zip);
  return lines.join('\n');
}

export default {
  async fetch(request, env) {
    var origin = request.headers.get('Origin') || '';
    var cors = getCorsHeaders(origin);
    var url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }

    // Route: /order — send Telegram notification
    if (url.pathname === '/order') {
      try {
        var body = await request.json();
        var botToken = env.TELEGRAM_BOT_TOKEN;
        var chatId = env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
          return new Response(JSON.stringify({ error: 'Telegram not configured' }), {
            status: 500, headers: { ...cors, 'Content-Type': 'application/json' }
          });
        }

        var message = formatOrderMessage(body);
        var sent = await sendTelegram(botToken, chatId, message);
        
        // Also log to Google Sheet + send customer email
        await sendToGoogleSheet(body);

        return new Response(JSON.stringify({ success: sent }), {
          status: sent ? 200 : 502,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Server error', message: err.message }), {
          status: 500, headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }
    }

    // Route: / — create Coinbase Commerce charge
    try {
      var body = await request.json();

      if (!body.order_number || !body.total || !body.email) {
        return new Response(JSON.stringify({ error: 'Missing required fields: order_number, total, email' }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      var chargeResponse = await fetch('https://api.commerce.coinbase.com/charges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CC-Api-Key': env.COINBASE_API_KEY || COINBASE_API_KEY,
          'X-CC-Version': '2018-03-22'
        },
        body: JSON.stringify({
          name: 'PRC Peptides Order ' + body.order_number,
          description: 'Research peptides order ' + body.order_number,
          pricing_type: 'fixed_price',
          local_price: {
            amount: body.total.toString(),
            currency: 'USD'
          },
          metadata: {
            order_number: body.order_number,
            customer_email: body.email,
            customer_name: body.name || ''
          },
          redirect_url: 'https://prcpeptides.com/order-confirmed.html?order=' + encodeURIComponent(body.order_number),
          cancel_url: 'https://prcpeptides.com/checkout.html'
        })
      });

      var chargeData = await chargeResponse.json();

      if (!chargeResponse.ok) {
        return new Response(JSON.stringify({ error: 'Coinbase error', details: chargeData }), {
          status: 502,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        checkout_url: chargeData.data.hosted_url,
        charge_id: chargeData.data.id,
        expires_at: chargeData.data.expires_at
      }), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Server error', message: err.message }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }
  }
};

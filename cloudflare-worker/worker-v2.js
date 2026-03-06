// PRC Peptides - Cloudflare Worker v2
// Direct email via SendGrid + Telegram notifications + Google Sheet logging

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

// SendGrid email function
async function sendEmailViaSendGrid(apiKey, to, subject, htmlBody) {
  try {
    var resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: {
          email: 'orders@prcpeptides.com',
          name: 'PRC Peptides'
        },
        content: [{
          type: 'text/html',
          value: htmlBody
        }]
      })
    });
    
    return {
      success: resp.status === 202,
      status: resp.status,
      body: await resp.text()
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

// Generate customer email HTML
function generateCustomerEmail(body) {
  var html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0A1628; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .order-number { font-size: 24px; font-weight: bold; color: #0A1628; margin: 20px 0; }
    .section { margin: 20px 0; }
    .section-title { font-weight: bold; color: #0A1628; margin-bottom: 10px; }
    .item { padding: 10px; background: white; margin: 5px 0; border-radius: 4px; }
    .total { font-size: 20px; font-weight: bold; color: #0A1628; margin-top: 20px; padding-top: 20px; border-top: 2px solid #0A1628; }
    .payment-box { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PRC PEPTIDES</h1>
      <p>Order Confirmation</p>
    </div>
    <div class="content">
      <div class="order-number">Order #${body.order_number}</div>
      
      <p>Thank you for your order! We've received your request and will process it within 1-2 business days.</p>
      
      <div class="section">
        <div class="section-title">Order Details:</div>
        ${body.items.map(item => `
          <div class="item">
            <strong>${item.name}</strong> × ${item.quantity}<br>
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <div class="section-title">Order Summary:</div>
        <div>Subtotal: $${Number(body.subtotal).toFixed(2)}</div>
        ${Number(body.discount) > 0 ? `<div>Discount: -$${Number(body.discount).toFixed(2)}</div>` : ''}
        <div>Shipping: ${Number(body.shipping) === 0 ? 'FREE' : '$' + Number(body.shipping).toFixed(2)} (${body.shipping_name || 'Standard'})</div>
        <div class="total">Total: $${Number(body.total).toFixed(2)}</div>
      </div>
      
      ${body.payment === 'zelle' ? `
      <div class="payment-box">
        <div class="section-title">⚠️ Payment Instructions - Zelle</div>
        <p><strong>Send payment to:</strong> support@prcpeptides.com</p>
        <p><strong>Amount:</strong> $${Number(body.total).toFixed(2)}</p>
        <p><strong>Order #:</strong> ${body.order_number}</p>
        <p>Please include your order number in the Zelle memo. We'll ship within 1-2 business days of payment confirmation.</p>
      </div>
      ` : ''}
      
      ${body.payment === 'cashapp' ? `
      <div class="payment-box">
        <div class="section-title">⚠️ Payment Instructions - Cash App</div>
        <p><strong>Send payment to:</strong> $PRCPeptides</p>
        <p><strong>Amount:</strong> $${Number(body.total).toFixed(2)}</p>
        <p><strong>Order #:</strong> ${body.order_number}</p>
        <p>Please include your order number in the note. We'll ship within 1-2 business days of payment confirmation.</p>
      </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Shipping Address:</div>
        <div>${body.customer_name}</div>
        <div>${body.customer_address}</div>
        <div>${body.customer_city}, ${body.customer_state} ${body.customer_zip}</div>
      </div>
      
      <div class="section">
        <p><strong>Questions?</strong> Email us at support@prcpeptides.com</p>
      </div>
      
      <div class="footer">
        <p>FOR RESEARCH PURPOSES ONLY. Not for human consumption.</p>
        <p>© 2026 PRC Peptides</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  return html;
}

async function sendToGoogleSheet(data) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return true;
  } catch(e) {
    return false;
  }
}

async function sendTelegram(botToken, chatId, text) {
  try {
    var resp = await fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });
    return { success: resp.ok, status: resp.status };
  } catch(err) {
    return { success: false, error: err.message };
  }
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

    // Route: /order — send customer email + Telegram + log to sheet
    if (url.pathname === '/order') {
      var log = {
        timestamp: new Date().toISOString(),
        order_number: 'UNKNOWN',
        email_sent: false,
        telegram_sent: false,
        sheet_logged: false,
        errors: []
      };

      try {
        var body = await request.json();
        log.order_number = body.order_number;

        // 1. Send customer email (PRIORITY)
        var sendgridKey = env.SENDGRID_API_KEY;
        if (!sendgridKey) {
          log.errors.push('SendGrid API key not configured');
        } else {
          var emailHtml = generateCustomerEmail(body);
          var emailResult = await sendEmailViaSendGrid(
            sendgridKey,
            body.customer_email,
            'Order Confirmation - ' + body.order_number,
            emailHtml
          );
          log.email_sent = emailResult.success;
          if (!emailResult.success) {
            log.errors.push('Email failed: ' + (emailResult.error || 'Status ' + emailResult.status));
          }
        }

        // 2. Send Telegram notification (SECONDARY)
        var botToken = env.TELEGRAM_BOT_TOKEN;
        var chatId = env.TELEGRAM_CHAT_ID;
        if (botToken && chatId) {
          var message = formatOrderMessage(body);
          var telegramResult = await sendTelegram(botToken, chatId, message);
          log.telegram_sent = telegramResult.success;
          if (!telegramResult.success) {
            log.errors.push('Telegram failed: ' + (telegramResult.error || 'Status ' + telegramResult.status));
          }
        } else {
          log.errors.push('Telegram not configured');
        }

        // 3. Log to Google Sheet (BEST EFFORT)
        var sheetResult = await sendToGoogleSheet(body);
        log.sheet_logged = sheetResult;
        if (!sheetResult) {
          log.errors.push('Google Sheet logging failed');
        }

        // Console log for Cloudflare logs
        console.log('ORDER PROCESSED:', JSON.stringify(log));

        // Return detailed status
        return new Response(JSON.stringify({
          success: log.email_sent, // Success = email sent
          log: log
        }), {
          status: log.email_sent ? 200 : 500,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });

      } catch (err) {
        log.errors.push('Server error: ' + err.message);
        console.error('ORDER ERROR:', JSON.stringify(log));
        
        return new Response(JSON.stringify({
          success: false,
          error: 'Server error',
          log: log
        }), {
          status: 500,
          headers: { ...cors, 'Content-Type': 'application/json' }
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
        console.error('COINBASE ERROR:', JSON.stringify(chargeData));
        return new Response(JSON.stringify({ error: 'Coinbase error', details: chargeData }), {
          status: 502,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      console.log('COINBASE CHARGE CREATED:', body.order_number);

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
      console.error('COINBASE SETUP ERROR:', err.message);
      return new Response(JSON.stringify({ error: 'Server error', message: err.message }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Cloudflare Worker for PRC Peptides Checkout with Bankful HPP Integration
// Handles: Bankful signature generation, Coinbase Commerce, order logging, notifications

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // === CALLBACK WEBHOOK from Bankful ===
    if (url.pathname === '/bankful/callback' && request.method === 'POST') {
      try {
        const formData = await request.formData();
        const params = {};
        for (const [key, value] of formData) {
          params[key] = value;
        }

        console.log('[BANKFUL CALLBACK] Received:', params);

        // Verify signature
        const receivedSignature = params.SIGNATURE;
        delete params.SIGNATURE;
        
        const expectedSignature = await generateHmacSignature(params, env.BANKFUL_PASSWORD);
        
        if (receivedSignature !== expectedSignature) {
          console.error('[BANKFUL CALLBACK] Signature mismatch!');
          return new Response('Invalid signature', { status: 400 });
        }

        const orderNumber = params.XTL_ORDER_ID;
        const status = params.TRANS_STATUS_NAME; // APPROVED or DECLINED
        const amount = params.TRANS_VALUE;
        const transactionId = params.TRANS_REQUEST_ID;

        // Forward to Apps Script for full order processing
        const sheetUrl = env.GOOGLE_SHEET_WEBHOOK_URL;
        if (sheetUrl) {
          await fetch(sheetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'payment_confirmed',
              orderId: orderNumber,
              transactionId: transactionId,
              amount: amount,
              status: status
            })
          });
        }

        return new Response('OK', { status: 200 });
      } catch (error) {
        console.error('[BANKFUL CALLBACK] Error:', error);
        return new Response('Internal error', { status: 500 });
      }
    }

    // === BANKFUL HPP REQUEST ===
    if (url.pathname === '/bankful' && request.method === 'POST') {
      try {
        const data = await request.json();
        console.log('[BANKFUL HPP] Received:', data);
        
        const orderNumber = data.order_number;
        const amount = parseFloat(data.total);
        
        // Build HPP parameters
        const hppParams = {
          req_username: env.BANKFUL_USERNAME || 'support@prcpeptides.com',
          gateway_id: '70777',
          transaction_type: 'CAPTURE',
          amount: amount.toFixed(2),
          request_currency: 'USD',
          xtl_order_id: orderNumber,
          cart_name: 'Hosted-Page',
          
          // Customer info (optional but recommended)
          cust_fname: data.customer_name ? data.customer_name.split(' ')[0] : 'Customer',
          cust_lname: data.customer_name ? data.customer_name.split(' ').slice(1).join(' ') : '',
          cust_email: data.customer_email || '',
          cust_phone: data.customer_phone || '',
          
          // Billing address (optional)
          bill_addr: data.customer_address || '',
          bill_addr_city: data.customer_city || '',
          bill_addr_state: data.customer_state || '',
          bill_addr_zip: data.customer_zip || '',
          bill_addr_country: 'US',
          
          // Return URLs (REQUIRED)
          url_complete: 'https://prcpeptides.com/order-confirmed.html',
          url_failed: 'https://prcpeptides.com/payment-failed.html',
          url_cancel: 'https://prcpeptides.com/payment-cancel.html',
          url_pending: 'https://prcpeptides.com/payment-pending.html',
          url_callback: 'https://prc-checkout.prcpeptides.workers.dev/bankful/callback'
        };

        // Remove empty optional fields
        Object.keys(hppParams).forEach(key => {
          if (!hppParams[key]) delete hppParams[key];
        });

        // Generate signature
        const signature = await generateHmacSignature(hppParams, env.BANKFUL_PASSWORD);
        hppParams.signature = signature;

        console.log('[BANKFUL] HPP params generated:', Object.keys(hppParams));

        return new Response(JSON.stringify({
          success: true,
          hpp_url: 'https://api.paybybankful.com/front-calls/go-in/hosted-page-pay',
          hpp_params: hppParams
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        console.error('[BANKFUL HPP] Error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // === OTHER PAYMENT METHODS (Zelle, crypto, etc.) ===
    if (url.pathname === '/order' && request.method === 'POST') {
      try {
        const data = await request.json();
        console.log('[ORDER] Received:', data);

        // Forward to Google Apps Script for logging
        // BUT: Skip if sendNotifications is false (Bankful orders wait for payment callback)
        const sheetUrl = env.GOOGLE_SHEET_WEBHOOK_URL;
        if (sheetUrl && data.sendNotifications !== false) {
          await fetch(sheetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
        }

        // Send Telegram notification for ALL orders (including Bankful)
        if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
          const items = data.items.map(item => `${item.name} x${item.quantity} - $${item.price}`).join('\n');
          const message = `🆕 NEW ORDER\n\n` +
            `Order: ${data.order_number}\n` +
            `Customer: ${data.customer_name}\n` +
            `Email: ${data.customer_email}\n` +
            `Phone: ${data.customer_phone}\n` +
            `Total: $${data.total}\n` +
            `Payment: ${data.payment}\n\n` +
            `Items:\n${items}`;
          
          await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: env.TELEGRAM_CHAT_ID,
              text: message
            })
          });
        }

        // === COINBASE COMMERCE ===
        if (data.payment_method === 'crypto' || data.payment === 'crypto') {
          const checkoutUrl = `https://commerce.coinbase.com/checkout/${env.COINBASE_CHECKOUT_ID || 'YOUR_CHECKOUT_ID'}`;
          
          return new Response(JSON.stringify({
            success: true,
            checkout_url: checkoutUrl
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Order received'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        console.error('[ORDER] Error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // === NEWSLETTER SUBSCRIPTION ===
    if (url.pathname === '/newsletter' && request.method === 'POST') {
      try {
        const data = await request.json();
        console.log('[NEWSLETTER] Received:', data.email);

        // Forward to Google Apps Script for logging to Newsletter sheet
        const sheetUrl = env.GOOGLE_SHEET_WEBHOOK_URL;
        if (sheetUrl) {
          await fetch(sheetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'newsletter',
              email: data.email,
              timestamp: data.timestamp || new Date().toISOString()
            })
          });
        }

        // Optional: Send Telegram notification for new subscribers
        if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
          const message = `📧 NEW NEWSLETTER SUBSCRIBER\n\nEmail: ${data.email}`;
          await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: env.TELEGRAM_CHAT_ID,
              text: message
            })
          });
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Subscribed successfully'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error('[NEWSLETTER] Error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('PRC Checkout Worker', { status: 200, headers: corsHeaders });
  }
};

// === HELPER: Generate HMAC-SHA256 signature ===
async function generateHmacSignature(params, password) {
  // 1. Sort parameters alphabetically
  const sortedKeys = Object.keys(params).sort();
  
  // 2. Concatenate as: key1value1key2value2...
  const message = sortedKeys.map(key => key + params[key]).join('');
  
  // 3. HMAC-SHA256 with password as key
  const encoder = new TextEncoder();
  const keyData = encoder.encode(password);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  
  // 4. Hex encode
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

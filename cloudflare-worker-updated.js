// PRC Peptides Cloudflare Worker with Bankful Callback Support
// Deploy this to: prc-checkout.prcpeptides.workers.dev

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // Route: /bankful - Generate Bankful HPP parameters
  if (url.pathname === '/bankful' && request.method === 'POST') {
    try {
      const data = await request.json()
      
      const params = {
        amount: Math.round(data.total * 100), // Convert to cents
        cart_name: 'Hosted-Page',
        gateway_id: '70777',
        request_currency: 'USD',
        req_username: BANKFUL_USERNAME,
        transaction_type: 'CAPTURE',
        url_callback: 'https://prc-checkout.prcpeptides.workers.dev/callback',
        url_cancel: 'https://prcpeptides.com/checkout.html',
        url_complete: 'https://prcpeptides.com/order-confirmed.html',
        url_failed: 'https://prcpeptides.com/checkout.html',
        url_pending: 'https://prcpeptides.com/checkout.html',
        xtl_order_id: data.orderId
      }
      
      // Sort parameters alphabetically for signature
      const sortedKeys = Object.keys(params).sort()
      const signatureString = sortedKeys.map(k => `${k}=${params[k]}`).join('&')
      
      // Generate HMAC-SHA256 signature
      const encoder = new TextEncoder()
      const keyData = encoder.encode(BANKFUL_PASSWORD)
      const messageData = encoder.encode(signatureString)
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
      const signatureHex = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      
      params.xtl_signature = signatureHex
      
      return new Response(JSON.stringify({
        success: true,
        hppUrl: 'https://api.paybybankful.com/front-calls/go-in/hosted-page-pay',
        params: params
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
      
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }
  
  // Route: /callback - Receive Bankful payment notifications
  if (url.pathname === '/callback' && request.method === 'POST') {
    try {
      const data = await request.json()
      
      // Log the callback for debugging
      console.log('Bankful callback received:', JSON.stringify(data))
      
      // Extract order details
      const orderId = data.xtl_order_id || data.order_id
      const status = data.status || data.transaction_status
      const amount = data.amount ? (data.amount / 100).toFixed(2) : 'unknown'
      
      // Only process successful payments
      if (status === 'APPROVED' || status === 'SUCCESS' || status === 'COMPLETE') {
        // Forward to Google Apps Script
        const sheetPayload = {
          orderId: orderId,
          paymentMethod: 'Credit/Debit Card',
          status: 'Paid',
          amount: amount,
          timestamp: new Date().toISOString(),
          bankfulData: data
        }
        
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetPayload)
        })
        
        // Send Telegram notification
        const telegramMessage = `💳 *Payment Received*\n\n` +
          `Order: ${orderId}\n` +
          `Amount: $${amount}\n` +
          `Method: Credit/Debit Card\n` +
          `Status: ${status}\n\n` +
          `Check order details in Google Sheet`
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown'
          })
        })
      }
      
      // Return 200 OK to Bankful
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
      
    } catch (error) {
      console.error('Callback error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
  
  // Route: /order - Process full order (Zelle/Crypto/CashApp)
  if (url.pathname === '/order' && request.method === 'POST') {
    try {
      const orderData = await request.json()
      
      // Forward to Google Apps Script
      const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      const result = await response.json()
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
      
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }
  
  return new Response('PRC Checkout Worker', { 
    headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
  })
}

// Google Apps Script - Updated to support referral tracking
// Deploy this as Web App and update the webhook URL in checkout.html

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    console.log('Received order data:', data);
    
    // Log to Google Sheet
    logOrderToSheet(data);
    
    // Send notifications (if enabled)
    if (data.sendNotifications !== false) {
      sendTelegramNotification(data);
      sendCustomerEmail(data);
      sendSupportEmail(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      order_number: data.order_number
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error processing order:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function logOrderToSheet(data) {
  var ss = SpreadsheetApp.openById('1Edd7FoYFMPaGPidLqqe--iDPzkgdc5PZE_3jRgdb0SE');
  var sheet = ss.getSheetByName('Orders');
  
  if (!sheet) {
    throw new Error('Orders sheet not found');
  }
  
  // Format items for display
  var itemsList = data.items.map(function(item) {
    return item.quantity + 'x ' + item.name;
  }).join(', ');
  
  // Format items detail for JSON column
  var itemsDetail = JSON.stringify(data.items);
  
  // Format: Date, Order #, Customer, Email, Phone, Address, City, State, Zip, 
  //         Items, Items Detail, Subtotal, Discount, Shipping, Total, Payment, Status, Referral Source
  var row = [
    new Date(),
    data.order_number,
    data.customer_name,
    data.customer_email,
    data.customer_phone || '',
    data.customer_address || '',
    data.customer_city || '',
    data.customer_state || '',
    data.customer_zip || '',
    itemsList,
    itemsDetail,
    parseFloat(data.subtotal) || 0,
    parseFloat(data.discount) || 0,
    parseFloat(data.shipping) || 0,
    parseFloat(data.total) || 0,
    data.payment || '',
    'Pending',
    data.referral_source || ''  // NEW: Column 18
  ];
  
  sheet.appendRow(row);
  console.log('Order logged to sheet:', data.order_number);
}

function sendTelegramNotification(data) {
  var BOT_TOKEN = '8478171743:AAHc9H_QoXNsbaelWNwTrjHbWI_ZmDQY6L0';
  var CHAT_ID = '513307658';
  
  var itemsList = data.items.map(function(item) {
    return '• ' + item.quantity + 'x ' + item.name + ' ($' + item.price.toFixed(2) + ')';
  }).join('\n');
  
  var referralText = data.referral_source ? '\n📊 Referral: ' + data.referral_source : '';
  var discountText = data.discount_code ? '\n🎟️ Code: ' + data.discount_code : '';
  
  var message = '🔔 NEW ORDER: ' + data.order_number + '\n\n' +
                '👤 ' + data.customer_name + '\n' +
                '📧 ' + data.customer_email + '\n' +
                '📍 ' + data.customer_city + ', ' + data.customer_state + '\n\n' +
                '🛒 ITEMS:\n' + itemsList + '\n\n' +
                '💰 Subtotal: $' + parseFloat(data.subtotal).toFixed(2) + '\n' +
                (data.discount > 0 ? '🎁 Discount: -$' + parseFloat(data.discount).toFixed(2) + '\n' : '') +
                '📦 Shipping: $' + parseFloat(data.shipping).toFixed(2) + '\n' +
                '💵 TOTAL: $' + parseFloat(data.total).toFixed(2) + '\n\n' +
                '💳 Payment: ' + data.payment + referralText + discountText;
  
  var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
  var payload = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'HTML'
  };
  
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  
  console.log('Telegram notification sent');
}

function sendCustomerEmail(data) {
  var itemsHtml = data.items.map(function(item) {
    var lineTotal = (item.price * item.quantity).toFixed(2);
    return '<tr><td style="padding:8px;border-bottom:1px solid #E2E8F0">' + 
           item.quantity + 'x ' + item.name + 
           '</td><td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right">$' + 
           lineTotal + '</td></tr>';
  }).join('');
  
  var discountRow = data.discount > 0 ? 
    '<tr><td style="padding:8px;border-bottom:1px solid #E2E8F0">Discount' + 
    (data.discount_code ? ' (' + data.discount_code + ')' : '') + 
    '</td><td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right;color:#059669">-$' + 
    parseFloat(data.discount).toFixed(2) + '</td></tr>' : '';
  
  var subject = 'Order Confirmation - ' + data.order_number;
  var htmlBody = '<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6;color:#0A1628">' +
    '<div style="max-width:600px;margin:0 auto;padding:20px">' +
    '<h2 style="color:#2B7DE9">Thank you for your order!</h2>' +
    '<p>Order #: <strong>' + data.order_number + '</strong></p>' +
    '<table style="width:100%;border-collapse:collapse;margin:20px 0">' +
    itemsHtml +
    '<tr><td style="padding:8px;border-bottom:1px solid #E2E8F0">Subtotal</td>' +
    '<td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right">$' + 
    parseFloat(data.subtotal).toFixed(2) + '</td></tr>' +
    discountRow +
    '<tr><td style="padding:8px;border-bottom:1px solid #E2E8F0">' + data.shipping_name + '</td>' +
    '<td style="padding:8px;border-bottom:1px solid #E2E8F0;text-align:right">$' + 
    parseFloat(data.shipping).toFixed(2) + '</td></tr>' +
    '<tr><td style="padding:12px 8px;font-size:18px;font-weight:bold">Total</td>' +
    '<td style="padding:12px 8px;text-align:right;font-size:18px;font-weight:bold;color:#2B7DE9">$' + 
    parseFloat(data.total).toFixed(2) + '</td></tr>' +
    '</table>' +
    '<p><strong>Payment Method:</strong> ' + data.payment + '</p>' +
    '<p style="color:#64748B;font-size:14px">Questions? Email support@prcpeptides.com</p>' +
    '</div></body></html>';
  
  MailApp.sendEmail({
    to: data.customer_email,
    subject: subject,
    htmlBody: htmlBody
  });
  
  console.log('Customer email sent to:', data.customer_email);
}

function sendSupportEmail(data) {
  var itemsList = data.items.map(function(item) {
    return item.quantity + 'x ' + item.name + ' ($' + item.price.toFixed(2) + ')';
  }).join('\n');
  
  var referralText = data.referral_source ? '\nReferral Source: ' + data.referral_source : '';
  var discountText = data.discount_code ? '\nDiscount Code: ' + data.discount_code : '';
  
  var subject = 'NEW ORDER: ' + data.order_number;
  var body = 'Order #: ' + data.order_number + '\n\n' +
             'Customer: ' + data.customer_name + '\n' +
             'Email: ' + data.customer_email + '\n' +
             'Phone: ' + (data.customer_phone || 'N/A') + '\n' +
             'Address: ' + data.customer_address + ', ' + 
             data.customer_city + ', ' + data.customer_state + ' ' + data.customer_zip + '\n\n' +
             'Items:\n' + itemsList + '\n\n' +
             'Subtotal: $' + parseFloat(data.subtotal).toFixed(2) + '\n' +
             (data.discount > 0 ? 'Discount: -$' + parseFloat(data.discount).toFixed(2) + '\n' : '') +
             'Shipping: $' + parseFloat(data.shipping).toFixed(2) + '\n' +
             'TOTAL: $' + parseFloat(data.total).toFixed(2) + '\n\n' +
             'Payment: ' + data.payment + referralText + discountText;
  
  MailApp.sendEmail({
    to: 'support@prcpeptides.com',
    subject: subject,
    body: body
  });
  
  console.log('Support email sent');
}

# Google Apps Script Update - Bankful Order Flow

## What Changed
Orders now log BEFORE payment (with "Awaiting Payment" status), then the callback updates the status to "Paid" when payment completes.

## Updated Apps Script Code

Replace your current `doPost` function with this:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
    
    // Handle status update (from Bankful callback)
    if (data.action === 'update_status') {
      return handleStatusUpdate(data, sheet);
    }
    
    // Handle new order creation
    return handleNewOrder(data, sheet);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleNewOrder(data, sheet) {
  // Format items list
  var itemsList = '';
  if (data.items && data.items.length > 0) {
    itemsList = data.items.map(function(item) {
      return item.quantity + 'x ' + item.name + ' ($' + item.price + ')';
    }).join(', ');
  }
  
  // Determine status
  var status = data.status || 'Pending';
  
  // Log to sheet
  var timestamp = new Date();
  sheet.appendRow([
    timestamp,                    // A: Timestamp
    data.order_number,           // B: Order Number
    data.customer_name,          // C: Customer Name
    data.customer_email,         // D: Email
    data.customer_phone,         // E: Phone
    data.customer_address,       // F: Address
    data.customer_city,          // G: City
    data.customer_state,         // H: State
    data.customer_zip,           // I: Zip
    itemsList,                   // J: Items
    data.subtotal || '',         // K: Subtotal
    data.discount || '',         // L: Discount
    data.shipping || '',         // M: Shipping
    data.shipping_name || '',    // N: Shipping Method
    data.total,                  // O: Total
    data.payment,                // P: Payment Method
    status                       // Q: Status
  ]);
  
  // Send email notification for manual payments (Zelle, CashApp)
  if (data.payment === 'zelle' || data.payment === 'cashapp') {
    sendCustomerEmail(data, itemsList);
  }
  
  // Send Telegram notification for all orders
  sendTelegramNotification(data, itemsList, status);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Order logged'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleStatusUpdate(data, sheet) {
  var orderId = data.orderId;
  var newStatus = data.status;
  
  // Find the order by order number
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  
  for (var i = 1; i < values.length; i++) { // Skip header row
    if (values[i][1] === orderId) { // Column B = Order Number
      // Update status (Column Q = 17th column, index 16)
      sheet.getRange(i + 1, 17).setValue(newStatus);
      
      // Get order details for notification
      var orderData = {
        order_number: values[i][1],
        customer_name: values[i][2],
        items_text: values[i][9],
        total: values[i][14],
        payment: values[i][15]
      };
      
      // Send Telegram notification with full order details
      sendPaymentConfirmationTelegram(orderData);
      
      Logger.log('Updated order ' + orderId + ' to status: ' + newStatus);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Status updated'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  Logger.log('Order ' + orderId + ' not found');
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: 'Order not found'
  })).setMimeType(ContentService.MimeType.JSON);
}

function sendPaymentConfirmationTelegram(orderData) {
  var message = '💳 *Payment Received*\n\n' +
    'Order: ' + orderData.order_number + '\n' +
    'Customer: ' + orderData.customer_name + '\n' +
    'Total: $' + orderData.total + '\n' +
    'Method: Credit/Debit Card\n\n' +
    '*Items:*\n' + orderData.items_text + '\n\n' +
    '✅ Status updated to Paid - ready to ship!';
  
  var telegramUrl = 'https://api.telegram.org/bot8478171743:AAHc9H_QoXNsbaelWNwTrjHbWI_ZmDQY6L0/sendMessage';
  
  UrlFetchApp.fetch(telegramUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: '513307658',
      text: message,
      parse_mode: 'Markdown'
    })
  });
}

function sendTelegramNotification(data, itemsList, status) {
  var statusEmoji = (status === 'Awaiting Payment') ? '⏳' : '📦';
  
  var message = statusEmoji + ' *New Order*\n\n' +
    'Order: ' + data.order_number + '\n' +
    'Customer: ' + data.customer_name + '\n' +
    'Total: $' + data.total + '\n' +
    'Payment: ' + formatPaymentMethod(data.payment) + '\n' +
    'Status: ' + status + '\n\n' +
    '*Items:*\n' + itemsList;
  
  if (status === 'Awaiting Payment') {
    message += '\n\n⏳ Waiting for payment confirmation...';
  }
  
  var telegramUrl = 'https://api.telegram.org/bot8478171743:AAHc9H_QoXNsbaelWNwTrjHbWI_ZmDQY6L0/sendMessage';
  
  UrlFetchApp.fetch(telegramUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: '513307658',
      text: message,
      parse_mode: 'Markdown'
    })
  });
}

function sendCustomerEmail(data, itemsList) {
  // Your existing email function
  // (keeping the same as before)
}

function formatPaymentMethod(method) {
  var methods = {
    'bankful': 'Credit/Debit Card',
    'crypto': 'Cryptocurrency',
    'zelle': 'Zelle',
    'cashapp': 'Cash App'
  };
  return methods[method] || method;
}
```

## What This Does:

### For New Orders:
1. Logs order to sheet with status "Awaiting Payment" (for Bankful) or "Pending" (for Zelle/etc)
2. Sends Telegram notification: "⏳ New Order - Awaiting Payment"
3. Includes full item list in notification

### For Bankful Callbacks:
1. Finds order by ID in the sheet
2. Updates status from "Awaiting Payment" → "Paid"
3. Sends second Telegram notification: "💳 Payment Received" with full order details
4. Ready to ship!

## How to Update:

1. Open your Google Apps Script: https://script.google.com
2. Find your "PRC Orders" project
3. Replace the `doPost` function with the code above
4. Add the helper functions below it
5. Click "Deploy" → "New deployment"
6. Copy the new webhook URL (it might stay the same)
7. Click "Save"

## Column Layout (should match your sheet):

- A: Timestamp
- B: Order Number
- C: Customer Name
- D: Email
- E: Phone
- F: Address
- G: City
- H: State
- I: Zip
- J: Items
- K: Subtotal
- L: Discount
- M: Shipping
- N: Shipping Method
- O: Total
- P: Payment Method
- **Q: Status** ← NEW column

Add a "Status" header to column Q if you don't have it yet.

## Testing:

After updating, test with a real Bankful payment or simulate:

```bash
# Test order creation
curl -X POST [YOUR_APPS_SCRIPT_URL] \
  -H "Content-Type: application/json" \
  -d '{
    "order_number": "PRC-TEST-100",
    "customer_name": "Test Customer",
    "customer_email": "test@test.com",
    "items": [{"name":"Semaglutide 10mg","price":30,"quantity":1}],
    "total": 39.99,
    "payment": "bankful",
    "status": "Awaiting Payment"
  }'

# Test status update (simulate Bankful callback)
curl -X POST [YOUR_APPS_SCRIPT_URL] \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update_status",
    "orderId": "PRC-TEST-100",
    "status": "Paid"
  }'
```

You should get TWO Telegram notifications:
1. First: "⏳ New Order - Awaiting Payment"
2. Second: "💳 Payment Received - ready to ship!"

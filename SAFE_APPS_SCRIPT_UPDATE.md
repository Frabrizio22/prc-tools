# Safe Google Apps Script Update - Step by Step

## Before You Start: Backup Your Current Script

1. Open https://script.google.com
2. Find your "PRC Orders" project
3. Copy ALL your current code and save it in a text file (just in case)

---

## Step 1: Add the Status Column to Your Sheet

1. Open your "PRC Orders" Google Sheet
2. Click on column Q (right after column P)
3. Type "Status" in the header row
4. **Done!** Now orders can have a status.

---

## Step 2: Update the Script (Safe Method)

### Option A: Test First (Recommended)

1. In Google Apps Script, create a NEW file: `File` → `New` → `Script file`
2. Name it "UpdatedFunctions"
3. Paste the new functions (see below)
4. Test with a fake order
5. If it works, replace the old code

### Option B: Direct Replace (Faster)

1. Select ALL code in your current `Code.gs`
2. Delete it
3. Paste the new code (see below)
4. Click Save (disk icon)
5. Deploy new version

---

## The New Code (Copy Everything Below)

\`\`\`javascript
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
  
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] === orderId) {
      // Update status (Column Q)
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
  var message = '💳 *Payment Received*\\n\\n' +
    'Order: ' + orderData.order_number + '\\n' +
    'Customer: ' + orderData.customer_name + '\\n' +
    'Total: $' + orderData.total + '\\n' +
    'Method: Credit/Debit Card\\n\\n' +
    '*Items:*\\n' + orderData.items_text + '\\n\\n' +
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
  
  var message = statusEmoji + ' *New Order*\\n\\n' +
    'Order: ' + data.order_number + '\\n' +
    'Customer: ' + data.customer_name + '\\n' +
    'Total: $' + data.total + '\\n' +
    'Payment: ' + formatPaymentMethod(data.payment) + '\\n' +
    'Status: ' + status + '\\n\\n' +
    '*Items:*\\n' + itemsList;
  
  if (status === 'Awaiting Payment') {
    message += '\\n\\n⏳ Waiting for payment confirmation...';
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
  var subject = 'Order Confirmation - ' + data.order_number;
  var body = 'Thank you for your order!\\n\\n' +
    'Order Number: ' + data.order_number + '\\n' +
    'Items: ' + itemsList + '\\n' +
    'Total: $' + data.total + '\\n\\n' +
    'Payment Instructions:\\n';
  
  if (data.payment === 'zelle') {
    body += 'Send payment via Zelle to: support@prcpeptides.com\\n';
    body += 'Include order number ' + data.order_number + ' in the note.';
  } else if (data.payment === 'cashapp') {
    body += 'Send payment via Cash App to: $PRCPeptides\\n';
    body += 'Include order number ' + data.order_number + ' in the note.';
  }
  
  MailApp.sendEmail(data.customer_email, subject, body);
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
\`\`\`

---

## Step 3: Deploy the New Version

1. Click **"Deploy"** button (top right)
2. Click **"Manage deployments"**
3. Click the **pencil icon** (edit)
4. Change **"Version"** to **"New version"**
5. Add description: "Added Bankful callback support + item lists"
6. Click **"Deploy"**
7. Click **"Done"**

**The webhook URL stays the same** - no need to update anything else.

---

## Step 4: Test It

Run this in your terminal to test:

\`\`\`bash
curl -X POST [YOUR_APPS_SCRIPT_URL] \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_number": "PRC-TEST-999",
    "customer_name": "Test User",
    "customer_email": "test@test.com",
    "items": [{"name":"Semaglutide 10mg","price":30,"quantity":1}],
    "total": 39.99,
    "payment": "bankful",
    "status": "Awaiting Payment"
  }'
\`\`\`

Check your Telegram - you should see a notification with the item list!

---

## What Changed:

**Before:**
- Bankful orders: no notification until after payment
- No item list in notifications

**After:**
- Bankful orders: immediate notification when order placed
- Second notification when payment confirms
- Full item list in both notifications

---

## If Something Breaks:

1. Go back to Google Apps Script
2. Click **"Deploy" → "Manage deployments"**
3. Click the **pencil icon**
4. Change version back to previous
5. Click **"Deploy"**
6. Message me and I'll help debug

Nothing on the frontend will break - worst case the notifications won't have item lists (same as before).

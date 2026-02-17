// PRC Peptides — Order Tracker Google Apps Script
// Paste this into script.google.com → Deploy as Web App

var SHEET_ID = ''; // Leave empty — auto-creates on first order

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = getOrCreateSpreadsheet();
    
    // Write to Orders sheet
    var orders = ss.getSheetByName('Orders');
    var items = '';
    var itemsList = data.items || [];
    for (var i = 0; i < itemsList.length; i++) {
      if (i > 0) items += ', ';
      items += itemsList[i].name + ' x' + itemsList[i].quantity;
    }
    
    var itemsDetail = '';
    for (var i = 0; i < itemsList.length; i++) {
      if (i > 0) itemsDetail += ', ';
      itemsDetail += itemsList[i].name + ' x' + itemsList[i].quantity + ' ($' + (itemsList[i].price * itemsList[i].quantity).toFixed(2) + ')';
    }
    
    orders.appendRow([
      new Date(),
      data.order_number || '',
      data.customer_name || '',
      data.customer_email || '',
      data.customer_phone || '',
      data.customer_address || '',
      data.customer_city || '',
      data.customer_state || '',
      data.customer_zip || '',
      items,
      itemsDetail,
      Number(data.subtotal) || 0,
      Number(data.discount) || 0,
      Number(data.shipping) || 0,
      Number(data.total) || 0,
      data.payment || '',
      'New'
    ]);
    
    // Write individual items to Products sheet
    var products = ss.getSheetByName('Products');
    for (var i = 0; i < itemsList.length; i++) {
      products.appendRow([
        new Date(),
        data.order_number || '',
        itemsList[i].name,
        itemsList[i].quantity,
        itemsList[i].price,
        itemsList[i].price * itemsList[i].quantity
      ]);
    }
    
    // Send customer email
    sendOrderEmail(data);
    
    // Refresh dashboard
    refreshDashboard(ss);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendOrderEmail(data) {
  try {
    var email = data.customer_email;
    if (!email) return;
    
    var orderNum = data.order_number;
    var total = Number(data.total).toFixed(2);
    var payment = data.payment;
    
    var itemsHtml = '';
    var items = data.items || [];
    for (var i = 0; i < items.length; i++) {
      itemsHtml += '<tr><td style="padding:8px;border-bottom:1px solid #eee">' + items[i].name + '</td>';
      itemsHtml += '<td style="padding:8px;border-bottom:1px solid #eee;text-align:center">' + items[i].quantity + '</td>';
      itemsHtml += '<td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$' + (items[i].price * items[i].quantity).toFixed(2) + '</td></tr>';
    }
    
    var paymentHtml = '';
    if (payment === 'zelle') {
      paymentHtml = '<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:16px;margin:16px 0">' +
        '<h3 style="margin:0 0 8px;color:#059669">Zelle Payment Instructions</h3>' +
        '<p style="margin:4px 0"><strong>1.</strong> Open Zelle in your banking app</p>' +
        '<p style="margin:4px 0"><strong>2.</strong> Send <strong>$' + total + '</strong> to <strong>(619) 587-1812</strong></p>' +
        '<p style="margin:4px 0"><strong>3.</strong> In the memo, write ONLY: <strong>' + orderNum + '</strong></p>' +
        '<p style="margin:8px 0 0;color:#DC2626;font-size:13px">⚠️ Do not mention product names or peptides in the payment memo.</p>' +
        '</div>';
    } else if (payment === 'crypto') {
      paymentHtml = '<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:16px;margin:16px 0">' +
        '<h3 style="margin:0 0 8px;color:#2563EB">Cryptocurrency Payment</h3>' +
        '<p style="margin:4px 0">You should have been redirected to Coinbase Commerce to complete payment.</p>' +
        '<p style="margin:4px 0">If the redirect didn\'t work, reply to this email with your order number and we\'ll send a payment link.</p>' +
        '</div>';
    }
    
    var shippingHtml = '';
    if (data.customer_address) {
      shippingHtml = '<div style="margin:16px 0"><strong>Ships to:</strong><br>' +
        data.customer_name + '<br>' +
        data.customer_address + '<br>' +
        data.customer_city + ', ' + data.customer_state + ' ' + data.customer_zip +
        '</div>';
    }
    
    var discountRow = '';
    if (Number(data.discount) > 0) {
      discountRow = '<tr><td style="padding:8px">Discount (5%)</td><td></td><td style="padding:8px;text-align:right;color:#059669">-$' + Number(data.discount).toFixed(2) + '</td></tr>';
    }
    
    var shippingLabel = Number(data.shipping) === 0 ? 'FREE' : '$' + Number(data.shipping).toFixed(2);
    
    var html = '<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1E293B;background:#F1F5F9">' +
      '<div style="background:#F1F5F9;padding:24px 16px">' +
      
      // Header card
      '<div style="background:linear-gradient(135deg,#0A1628 0%,#1E3A5F 100%);border-radius:12px 12px 0 0;padding:28px 24px;text-align:center">' +
      '<h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:1px"><span style="color:#2B7DE9">PRC</span> PEPTIDES</h1>' +
      '<p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px;letter-spacing:0.5px">≥98% Purity · Third-Party Tested</p>' +
      '</div>' +
      
      // White content card
      '<div style="background:#FFFFFF;border-radius:0 0 12px 12px;padding:28px 24px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">' +
      
      // Order confirmed badge
      '<div style="text-align:center;margin-bottom:20px">' +
      '<div style="display:inline-block;background:#F0FDF4;color:#059669;font-weight:700;font-size:13px;padding:6px 16px;border-radius:20px;letter-spacing:0.3px">✓ Order Confirmed</div>' +
      '<p style="color:#64748B;margin:8px 0 0;font-size:14px">' + orderNum + '</p>' +
      '</div>' +
      
      // Payment instructions
      paymentHtml +
      
      // Order details
      '<div style="margin:20px 0 0">' +
      '<h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:#94A3B8;margin:0 0 12px;font-weight:600">Order Details</h3>' +
      '<table style="width:100%;border-collapse:collapse">' +
      '<tr style="border-bottom:2px solid #E2E8F0"><th style="padding:10px 8px;text-align:left;font-size:13px;color:#64748B;font-weight:600">Item</th><th style="padding:10px 8px;text-align:center;font-size:13px;color:#64748B;font-weight:600">Qty</th><th style="padding:10px 8px;text-align:right;font-size:13px;color:#64748B;font-weight:600">Price</th></tr>' +
      itemsHtml +
      '</table>' +
      '<div style="border-top:2px solid #E2E8F0;margin-top:4px;padding-top:12px">' +
      '<div style="display:flex;justify-content:space-between;padding:4px 8px;font-size:14px"><span>Subtotal</span><span>$' + Number(data.subtotal).toFixed(2) + '</span></div>' +
      (Number(data.discount) > 0 ? '<div style="display:flex;justify-content:space-between;padding:4px 8px;font-size:14px;color:#059669"><span>Discount (5%)</span><span>-$' + Number(data.discount).toFixed(2) + '</span></div>' : '') +
      '<div style="display:flex;justify-content:space-between;padding:4px 8px;font-size:14px"><span>Shipping</span><span>' + shippingLabel + '</span></div>' +
      '<div style="display:flex;justify-content:space-between;padding:10px 8px;font-size:18px;font-weight:700;border-top:2px solid #E2E8F0;margin-top:8px"><span>Total</span><span>$' + total + '</span></div>' +
      '</div></div>' +
      
      // Shipping address
      shippingHtml +
      
      // Shipping note
      '<div style="background:#F8FAFC;border-radius:8px;padding:14px 16px;margin:20px 0 0;text-align:center">' +
      '<p style="margin:0;font-size:14px;color:#1E293B">Ships within <strong>1 business day</strong> of payment confirmation</p>' +
      '</div>' +
      
      // Support
      '<p style="color:#64748B;font-size:13px;text-align:center;margin:20px 0 0">Questions? Reply to this email or contact <a href="mailto:support@prcpeptides.com" style="color:#2B7DE9;text-decoration:none">support@prcpeptides.com</a></p>' +
      
      '</div>' + // end white card
      
      // Footer
      '<div style="text-align:center;padding:20px 16px;font-size:11px;color:#94A3B8">' +
      '<p style="margin:2px 0">© 2026 PRC Labs LLC</p>' +
      '<p style="margin:2px 0">All products are sold for research purposes only. Not for human consumption.</p>' +
      '</div>' +
      
      '</div>' + // end outer wrapper
      '</body></html>';
    
    GmailApp.sendEmail(email, 'Order Confirmed — ' + orderNum + ' | PRC Peptides', '', {
      htmlBody: html,
      name: 'PRC Peptides',
      replyTo: 'support@prcpeptides.com'
    });
  } catch(e) {
    // Silent fail — email is best effort
    Logger.log('Email error: ' + e.message);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'PRC Order Tracker Active'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSpreadsheet() {
  var files = DriveApp.getFilesByName('PRC Orders');
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  
  var ss = SpreadsheetApp.create('PRC Orders');
  
  // Orders sheet
  var orders = ss.getSheets()[0];
  orders.setName('Orders');
  orders.appendRow([
    'Date', 'Order #', 'Customer', 'Email', 'Phone',
    'Address', 'City', 'State', 'Zip',
    'Items', 'Items Detail', 'Subtotal', 'Discount', 'Shipping', 'Total',
    'Payment', 'Status'
  ]);
  orders.getRange('1:1').setFontWeight('bold').setBackground('#0A1628').setFontColor('#FFFFFF');
  orders.setFrozenRows(1);
  orders.setColumnWidth(1, 140);
  orders.setColumnWidth(2, 100);
  orders.setColumnWidth(10, 250);
  orders.setColumnWidth(11, 300);
  
  // Status dropdown (column Q) — apply to rows 2-500
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Paid', 'Shipped', 'Delivered', 'Cancelled'], true)
    .setAllowInvalid(false)
    .build();
  orders.getRange('Q2:Q500').setDataValidation(statusRule);
  
  // Products sheet (individual line items)
  var products = ss.insertSheet('Products');
  products.appendRow(['Date', 'Order #', 'Product', 'Quantity', 'Unit Price', 'Line Total']);
  products.getRange('1:1').setFontWeight('bold').setBackground('#0A1628').setFontColor('#FFFFFF');
  products.setFrozenRows(1);
  
  // Dashboard sheet
  var dash = ss.insertSheet('Dashboard');
  buildDashboard(dash);
  
  // Move dashboard to first position
  ss.setActiveSheet(dash);
  ss.moveActiveSheet(1);
  
  return ss;
}

function buildDashboard(dash) {
  // Title
  dash.getRange('A1').setValue('PRC PEPTIDES — ORDER DASHBOARD').setFontSize(16).setFontWeight('bold').setFontColor('#0A1628');
  dash.getRange('A2').setValue('Auto-updated with every order').setFontColor('#64748B');
  
  // Key Metrics
  dash.getRange('A4').setValue('KEY METRICS').setFontWeight('bold').setFontSize(12).setFontColor('#2B7DE9');
  
  dash.getRange('A5').setValue('Total Revenue');
  dash.getRange('B5').setFormula('=SUMIF(Orders!Q:Q,"<>Cancelled",Orders!O:O)-INDEX(Orders!O:O,1,1)').setNumberFormat('$#,##0.00');
  
  dash.getRange('A6').setValue('Total Orders');
  dash.getRange('B6').setFormula('=COUNTA(Orders!B:B)-1');
  
  dash.getRange('A7').setValue('Average Order Value');
  dash.getRange('B7').setFormula('=IF(B6>0,B5/B6,0)').setNumberFormat('$#,##0.00');
  
  dash.getRange('A8').setValue('Average Items/Order');
  dash.getRange('B8').setFormula('=IF(B6>0,(COUNTA(Products!C:C)-1)/B6,0)').setNumberFormat('0.0');
  
  // Revenue by Payment Method
  dash.getRange('A10').setValue('REVENUE BY PAYMENT').setFontWeight('bold').setFontSize(12).setFontColor('#2B7DE9');
  
  dash.getRange('A11').setValue('Crypto');
  dash.getRange('B11').setFormula('=SUMIFS(Orders!O:O,Orders!P:P,"crypto",Orders!Q:Q,"<>Cancelled")').setNumberFormat('$#,##0.00');
  
  dash.getRange('A12').setValue('Zelle');
  dash.getRange('B12').setFormula('=SUMIFS(Orders!O:O,Orders!P:P,"zelle",Orders!Q:Q,"<>Cancelled")').setNumberFormat('$#,##0.00');
  
  // Order Status
  dash.getRange('A14').setValue('ORDER STATUS').setFontWeight('bold').setFontSize(12).setFontColor('#2B7DE9');
  
  dash.getRange('A15').setValue('New');
  dash.getRange('B15').setFormula('=COUNTIF(Orders!Q:Q,"New")');
  
  dash.getRange('A16').setValue('Paid');
  dash.getRange('B16').setFormula('=COUNTIF(Orders!Q:Q,"Paid")');
  
  dash.getRange('A17').setValue('Shipped');
  dash.getRange('B17').setFormula('=COUNTIF(Orders!Q:Q,"Shipped")');
  
  dash.getRange('A18').setValue('Delivered');
  dash.getRange('B18').setFormula('=COUNTIF(Orders!Q:Q,"Delivered")');
  
  dash.getRange('A19').setValue('Cancelled');
  dash.getRange('B19').setFormula('=COUNTIF(Orders!Q:Q,"Cancelled")');
  
  // Top Products
  dash.getRange('D4').setValue('TOP PRODUCTS (by units sold)').setFontWeight('bold').setFontSize(12).setFontColor('#2B7DE9');
  dash.getRange('D5').setValue('See Products sheet → Pivot Table for full breakdown').setFontColor('#64748B');
  
  // This month
  dash.getRange('A21').setValue('THIS MONTH').setFontWeight('bold').setFontSize(12).setFontColor('#2B7DE9');
  
  dash.getRange('A22').setValue('Revenue');
  dash.getRange('B22').setFormula('=SUMPRODUCT((MONTH(Orders!A2:A)=MONTH(TODAY()))*(YEAR(Orders!A2:A)=YEAR(TODAY()))*(Orders!Q2:Q<>"Cancelled")*(Orders!O2:O))').setNumberFormat('$#,##0.00');
  
  dash.getRange('A23').setValue('Orders');
  dash.getRange('B23').setFormula('=SUMPRODUCT((MONTH(Orders!A2:A)=MONTH(TODAY()))*(YEAR(Orders!A2:A)=YEAR(TODAY()))*(Orders!B2:B<>""))');
  
  // Today
  dash.getRange('A25').setValue('TODAY').setFontWeight('bold').setFontSize(12).setFontColor('#2B7DE9');
  
  dash.getRange('A26').setValue('Revenue');
  dash.getRange('B26').setFormula('=SUMPRODUCT((INT(Orders!A2:A)=TODAY())*(Orders!Q2:Q<>"Cancelled")*(Orders!O2:O))').setNumberFormat('$#,##0.00');
  
  dash.getRange('A27').setValue('Orders');
  dash.getRange('B27').setFormula('=SUMPRODUCT((INT(Orders!A2:A)=TODAY())*(Orders!B2:B<>""))');
  
  // Formatting
  dash.setColumnWidth(1, 200);
  dash.setColumnWidth(2, 150);
  dash.setColumnWidth(4, 300);
  dash.getRange('A5:A8').setFontWeight('bold');
  dash.getRange('A11:A12').setFontWeight('bold');
  dash.getRange('A15:A19').setFontWeight('bold');
  dash.getRange('A22:A23').setFontWeight('bold');
  dash.getRange('A26:A27').setFontWeight('bold');
}

function refreshDashboard(ss) {
  // Dashboard formulas auto-update, but we can force a recalc
  SpreadsheetApp.flush();
}

// Run this manually once to test setup
function testSetup() {
  var ss = getOrCreateSpreadsheet();
  Logger.log('Spreadsheet created: ' + ss.getUrl());
}

# Bankful Callback Setup - Complete Guide

## What Changed
Cody confirmed we can include `url_callback` in the API request parameters. This means we can enable automated payment notifications RIGHT NOW without waiting for dashboard access.

## Updated Cloudflare Worker

The new worker (`cloudflare-worker-updated.js`) includes:
1. **`url_callback` parameter** in Bankful HPP requests
2. **`/callback` endpoint** to receive payment notifications
3. **Automatic order processing** when payment succeeds

## Deployment Steps

### 1. Update Cloudflare Worker
```bash
# Log in to Cloudflare
wrangler login

# Deploy updated worker
wrangler publish cloudflare-worker-updated.js --name prc-checkout
```

### 2. Environment Variables (already set)
These should already be configured in your Cloudflare Worker:
- `BANKFUL_USERNAME`: support@prcpeptides.com
- `BANKFUL_PASSWORD`: [your Bankful password]
- `GOOGLE_SHEET_WEBHOOK_URL`: https://script.google.com/macros/s/AKfycbw...
- `TELEGRAM_BOT_TOKEN`: 8478171743:AAHc9H_QoXNsbaelWNwTrjHbWI_ZmDQY6L0
- `TELEGRAM_CHAT_ID`: 513307658

### 3. Test the Callback

**How Bankful callbacks work:**
1. Customer pays via Bankful HPP
2. Bankful POSTs payment result to `https://prc-checkout.prcpeptides.workers.dev/callback`
3. Worker receives status (APPROVED/SUCCESS/COMPLETE)
4. Worker forwards to Google Sheet + sends Telegram notification
5. Order automatically marked as "Paid" in your sheet

**What gets sent:**
- Order ID (PRC-XXXXX)
- Payment amount
- Payment status
- Customer email (if captured by Bankful)
- Transaction ID

## Callback URL
```
https://prc-checkout.prcpeptides.workers.dev/callback
```

This URL is now **automatically included** in every Bankful payment request. No manual configuration needed.

## Testing

### Test Payment Flow:
1. Add item to cart on prcpeptides.com
2. Go to checkout
3. Select "Credit/Debit Card"
4. Complete payment on Bankful HPP
5. Check:
   - ✅ Telegram notification received
   - ✅ Order logged in Google Sheet
   - ✅ Status = "Paid"

### Manual Test (simulate callback):
```bash
curl -X POST https://prc-checkout.prcpeptides.workers.dev/callback \
  -H "Content-Type: application/json" \
  -d '{
    "xtl_order_id": "PRC-TEST-001",
    "status": "APPROVED",
    "amount": 4200,
    "transaction_id": "test-123"
  }'
```

Check Telegram for notification.

## Google Apps Script Update (Optional)

If you want to extract more details from the Bankful callback, update your Apps Script to handle the `bankfulData` field:

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  
  // Existing fields...
  var orderId = data.orderId || '';
  var paymentMethod = data.paymentMethod || '';
  
  // NEW: Extract Bankful transaction details
  if (data.bankfulData) {
    var transactionId = data.bankfulData.transaction_id || '';
    var cardType = data.bankfulData.card_type || '';
    // Add these to your sheet if desired
  }
  
  // Rest of your existing code...
}
```

## What Happens Next

**Before (manual tracking):**
1. Customer pays via Bankful
2. Bankful sends YOU an email
3. You check Worker logs for order details
4. You manually ship

**After (automated):**
1. Customer pays via Bankful
2. Worker receives callback automatically
3. Order logged to sheet + Telegram notification sent
4. You ship (just check sheet/Telegram for new orders)

## Troubleshooting

### If callback doesn't work:
1. Check Cloudflare Worker logs: `wrangler tail`
2. Verify environment variables are set
3. Test callback endpoint manually (curl command above)
4. Check Bankful sends callbacks for test transactions

### If you get errors:
- **Worker deploy fails**: Make sure you're logged into Cloudflare (`wrangler login`)
- **No Telegram notifications**: Check bot token and chat ID are correct
- **Sheet not updating**: Verify Google Apps Script webhook URL

## Status

- ✅ Callback URL added to API requests
- ✅ Callback endpoint implemented
- ✅ Google Sheet integration ready
- ✅ Telegram notifications ready
- ⏳ **Waiting for you to deploy** (2 minutes)
- ⏳ **Waiting for first test payment** to confirm it works

## Deploy Now

```bash
cd /Users/frabrizio/.openclaw/workspace/prc-tools
wrangler publish cloudflare-worker-updated.js --name prc-checkout
```

Once deployed, the next credit card order will automatically trigger notifications. No more manual tracking needed.

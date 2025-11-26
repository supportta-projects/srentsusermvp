# PhonePe Webhook Configuration Guide

## ✅ Current Configuration Status

Based on your PhonePe dashboard:

- **Webhook URL**: `https://rentorent.net/` ❌ **INCORRECT**
- **Status**: Enabled ✅
- **Active Events**: 
  - `paylink.order.completed` ✅
  - `pg.order.completed` ✅

## 🔧 Required Changes

### 1. Update Webhook URL

**Current (Wrong):**
```
https://rentorent.net/
```

**Correct URL:**
```
https://rentorent.net/api/payments/phonepe/webhook
```

### 2. How to Update in PhonePe Dashboard

1. Login to PhonePe Merchant Dashboard: https://merchant.phonepe.com/
2. Navigate to **Settings** → **Webhooks** (or **API Settings** → **Webhooks**)
3. Find your existing webhook configuration
4. Click **Edit** or **Update**
5. Change the **Webhook URL** to:
   ```
   https://rentorent.net/api/payments/phonepe/webhook
   ```
6. Keep the same events:
   - ✅ `paylink.order.completed`
   - ✅ `pg.order.completed`
7. Click **Save** or **Update**

## 📋 Webhook Endpoint Details

**Endpoint**: `POST /api/payments/phonepe/webhook`

**What it does:**
- Receives payment status updates from PhonePe
- Verifies signature using X-VERIFY header
- Updates order status in Supabase
- Logs payment events for audit trail

**Expected Events:**
- `pg.order.completed` - Payment Gateway order completion
- `paylink.order.completed` - PayLink order completion

## ✅ Verification Checklist

After updating:

- [ ] Webhook URL is: `https://rentorent.net/api/payments/phonepe/webhook`
- [ ] Status is **Enabled**
- [ ] Events `paylink.order.completed` and `pg.order.completed` are active
- [ ] Test a payment to verify webhook is received
- [ ] Check server logs for webhook requests
- [ ] Verify orders are updated in Supabase

## 🧪 Testing the Webhook

1. Make a test payment through your checkout
2. Complete payment on PhonePe
3. Check your server logs for:
   ```
   📞 Webhook: Order status updated
   ```
4. Verify in Supabase `orders` table that status is updated
5. Check `payment_events` table for webhook event logs

## 🔍 Troubleshooting

### Webhook Not Received

1. **Check URL**: Ensure it's exactly `https://rentorent.net/api/payments/phonepe/webhook`
2. **Check SSL**: PhonePe requires HTTPS (you have it ✅)
3. **Check Server**: Ensure your server is running and accessible
4. **Check Logs**: Look for incoming POST requests to `/api/payments/phonepe/webhook`

### Webhook Received But Failing

1. **Check Signature**: Verify `X-VERIFY` header is being sent by PhonePe
2. **Check Environment**: Ensure `PHONEPE_SALT_KEY` and `PHONEPE_SALT_INDEX` are correct
3. **Check Logs**: Look for "Invalid signature" errors in server logs
4. **Check Response**: Webhook must return `200 OK` to PhonePe

### Webhook Returns 404

- Verify the route exists: `src/app/api/payments/phonepe/webhook/route.ts`
- Ensure the file exports a `POST` function
- Check Next.js deployment includes the API route

## 📝 Important Notes

1. **Webhook is Source of Truth**: The webhook updates order status even if redirect flow fails
2. **Idempotent**: Safe to receive the same webhook multiple times
3. **Always Return 200**: Even on errors, return 200 to prevent PhonePe retries (log errors instead)
4. **Signature Verification**: All webhooks are verified before processing

## 🔗 Related Files

- Webhook Handler: `src/app/api/payments/phonepe/webhook/route.ts`
- PhonePe Utils: `src/lib/phonepe.ts`
- Supabase Server: `src/lib/supabase-server.ts`


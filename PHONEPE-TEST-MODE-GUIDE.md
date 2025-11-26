# PhonePe Test Mode / Dummy Payment Guide

## ✅ Test Mode Enabled

Test mode is now **enabled** in your `.env.local` file. This allows you to test the complete payment flow without making real PhonePe API calls or charging real money.

## 🧪 How Test Mode Works

### 1. **Payment Creation**
- When you click "Pay with PhonePe" on checkout:
  - ✅ Order is created in Supabase
  - ✅ Payment event is logged
  - ✅ **No real PhonePe API call is made**
  - ✅ Returns a test redirect URL immediately

### 2. **Payment Processing**
- User is redirected to payment page
- Shows "🧪 Test Mode: Processing payment..." message
- Simulates 2-second payment processing delay
- **No real payment is made**

### 3. **Payment Status**
- Status check API simulates successful payment
- Order status is updated to "success" in Supabase
- Payment events are logged
- **No real PhonePe API call is made**

### 4. **Success Page**
- Shows success message with test mode indicator
- Displays order details
- Shows warning: "⚠️ This was a test payment. No real money was charged."

## 🎯 Complete Test Flow

```
1. User clicks "Pay with PhonePe"
   ↓
2. Order created in Supabase (status: 'created')
   ↓
3. Test mode detected → Skip PhonePe API call
   ↓
4. Redirect to: /payments/phonepe/redirect?txnId=...&test=true
   ↓
5. Shows "Processing payment..." (2 seconds)
   ↓
6. Status check → Simulates success
   ↓
7. Order updated to 'success' in Supabase
   ↓
8. Shows success page with test mode indicator
```

## 📋 What Gets Created

### In Supabase `orders` table:
- ✅ Order record with status: 'success'
- ✅ Amount, description, metadata all saved
- ✅ Transaction ID generated

### In Supabase `payment_events` table:
- ✅ `order_created` event
- ✅ `test_payment_initiated` event
- ✅ `test_payment_completed` event

## 🔧 Configuration

### Current Settings (`.env.local`):
```env
PHONEPE_TEST_MODE=true  # ← Test mode enabled
PHONEPE_MERCHANT_ID=M23B4TPENEB70
PHONEPE_SALT_KEY=... (not used in test mode)
```

### To Disable Test Mode:
```env
PHONEPE_TEST_MODE=false
# or remove the line entirely
```

## ✅ Testing Checklist

- [ ] Go to checkout page
- [ ] Select a subscription plan
- [ ] Apply coupon (optional)
- [ ] Click "Pay with PhonePe"
- [ ] See "Test Mode: Processing payment..." message
- [ ] Wait 2 seconds
- [ ] See success page with test indicator
- [ ] Check Supabase `orders` table - order should be 'success'
- [ ] Check `payment_events` table - should have test events
- [ ] Verify no real money was charged

## 🎨 UI Indicators

### During Processing:
- Shows: "🧪 Test Mode: Processing payment..."
- Message: "Simulating payment processing (no real payment will be made)"
- Yellow warning: "This is a test payment. No real money will be charged."

### On Success:
- Title: "🧪 Test Payment Successful!"
- Yellow banner: "⚠️ This was a test payment. No real money was charged."
- All order details displayed normally

## 🔍 Verification

### Check Order in Supabase:
```sql
SELECT * FROM orders 
WHERE status = 'success' 
ORDER BY created_at DESC 
LIMIT 5;
```

### Check Payment Events:
```sql
SELECT * FROM payment_events 
WHERE event_type LIKE 'test_%' 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🚀 Going Live

When ready for production:

1. **Disable Test Mode:**
   ```env
   PHONEPE_TEST_MODE=false
   ```

2. **Get Real PhonePe Credentials:**
   - Get Payment Gateway Salt Key (not OAuth)
   - Update `PHONEPE_SALT_KEY` in `.env.local`

3. **Update Vercel Environment Variables:**
   - Add `PHONEPE_TEST_MODE=false`
   - Add real `PHONEPE_SALT_KEY`

4. **Test with Real Payment:**
   - Make a small test payment
   - Verify it works with real PhonePe API

## 📝 Important Notes

1. **No Real Charges**: Test mode never charges real money
2. **Full Flow**: Test mode simulates the complete payment flow
3. **Database Updates**: Orders and events are created in Supabase
4. **Easy Switch**: Just change `PHONEPE_TEST_MODE` to enable/disable
5. **Development Default**: Test mode is enabled in development by default

## 🎉 You're Ready!

Test mode is now active. You can:
- ✅ Test the complete payment flow
- ✅ See how orders are created
- ✅ Verify payment events are logged
- ✅ Test the success/failure pages
- ✅ No real money will be charged

**Start testing by going to your checkout page and clicking "Pay with PhonePe"!**


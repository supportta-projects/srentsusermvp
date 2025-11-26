# PhonePe Integration Updated to Official Documentation

## ✅ Changes Made

The integration has been updated to follow PhonePe's official API documentation from:
https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration/api-integration-website

### 1. Updated API Endpoints

**Before:**
- Create Payment: `/pg/v1/pay`
- Status Check: `/pg/v1/status/{merchantId}/{merchantTransactionId}`

**After (Official):**
- Create Payment: `/checkout/v2/pay`
- Status Check: `/checkout/v2/order/{merchantOrderId}/status`

### 2. Updated Base URLs

**Sandbox:**
- Payment APIs: `https://api-preprod.phonepe.com/apis/pg-sandbox`
- Auth APIs: `https://api-preprod.phonepe.com/apis/identity-manager`

**Production:**
- Payment APIs: `https://api.phonepe.com/apis/pg`
- Auth APIs: `https://api.phonepe.com/apis/identity-manager`

### 3. Response Structure

Updated to match PhonePe's official response format:
```json
{
  "success": true,
  "code": "PAYMENT_INITIATED",
  "message": "Payment initiated successfully",
  "data": {
    "merchantId": "M23B4TPENEB70",
    "merchantTransactionId": "RENT_...",
    "instrumentResponse": {
      "type": "REDIRECT",
      "redirectInfo": {
        "url": "https://mercury-uat.phonepe.com/...",
        "method": "GET"
      }
    }
  }
}
```

## 🔧 Required Environment Variables

Update your `.env.local` with:

```env
# PhonePe Payment Gateway Credentials
PHONEPE_MERCHANT_ID=M23B4TPENEB70
PHONEPE_SALT_KEY=YOUR_SALT_KEY_HERE  # ← You need to add this
PHONEPE_SALT_INDEX=1

# Environment
PHONEPE_ENV=sandbox  # or 'production'
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox  # Sandbox
# PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg  # Production

# Application URLs
APP_BASE_URL=https://rentorent.net
NEXT_PUBLIC_SITE_URL=https://rentorent.net
```

## 📝 Next Steps

1. **Add Salt Key** to `.env.local`:
   - Get it from PhonePe Merchant Dashboard
   - Settings → API Credentials → Payment Gateway → Salt Key

2. **Restart Server**:
   ```bash
   npm run dev
   ```

3. **Test Payment**:
   - Go to checkout page
   - Try making a payment
   - Should redirect to PhonePe payment page

## 🔍 How to Get Salt Key

1. Login to PhonePe Merchant Dashboard: https://merchant.phonepe.com/
2. Navigate to: **Settings** → **API Credentials** → **Payment Gateway**
3. Find **Salt Key** (for sandbox/production)
4. Copy and add to `.env.local`:
   ```env
   PHONEPE_SALT_KEY=your-salt-key-here
   ```

## ✅ Verification

After adding Salt Key, verify:

- [ ] `PHONEPE_MERCHANT_ID` is set: `M23B4TPENEB70`
- [ ] `PHONEPE_SALT_KEY` is set (not empty)
- [ ] `PHONEPE_SALT_INDEX=1`
- [ ] Server restarted
- [ ] No "Key not found" error
- [ ] Payment redirects to PhonePe

## 📚 Official Documentation

- API Integration: https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration/api-integration-website
- API Reference: https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration/api-reference


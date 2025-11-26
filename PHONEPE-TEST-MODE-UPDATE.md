# PhonePe Test Mode vs Dummy Mode

## ✅ Updated: Now Using PhonePe's Actual Test/Sandbox API

The integration now properly distinguishes between:
1. **Test Mode** - Uses PhonePe's actual sandbox/test API (real API calls to test environment)
2. **Dummy Mode** - Completely simulates payments (no API calls at all)

## 🔧 Configuration

### Test Mode (PhonePe Sandbox API)
```env
PHONEPE_TEST_MODE=true
PHONEPE_DUMMY_MODE=false
PHONEPE_ENV=sandbox
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_MERCHANT_ID=M23B4TPENEB70
PHONEPE_SALT_KEY=your-sandbox-salt-key
```

**What happens:**
- ✅ Makes **real API calls** to PhonePe's sandbox/test environment
- ✅ Uses PhonePe's test payment gateway
- ✅ Tests actual API integration
- ✅ No real money charged (PhonePe's test environment)
- ✅ Tests real payment flow with PhonePe

### Dummy Mode (Complete Simulation)
```env
PHONEPE_TEST_MODE=false
PHONEPE_DUMMY_MODE=true
```

**What happens:**
- ✅ **No API calls** to PhonePe
- ✅ Completely simulates payment flow
- ✅ Instant responses
- ✅ Good for development/testing UI flow
- ✅ No PhonePe credentials needed

## 📋 Current Setup

Your `.env.local` is configured for **Test Mode** (PhonePe Sandbox):
```env
PHONEPE_TEST_MODE=true      # Use PhonePe's sandbox API
PHONEPE_DUMMY_MODE=false    # Don't use dummy simulation
PHONEPE_ENV=sandbox
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
```

## 🎯 How It Works Now

### With Test Mode Enabled:
1. User clicks "Pay with PhonePe"
2. **Real API call** to PhonePe sandbox: `/checkout/v2/pay`
3. PhonePe returns test payment URL
4. User redirected to PhonePe test payment page
5. User completes payment on PhonePe test environment
6. PhonePe redirects back with transaction ID
7. **Real API call** to PhonePe sandbox: `/checkout/v2/order/{id}/status`
8. Order updated based on PhonePe response

### What You Need:
- ✅ PhonePe Sandbox Merchant ID: `M23B4TPENEB70` ✅ (you have this)
- ✅ PhonePe Sandbox Salt Key: **You need to get this from PhonePe dashboard**
- ✅ PhonePe Sandbox Salt Index: Usually `1`

## 🔑 Getting PhonePe Sandbox Credentials

1. **Login to PhonePe Merchant Dashboard**
   - https://merchant.phonepe.com/

2. **Navigate to Sandbox/Test Credentials**
   - Settings → API Credentials → Payment Gateway
   - Look for **"Sandbox"** or **"Test"** section

3. **Get Sandbox Credentials:**
   - Sandbox Merchant ID (you have: `M23B4TPENEB70`)
   - Sandbox Salt Key (you need this)
   - Sandbox Salt Index (usually `1`)

4. **Update `.env.local`:**
   ```env
   PHONEPE_SALT_KEY=your-sandbox-salt-key-here
   ```

## 🧪 Testing Flow

### Test Mode (Current):
```
Checkout → Create Payment API
         ↓
    Real API call to PhonePe Sandbox
         ↓
    PhonePe returns test payment URL
         ↓
    User redirected to PhonePe test page
         ↓
    User completes test payment
         ↓
    PhonePe redirects back
         ↓
    Real API call to check status
         ↓
    Order updated based on PhonePe response
```

## ⚙️ Switching Modes

### To Use PhonePe Sandbox (Test Mode):
```env
PHONEPE_TEST_MODE=true
PHONEPE_DUMMY_MODE=false
PHONEPE_SALT_KEY=your-sandbox-salt-key
```

### To Use Complete Simulation (Dummy Mode):
```env
PHONEPE_TEST_MODE=false
PHONEPE_DUMMY_MODE=true
# PHONEPE_SALT_KEY not needed
```

### To Use Production:
```env
PHONEPE_TEST_MODE=false
PHONEPE_DUMMY_MODE=false
PHONEPE_ENV=production
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
PHONEPE_SALT_KEY=your-production-salt-key
```

## ✅ Next Steps

1. **Get PhonePe Sandbox Salt Key** from merchant dashboard
2. **Update `.env.local`** with sandbox salt key
3. **Test the flow** - it will make real API calls to PhonePe sandbox
4. **Complete test payment** on PhonePe's test payment page
5. **Verify order** is updated correctly

## 📝 Important Notes

- **Test Mode** = Real API calls to PhonePe's test environment
- **Dummy Mode** = No API calls, complete simulation
- **Production** = Real API calls to PhonePe's production environment
- Test Mode requires valid PhonePe sandbox credentials
- Dummy Mode works without any PhonePe credentials

You're now set up to use PhonePe's actual test/sandbox API! Just add the sandbox salt key and you're ready to test.


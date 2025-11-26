# Fix: "Key not found for the merchant" Error

## 🔍 What is the "Merchant Key"?

The **Merchant Key** refers to:
1. **PHONEPE_MERCHANT_ID** - Your merchant identifier
2. **PHONEPE_SALT_KEY** - Secret key for generating checksums

These are **Payment Gateway credentials**, NOT OAuth credentials.

## ❌ Common Causes

1. **Using OAuth credentials instead of Payment Gateway credentials**
   - OAuth Client ID/Secret ≠ Payment Gateway Merchant ID/Salt Key
   
2. **Wrong environment**
   - Using production credentials with sandbox URL (or vice versa)
   
3. **Mismatched credentials**
   - Merchant ID and Salt Key don't belong to the same account/environment

4. **Missing or incorrect Salt Index**
   - Usually should be `1`

## ✅ Solution: Get Correct Payment Gateway Credentials

### Step 1: Login to PhonePe Merchant Dashboard

1. Go to: **https://merchant.phonepe.com/**
2. Login with your merchant account

### Step 2: Find Payment Gateway Credentials

Navigate to one of these paths (varies by dashboard version):

**Option A:**
- **Settings** → **API Credentials** → **Payment Gateway**
- Look for **"Merchant ID"** and **"Salt Key"**

**Option B:**
- **Settings** → **Payment Gateway** → **API Settings**
- Find **Merchant ID** and **Salt Key**

**Option C:**
- **Developer** → **API Credentials** → **Payment Gateway**
- Copy **Merchant ID** and **Salt Key**

### Step 3: Get Sandbox Credentials (for testing)

1. Look for **"Sandbox"** or **"Test"** environment section
2. Copy:
   - **Merchant ID** (for sandbox)
   - **Salt Key** (for sandbox)
   - **Salt Index** (usually `1`)

### Step 4: Update Your .env.local

```env
# PhonePe Payment Gateway Credentials (NOT OAuth)
PHONEPE_MERCHANT_ID=YOUR_MERCHANT_ID_HERE
PHONEPE_SALT_KEY=YOUR_SALT_KEY_HERE
PHONEPE_SALT_INDEX=1

# Environment
PHONEPE_ENV=sandbox
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# Application URLs
APP_BASE_URL=https://rentorent.net
NEXT_PUBLIC_SITE_URL=https://rentorent.net
```

### Step 5: Restart Server

After updating `.env.local`:
```bash
# Stop server (Ctrl+C) and restart
npm run dev
```

## 🔑 Difference: OAuth vs Payment Gateway

### OAuth Credentials (What you might have)
```
Client ID: SU2505202010385674968962
Client Secret: 9eb5f4be-0f8e-4379-83c8-82da65f06b50
```
**Used for**: API authentication, getting access tokens  
**NOT used for**: Payment transactions

### Payment Gateway Credentials (What you need)
```
Merchant ID: M123456789 (or similar format)
Salt Key: abc123def456... (different from client secret)
Salt Index: 1
```
**Used for**: Creating payment transactions  
**Required for**: Payment gateway integration

## 📋 Verification Checklist

Check your `.env.local` has:

- [ ] `PHONEPE_MERCHANT_ID` - Payment Gateway Merchant ID (not OAuth Client ID)
- [ ] `PHONEPE_SALT_KEY` - Payment Gateway Salt Key (not OAuth Client Secret)
- [ ] `PHONEPE_SALT_INDEX=1` - Usually 1
- [ ] `PHONEPE_BASE_URL` - Matches environment (sandbox/production)
- [ ] `PHONEPE_ENV=sandbox` - For testing

## 🧪 Test Your Configuration

After updating credentials, test:

1. **Check logs** - Should see:
   ```
   📞 PhonePe Payment Request: { merchantTransactionId: ... }
   ```

2. **Try payment** - Should redirect to PhonePe (not show "Key not found")

3. **Check error** - If still error, verify:
   - Merchant ID format is correct
   - Salt Key is complete (no truncation)
   - Environment matches (sandbox credentials with sandbox URL)

## 🆘 Still Can't Find Credentials?

### Contact PhonePe Support

1. **Email**: support@phonepe.com
2. **Dashboard**: Use help/support section in merchant dashboard
3. **Phone**: Check merchant dashboard for support number

**Ask them:**
> "I need Payment Gateway API credentials (Merchant ID and Salt Key) for payment integration. I currently have OAuth credentials but need Payment Gateway credentials."

### Temporary: Enable Test Mode

While waiting for credentials:

```env
PHONEPE_TEST_MODE=true
```

This simulates payments without calling PhonePe API.

## 🔍 Debug: Check Current Configuration

Run this to see what's configured:

```bash
# Check environment variables (without showing values)
Get-Content .env.local | Select-String "PHONEPE" | ForEach-Object { $_.Line -replace '=.*', '=***' }
```

## 📝 Example Correct Configuration

```env
# ✅ CORRECT - Payment Gateway Credentials
PHONEPE_MERCHANT_ID=M123456789
PHONEPE_SALT_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# ❌ WRONG - OAuth Credentials (don't use for payments)
# PHONEPE_CLIENT_ID=SU2505202010385674968962
# PHONEPE_CLIENT_SECRET=9eb5f4be-0f8e-4379-83c8-82da65f06b50
```

## 🎯 Quick Fix Steps

1. ✅ Login to PhonePe Merchant Dashboard
2. ✅ Find **Payment Gateway** section (not OAuth)
3. ✅ Copy **Merchant ID** and **Salt Key** (sandbox)
4. ✅ Add to `.env.local`
5. ✅ Restart server
6. ✅ Test payment


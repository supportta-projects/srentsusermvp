# PhonePe Credentials Guide

## Important: Understanding PhonePe Credentials

The error **"Key not found for the merchant"** typically means:

1. **Wrong Credential Type**: The credentials you have might be **OAuth credentials** (Client ID/Secret) rather than **Payment Gateway credentials** (Merchant ID/Salt Key)
2. **Wrong Environment**: Credentials might be for production but you're using sandbox URL (or vice versa)
3. **Mismatched Credentials**: Merchant ID and Salt Key don't match in PhonePe system

## PhonePe Has Two Types of Credentials

### 1. OAuth Credentials (for API access)
- **Client ID**: `SU2505202010385674968962`
- **Client Secret**: `9eb5f4be-0f8e-4379-83c8-82da65f06b50`
- Used for: API authentication, getting access tokens
- **NOT used for**: Payment gateway transactions

### 2. Payment Gateway Credentials (for payments)
- **Merchant ID**: Different format (usually shorter, e.g., `M123456789`)
- **Salt Key**: Different from client secret
- **Salt Index**: Usually `1`
- Used for: Creating payment transactions
- **Required for**: Payment gateway integration

## How to Get Payment Gateway Credentials

1. **Login to PhonePe Merchant Dashboard**
   - Go to: https://merchant.phonepe.com/
   - Login with your merchant account

2. **Navigate to API Settings**
   - Look for "API Credentials" or "Payment Gateway Settings"
   - Find "Merchant ID" and "Salt Key" (not Client ID/Secret)

3. **Get Sandbox Credentials** (for testing)
   - Look for "Sandbox" or "Test" environment
   - Copy the Merchant ID and Salt Key for sandbox

4. **Get Production Credentials** (for live)
   - Look for "Production" or "Live" environment
   - Copy the Merchant ID and Salt Key for production

## Current Issue

The credentials you provided (`SU2505202010385674968962` and `9eb5f4be-0f8e-4379-83c8-82da65f06b50`) appear to be **OAuth credentials**, not **Payment Gateway credentials**.

## Solution Steps

### Option 1: Get Correct Payment Gateway Credentials

1. Contact PhonePe support or check your merchant dashboard
2. Get the actual **Merchant ID** and **Salt Key** for payment gateway
3. Update your `.env.local`:

```env
PHONEPE_MERCHANT_ID=YOUR_ACTUAL_MERCHANT_ID
PHONEPE_SALT_KEY=YOUR_ACTUAL_SALT_KEY
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
```

### Option 2: Use Test Mode (Temporary)

Until you get the correct credentials, you can enable test mode:

```env
PHONEPE_TEST_MODE=true
```

This will simulate payments without calling PhonePe API.

### Option 3: Check PhonePe Dashboard

1. Login to PhonePe Merchant Dashboard
2. Go to **Settings** → **API Credentials**
3. Look for **Payment Gateway** section (not OAuth section)
4. Copy:
   - **Merchant ID** (for payments)
   - **Salt Key** (for payments)
   - **Salt Index** (usually 1)

## Environment Variables Format

```env
# Payment Gateway Credentials (NOT OAuth)
PHONEPE_MERCHANT_ID=M123456789          # Payment gateway merchant ID
PHONEPE_SALT_KEY=your-salt-key-here     # Payment gateway salt key
PHONEPE_SALT_INDEX=1                    # Usually 1

# OAuth Credentials (if needed for other APIs)
PHONEPE_CLIENT_ID=SU2505202010385674968962
PHONEPE_CLIENT_SECRET=9eb5f4be-0f8e-4379-83c8-82da65f06b50

# API URLs
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox  # Sandbox
# PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg-sandbox        # Production

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Local
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # Production
```

## Verification Checklist

- [ ] I have Payment Gateway Merchant ID (not OAuth Client ID)
- [ ] I have Payment Gateway Salt Key (not OAuth Client Secret)
- [ ] Merchant ID and Salt Key are from the same environment (sandbox/production)
- [ ] API URL matches the environment (sandbox/production)
- [ ] Salt Index is correct (usually 1)
- [ ] Credentials are added to `.env.local`
- [ ] Server restarted after adding credentials

## Contact PhonePe Support

If you can't find the payment gateway credentials:

1. **Email**: support@phonepe.com
2. **Phone**: Check PhonePe merchant dashboard for support number
3. **Dashboard**: Use the support/help section in merchant dashboard

Ask them:
- "I need Payment Gateway API credentials (Merchant ID and Salt Key) for integration"
- "I have OAuth credentials but need Payment Gateway credentials"
- "Please provide sandbox credentials for testing"

## Test Mode (Temporary Solution)

While waiting for correct credentials, enable test mode:

```env
PHONEPE_TEST_MODE=true
```

This allows you to:
- Test the payment flow
- See how the integration works
- Develop without real API calls

**Note**: Test mode simulates payments - no real money is processed.


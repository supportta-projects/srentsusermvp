# PhonePe Payment Gateway Setup

## Environment Variables

Add these to your `.env.local` file and Vercel environment variables:

```env
# PhonePe Configuration
PHONEPE_MERCHANT_ID=SU2505202010385674968962
PHONEPE_SALT_KEY=9eb5f4be-0f8e-4379-83c8-82da65f06b50
PHONEPE_SALT_INDEX=1

# Alternative naming (also supported)
PHONEPE_CLIENT_ID=SU2505202010385674968962
PHONEPE_CLIENT_SECRET=9eb5f4be-0f8e-4379-83c8-82da65f06b50

# PhonePe API Base URL
# For testing/sandbox:
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
# For production:
# PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg-sandbox

# Test mode (set to 'true' for testing, 'false' for production)
PHONEPE_TEST_MODE=true

# Site URL for callbacks
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Current Credentials

- **Merchant ID (Client ID)**: `SU2505202010385674968962`
- **Salt Key (Client Secret)**: `9eb5f4be-0f8e-4379-83c8-82da65f06b50`
- **Salt Index**: `1` (default)

## Setup Steps

1. **Add to `.env.local`** (for local development):
   ```bash
   PHONEPE_MERCHANT_ID=SU2505202010385674968962
   PHONEPE_SALT_KEY=9eb5f4be-0f8e-4379-83c8-82da65f06b50
   PHONEPE_SALT_INDEX=1
   PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. **Add to Vercel** (for production):
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add all the variables listed above
   - For production, set:
     - `PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg-sandbox`
     - `PHONEPE_TEST_MODE=false`
     - `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`

## Testing

The integration supports test mode. When `PHONEPE_TEST_MODE=true` or in development, payments will be simulated.

## Payment Flow

1. User selects subscription plan
2. User can apply coupon code (e.g., `9526846201` for ₹1 subscription)
3. User clicks "Pay" button
4. Redirects to PhonePe payment page
5. After payment, PhonePe redirects back to success page
6. PhonePe sends callback to `/api/phonepe/callback` for verification

## Callback URL

Make sure your callback URL is configured in PhonePe dashboard:
- **Callback URL**: `https://yourdomain.com/api/phonepe/callback`
- **Redirect URL**: `https://yourdomain.com/subscribe/success?plan={planId}`

## Security Notes

- Never commit `.env.local` to version control
- Keep your Salt Key secret
- Use HTTPS in production
- Verify all callbacks using the signature verification


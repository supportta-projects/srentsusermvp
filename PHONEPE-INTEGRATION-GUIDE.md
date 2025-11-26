# PhonePe Payment Gateway Integration Guide

## Complete Production-Ready Implementation

This guide documents the complete PhonePe payment gateway integration for the Rentorent rental SaaS platform.

## 📋 Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Database Schema](#database-schema)
3. [API Routes](#api-routes)
4. [Frontend Pages](#frontend-pages)
5. [Payment Flow](#payment-flow)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)

## 🔧 Setup & Configuration

### 1. Environment Variables

Add these to your `.env.local` and Vercel:

```env
# PhonePe Payment Gateway Configuration
PHONEPE_ENV=sandbox  # or 'production'
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox  # Sandbox
# PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg-sandbox  # Production

# Application URLs
APP_BASE_URL=http://localhost:3000  # Local
# APP_BASE_URL=https://yourdomain.com  # Production
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Local
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # Production

# Supabase Configuration (for orders/payments)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Required for backend operations
```

### 2. Get PhonePe Credentials

1. Login to PhonePe Merchant Dashboard: https://merchant.phonepe.com/
2. Navigate to **Settings** → **API Credentials** → **Payment Gateway**
3. Copy:
   - **Merchant ID** (for payments)
   - **Salt Key** (for payments)
   - **Salt Index** (usually `1`)

**Important**: These are different from OAuth Client ID/Secret!

### 3. Run Database Schema

Execute `supabase-payments-schema.sql` in your Supabase SQL Editor to create:
- `orders` table
- `payment_events` table
- Indexes and RLS policies

## 🗄️ Database Schema

### Orders Table

Stores payment orders:

```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- phonepe_txn_id (TEXT, UNIQUE) - merchantTransactionId
- status (TEXT) - created, pending, success, failed, cancelled
- amount_paise (BIGINT) - amount in paise
- currency (TEXT) - INR
- description (TEXT)
- metadata (JSONB) - rental details
- created_at, updated_at
```

### Payment Events Table

Audit trail of all payment events:

```sql
- id (UUID, PK)
- order_id (UUID, FK to orders)
- event_type (TEXT) - order_created, phonepe_webhook, status_check, etc.
- payload (JSONB) - event data
- created_at
```

## 🔌 API Routes

### 1. Create Payment

**POST** `/api/payments/phonepe/create`

Creates order and initiates PhonePe payment.

**Request:**
```json
{
  "userId": "user-uuid",
  "planId": "monthly",
  "amount": 1499.18,  // Amount in rupees (will be converted to paise)
  "description": "Subscription: Basic Plan",
  "metadata": {
    "planId": "monthly",
    "planName": "Basic",
    "couponCode": "9526846201"
  },
  "vendorPhone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://mercury-uat.phonepe.com/transact/...",
  "orderId": "order-uuid",
  "transactionId": "RENT_1234567890_abc123"
}
```

### 2. Check Payment Status

**GET** `/api/payments/phonepe/status?txnId={merchantTransactionId}`

Checks payment status with PhonePe and updates order.

**Response:**
```json
{
  "status": "success",
  "orderId": "order-uuid",
  "transactionId": "RENT_1234567890_abc123",
  "amount": 1499.18,
  "amountRupees": 1499.18,
  "phonepeStatus": "SUCCESS"
}
```

### 3. Webhook Handler

**POST** `/api/payments/phonepe/webhook`

Receives server-to-server notifications from PhonePe.

**Headers:**
- `X-VERIFY`: Signature for verification

**Body:**
```json
{
  "response": "base64_encoded_payload"
}
```

## 🎨 Frontend Pages

### 1. Checkout Page

**Path:** `/checkout`

- Shows billing details
- Coupon input section
- Order summary with GST
- "Pay with PhonePe" button

### 2. Payment Redirect Page

**Path:** `/payments/phonepe/redirect?txnId={transactionId}`

- Shows "Processing payment..." loader
- Calls status API to check payment
- Displays success/failure/pending states
- Handles retries for pending payments

## 🔄 Payment Flow

```
1. User clicks "Pay with PhonePe"
   ↓
2. Frontend calls /api/payments/phonepe/create
   ↓
3. Backend:
   - Creates order in Supabase (status: 'created')
   - Builds PhonePe payment request
   - Generates X-VERIFY checksum
   - Calls PhonePe /pg/v1/pay API
   ↓
4. Backend returns redirectUrl to frontend
   ↓
5. Frontend redirects user to PhonePe payment page
   ↓
6. User completes payment on PhonePe
   ↓
7. PhonePe redirects to /payments/phonepe/redirect?txnId=...
   ↓
8. Redirect page calls /api/payments/phonepe/status
   ↓
9. Backend:
   - Calls PhonePe /pg/v1/status API
   - Updates order status in Supabase
   - Returns status to frontend
   ↓
10. Frontend shows success/failure page
    ↓
11. (Async) PhonePe sends webhook to /api/payments/phonepe/webhook
    - Webhook is source of truth
    - Updates order if status differs
```

## ✅ Security Features

1. **No Secrets in Frontend**
   - SALT_KEY never exposed to browser
   - All API calls server-side

2. **Checksum Verification**
   - All PhonePe API calls use X-VERIFY header
   - Webhook signature verified before processing

3. **Idempotent Updates**
   - Order updates safe to retry
   - Webhook + redirect can both update safely

4. **RLS Policies**
   - Users can only see their own orders
   - Service role for backend operations

## 🧪 Testing

### Test Mode

Enable test mode to simulate payments:

```env
PHONEPE_TEST_MODE=true
```

### Test Scenarios

1. **Successful Payment**
   - Complete payment on PhonePe
   - Verify order status = 'success'
   - Check payment_events logged

2. **Failed Payment**
   - Cancel on PhonePe
   - Verify order status = 'failed'
   - Check error handling

3. **Pending Payment**
   - Start payment but don't complete
   - Verify status check retries
   - Verify webhook updates later

4. **Webhook Only**
   - Simulate webhook without redirect
   - Verify order updates correctly

## 🚀 Production Deployment

### Checklist

- [ ] Run `supabase-payments-schema.sql` in production Supabase
- [ ] Add all environment variables to Vercel
- [ ] Get production PhonePe credentials
- [ ] Update `PHONEPE_BASE_URL` to production
- [ ] Update `APP_BASE_URL` to production domain
- [ ] Configure webhook URL in PhonePe dashboard:
  - `https://yourdomain.com/api/payments/phonepe/webhook`
- [ ] Test payment flow in production
- [ ] Monitor payment_events table for issues
- [ ] Set up alerts for failed payments

### PhonePe Dashboard Configuration

1. **Callback URL**: `https://yourdomain.com/api/payments/phonepe/webhook`
2. **Redirect URL Pattern**: `https://yourdomain.com/payments/phonepe/redirect`
3. **Merchant ID**: Match your environment variable
4. **Salt Key**: Match your environment variable

## 📊 Monitoring

### Key Metrics to Monitor

1. **Order Status Distribution**
   ```sql
   SELECT status, COUNT(*) 
   FROM orders 
   GROUP BY status;
   ```

2. **Payment Events by Type**
   ```sql
   SELECT event_type, COUNT(*) 
   FROM payment_events 
   GROUP BY event_type;
   ```

3. **Failed Payments**
   ```sql
   SELECT * FROM orders 
   WHERE status = 'failed' 
   ORDER BY created_at DESC;
   ```

## 🐛 Troubleshooting

### Common Issues

1. **"Key not found for the merchant"**
   - Verify Merchant ID and Salt Key are correct
   - Ensure they're Payment Gateway credentials (not OAuth)
   - Check environment variables are loaded

2. **"Invalid signature"**
   - Verify Salt Key matches PhonePe dashboard
   - Check Salt Index is correct
   - Ensure checksum calculation matches PhonePe spec

3. **Orders not created**
   - Check SUPABASE_SERVICE_ROLE_KEY is set
   - Verify orders table exists
   - Check RLS policies allow service role

4. **Webhook not received**
   - Verify webhook URL in PhonePe dashboard
   - Check server logs for incoming requests
   - Ensure webhook endpoint returns 200 OK

## 📝 Files Created

- `supabase-payments-schema.sql` - Database schema
- `src/lib/phonepe.ts` - PhonePe utilities
- `src/lib/supabase-server.ts` - Supabase server client
- `src/app/api/payments/phonepe/create/route.ts` - Create payment API
- `src/app/api/payments/phonepe/status/route.ts` - Status check API
- `src/app/api/payments/phonepe/webhook/route.ts` - Webhook handler
- `src/app/payments/phonepe/redirect/page.tsx` - Redirect page

## 🔗 Related Documentation

- PhonePe Developer Docs: https://developer.phonepe.com/
- Supabase Docs: https://supabase.com/docs


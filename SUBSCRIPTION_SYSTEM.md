# Subscription System Implementation

## Overview

Complete subscription system for vendors in the marketplace. Vendors can subscribe to monthly, quarterly, or yearly plans using Razorpay payment gateway.

## ✅ What's Been Implemented

### 1. Data Models (`src/types/index.ts`)
- ✅ `SubscriptionPlan` - Subscription plan structure
- ✅ `VendorSubscription` - Vendor subscription details
- ✅ `SubscriptionPayment` - Payment transaction records

### 2. Firestore Collections
- ✅ `subscription_plans` - Static subscription plans data
- ✅ `vendor_subscriptions` - One document per vendor (document ID = vendorId)
- ✅ `subscription_payments` - Payment history records

### 3. Security Rules (`firestore.rules`)
- ✅ Added rules for subscription collections (additive only, no breaking changes)
- ✅ Vendors can read/write their own subscriptions
- ✅ Admins can read/update all subscriptions
- ✅ Payment records protected

### 4. Helper Functions (`src/lib/subscriptions.ts`)
- ✅ `getSubscriptionPlans()` - Get all active plans
- ✅ `getSubscriptionPlan()` - Get plan by ID
- ✅ `getVendorSubscription()` - Get vendor's subscription
- ✅ `hasActiveSubscription()` - Check if vendor has active subscription
- ✅ `createVendorSubscription()` - Create/update subscription
- ✅ `createSubscriptionPayment()` - Create payment record
- ✅ `getVendorPayments()` - Get payment history

### 5. Razorpay API Routes
- ✅ `/api/razorpay/create-order` - Create Razorpay order
- ✅ `/api/razorpay/verify-payment` - Verify payment signature
- ✅ `/api/razorpay/webhook` - Handle Razorpay webhooks

### 6. UI Components
- ✅ `SubscriptionPlans` - Display subscription plans with selection
- ✅ `SubscriptionStatus` - Show current subscription status
- ✅ Subscription page at `/vendor/subscription`

### 7. Seed Script
- ✅ `scripts/seed-subscription-plans.ts` - Seed default plans
- ✅ Command: `pnpm run seed-plans`

## 📋 Setup Instructions

### Step 1: Install Dependencies

```bash
pnpm install
```

This will install Razorpay SDK (`razorpay` package).

### Step 2: Configure Environment Variables

Add to `.env.local`:

**Option 1: Use Dummy/Test Credentials (Recommended for Development)**
```env
# Razorpay Configuration - Test/Dummy Mode
RAZORPAY_KEY_ID=rzp_test_dummy123
RAZORPAY_KEY_SECRET=dummy_secret_123
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_dummy123
RAZORPAY_WEBHOOK_SECRET=dummy_webhook_secret
```

**Option 2: Use Real Razorpay Test Credentials**
```env
# Get from Razorpay Dashboard → Settings → API Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Option 3: Use Live Credentials (Production Only)**
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Test Mode Features:**
- ✅ Dummy credentials work out of the box
- ✅ Payment flow is simulated (no real charges)
- ✅ Subscription is activated automatically
- ✅ Perfect for development and testing
- ✅ No Razorpay account needed for testing

**Get Real Razorpay Credentials (Optional):**
1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Generate Test Key ID and Key Secret
4. For webhook secret, go to Settings → Webhooks

### Step 3: Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### Step 4: Seed Subscription Plans

```bash
pnpm run seed-plans
```

This creates three default plans:
- **Monthly Plan**: ₹999/month (30 days)
- **Quarterly Plan**: ₹2499/3 months (90 days) - Saves ₹498
- **Yearly Plan**: ₹8999/year (365 days) - Saves ₹2989

### Step 5: Configure Razorpay Webhook

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/razorpay/webhook`
3. Select events: `payment.captured`
4. Copy webhook secret to `.env.local`

## 🎯 Usage

### For Vendors

1. **Access Subscription Page:**
   - Navigate to `/vendor/subscription`
   - Must be logged in as vendor

2. **View Current Subscription:**
   - See subscription status
   - View plan details
   - Check days remaining

3. **Subscribe/Renew:**
   - Select a plan
   - Click "Pay" button
   - Complete Razorpay checkout
   - Subscription activated automatically

### For Developers

**Check Subscription Status:**
```typescript
import { hasActiveSubscription } from '@/lib/subscriptions';

const isActive = await hasActiveSubscription(vendorId);
if (!isActive) {
  // Redirect to subscription page
}
```

**Get Vendor Subscription:**
```typescript
import { getVendorSubscription } from '@/lib/subscriptions';

const subscription = await getVendorSubscription(vendorId);
if (subscription?.status === 'active') {
  // Vendor has active subscription
}
```

## 🔒 Security

- ✅ Payment signature verification
- ✅ Webhook signature verification
- ✅ Firestore security rules
- ✅ Vendor can only access their own subscription
- ✅ Admin can manage all subscriptions

## 📊 Subscription Plans

### Monthly Plan
- **Price**: ₹999
- **Duration**: 30 days
- **Features**: Full access, unlimited listings, email support

### Quarterly Plan
- **Price**: ₹2499
- **Duration**: 90 days
- **Features**: All monthly features + priority support + save ₹498

### Yearly Plan
- **Price**: ₹8999
- **Duration**: 365 days
- **Features**: All quarterly features + phone support + save ₹2989

## 🔄 Subscription Flow

```
1. Vendor visits /vendor/subscription
2. Views available plans
3. Selects a plan
4. Clicks "Pay" button
5. Razorpay checkout opens
6. Vendor completes payment
7. Payment verified via API
8. Subscription created/updated in Firestore
9. Vendor subscription status: 'active'
10. Vendor can access platform
```

## 🚨 Important Notes

### Safety Measures
- ✅ **No breaking changes** - All new collections, no modifications to existing
- ✅ **Additive security rules** - Only added new rules, didn't modify existing
- ✅ **Backward compatible** - Existing vendors not affected
- ✅ **Safe to deploy** - Won't break existing vendor app

### Integration Points
- Subscription check should be added to vendor app (future)
- Deactivation module remains independent
- Subscription expiry can trigger deactivation (optional)

## 📝 Next Steps

1. **Test Subscription Flow:**
   - Test with Razorpay test mode
   - Verify payment processing
   - Test webhook handling

2. **Add to Vendor App (Future):**
   - Add subscription check middleware
   - Show subscription status in vendor dashboard
   - Handle subscription expiry

3. **Admin Panel (Future):**
   - View all subscriptions
   - Manage subscription plans
   - View payment history

## 🧪 Test Mode

The system includes built-in test mode that works with dummy credentials:

**Features:**
- ✅ Works without real Razorpay account
- ✅ Simulates payment flow
- ✅ Automatically activates subscription
- ✅ Shows test mode indicators
- ✅ Safe for development

**How to Use:**
1. Use dummy credentials in `.env.local` (already configured)
2. Go to `/vendor/subscription`
3. Select a plan and click "Pay"
4. Payment will be simulated automatically
5. Subscription activates after 2 seconds

**Test Mode Indicators:**
- Console shows: `🧪 TEST MODE: Using dummy Razorpay order`
- Alert shows: `🧪 TEST MODE: Payment will be simulated`
- Success message: `✅ Test Payment Successful!`

## 🐛 Troubleshooting

**Payment not processing:**
- Check Razorpay credentials in `.env.local`
- If using dummy credentials, test mode should work automatically
- Check browser console for errors
- Verify environment variables are loaded

**Test mode not working:**
- Make sure `.env.local` has dummy credentials
- Check browser console for test mode messages
- Verify no real Razorpay credentials are overriding

**Webhook not working:**
- Webhooks not needed for test mode
- For production, verify webhook URL is correct
- Check webhook secret matches
- Test webhook in Razorpay dashboard

**Subscription not activating:**
- Check Firestore security rules
- Verify payment verification API
- Check browser console for errors
- In test mode, check console for test mode messages

## 📚 Files Created/Modified

### New Files
- `src/lib/subscriptions.ts` - Subscription helper functions
- `src/app/api/razorpay/create-order/route.ts` - Create order API
- `src/app/api/razorpay/verify-payment/route.ts` - Verify payment API
- `src/app/api/razorpay/webhook/route.ts` - Webhook handler
- `src/components/subscriptions/SubscriptionPlans.tsx` - Plans component
- `src/components/subscriptions/SubscriptionStatus.tsx` - Status component
- `src/app/vendor/subscription/page.tsx` - Subscription page
- `scripts/seed-subscription-plans.ts` - Seed script

### Modified Files
- `src/types/index.ts` - Added subscription types
- `firestore.rules` - Added subscription rules (additive)
- `package.json` - Added Razorpay dependency
- `SETUP.md` - Added Razorpay configuration

## ✅ Testing Checklist

- [ ] Install dependencies: `pnpm install`
- [ ] Add Razorpay credentials to `.env.local`
- [ ] Deploy security rules: `firebase deploy --only firestore:rules`
- [ ] Seed plans: `pnpm run seed-plans`
- [ ] Test subscription page: `/vendor/subscription`
- [ ] Test payment flow (Razorpay test mode)
- [ ] Verify subscription creation in Firestore
- [ ] Test webhook (if configured)

---

**Status**: ✅ Complete - Ready for testing  
**Last Updated**: November 23, 2024


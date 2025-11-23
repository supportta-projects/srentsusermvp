# Razorpay Test Mode Guide

## 🧪 Test Mode Overview

The subscription system includes built-in **test mode** that works with dummy credentials. This allows you to test the complete subscription flow without needing a real Razorpay account or making actual payments.

## ✅ Quick Start (Test Mode)

### Step 1: Add Dummy Credentials to `.env.local`

```env
# Razorpay Configuration - Test/Dummy Mode
RAZORPAY_KEY_ID=rzp_test_dummy123
RAZORPAY_KEY_SECRET=dummy_secret_123
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_dummy123
RAZORPAY_WEBHOOK_SECRET=dummy_webhook_secret
```

### Step 2: Test the Subscription Flow

1. Start your development server:
   ```bash
   pnpm run dev
   ```

2. Navigate to subscription page:
   ```
   http://localhost:3000/vendor/subscription
   ```

3. Select a plan and click "Pay"

4. Test mode will automatically:
   - Simulate payment (no real Razorpay checkout)
   - Show test mode alert
   - Activate subscription after 2 seconds
   - Show success message

## 🎯 How Test Mode Works

### Automatic Detection

The system automatically detects test mode when:
- Dummy credentials are used (`rzp_test_dummy123`)
- No real Razorpay credentials are set
- Key ID contains "dummy" or "test"

### Test Mode Flow

```
1. User selects plan
   ↓
2. System detects test mode
   ↓
3. Creates mock order (no Razorpay API call)
   ↓
4. Simulates payment after 2 seconds
   ↓
5. Skips signature verification
   ↓
6. Activates subscription automatically
   ↓
7. Shows success message
```

### Test Mode Indicators

**Console Messages:**
- `🧪 TEST MODE: Using dummy Razorpay order`
- `🧪 TEST MODE: Skipping payment signature verification`
- `🧪 TEST MODE: Simulating payment...`

**User Messages:**
- Alert: `🧪 TEST MODE: Payment will be simulated. No real payment will be processed.`
- Success: `✅ Test Payment Successful! Subscription activated. (This was a test payment)`

## 📋 Test Mode Features

✅ **No Razorpay Account Needed**
- Works with dummy credentials
- No API calls to Razorpay
- Perfect for development

✅ **Full Flow Testing**
- Complete subscription flow
- Payment simulation
- Subscription activation
- Status updates

✅ **Safe Testing**
- No real payments
- No charges
- Can test repeatedly

✅ **Realistic Experience**
- Same UI as production
- Same flow as production
- Easy to switch to real credentials

## 🔄 Switching to Real Credentials

When you're ready to use real Razorpay:

### Option 1: Razorpay Test Account (Recommended for Testing)

1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Generate **Test** Key ID and Secret
4. Update `.env.local`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Option 2: Razorpay Live Account (Production)

1. Complete Razorpay KYC
2. Get **Live** credentials
3. Update `.env.local`:

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## 🧪 Testing Checklist

- [ ] Dummy credentials added to `.env.local`
- [ ] Development server running
- [ ] Navigate to `/vendor/subscription`
- [ ] Select a subscription plan
- [ ] Click "Pay" button
- [ ] See test mode alert
- [ ] Wait 2 seconds for simulation
- [ ] See success message
- [ ] Check subscription status updated
- [ ] Verify subscription in Firestore

## 🐛 Troubleshooting Test Mode

**Test mode not working:**
- Check `.env.local` has dummy credentials
- Verify no real Razorpay credentials overriding
- Check browser console for test mode messages
- Restart development server after changing `.env.local`

**Payment not simulating:**
- Check browser console for errors
- Verify JavaScript is enabled
- Check network tab for API calls
- Look for test mode console messages

**Subscription not activating:**
- Check Firestore security rules deployed
- Verify vendor is logged in
- Check browser console for errors
- Verify Firestore connection

## 📝 Notes

- Test mode is **automatically enabled** with dummy credentials
- No code changes needed to switch between test and live mode
- Just update environment variables
- Test mode works in development and can be used in staging
- Always use live credentials in production

## 🔒 Security

- Test mode credentials are safe to commit (they're dummy values)
- Real credentials should **never** be committed
- Use `.env.local` for local development
- Use Vercel environment variables for production

---

**Status**: ✅ Ready to use  
**Last Updated**: November 23, 2024


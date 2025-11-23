# Firebase Setup Guide

This guide will help you connect Firebase to your Next.js marketplace application.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "rentorent")
   - Enable Google Analytics (optional)
   - Complete project creation

## Step 2: Enable Firebase Services

### Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll add security rules later)
4. Select a location (choose closest to your users)
5. Click "Enable"

### Enable Authentication

1. Go to **Build** → **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web icon** (`</>`)
4. Register app with a nickname (e.g., "rentorent-web")
5. Copy the Firebase configuration object

## Step 4: Update Environment Variables

Create or update `.env.local` file in the project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_dummy123
RAZORPAY_KEY_SECRET=dummy_secret_123
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_dummy123
RAZORPAY_WEBHOOK_SECRET=dummy_webhook_secret
```

**Important:** Replace the placeholder values with your actual Firebase credentials.

## Step 5: Deploy Firestore Security Rules

1. Make sure you have Firebase CLI installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Use existing `firestore.rules` file
   - Use existing `firestore.indexes.json` file

4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Step 6: Verify Firebase Connection

Run the verification script:

```bash
pnpm run verify-firebase
```

This will:
- Check if all environment variables are set
- Test Firestore read/write operations
- Verify Firebase Auth initialization
- Show connection status

**Expected output:**
```
✅ Firebase connection verified successfully!
   Project ID: your-project-id
   Auth Domain: your-project.firebaseapp.com
```

## Step 7: Seed Subscription Plans

After verifying Firebase connection, seed the subscription plans:

```bash
pnpm run seed-plans
```

This creates 3 subscription plans in Firestore:
- Monthly Plan (₹999/month)
- Quarterly Plan (₹2499/3 months)
- Yearly Plan (₹8999/year)

## Step 8: Test Vendor Registration & Login

1. Start the dev server:
   ```bash
   pnpm run dev
   ```

2. Navigate to vendor registration:
   ```
   http://localhost:3000/vendor/register
   ```

3. Create a test vendor account:
   - Fill in the registration form
   - Submit the form
   - You should be redirected to the subscription page

4. Test login:
   ```
   http://localhost:3000/vendor/login
   ```
   - Use the credentials you just created
   - Should redirect to subscription page

## Step 9: Test Subscription Flow

1. Go to subscription page:
   ```
   http://localhost:3000/vendor/subscription
   ```

2. You should see:
   - 3 subscription plans (Monthly, Quarterly, Yearly)
   - Plan selection interface
   - Payment button (when plan selected)

3. Test payment (in test mode):
   - Select a plan
   - Click "Pay"
   - Test mode will simulate payment
   - Subscription should be activated

## Troubleshooting

### Error: "Firebase API has not been used"
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Select your Firebase project
- Enable **Cloud Firestore API** and **Identity Toolkit API**

### Error: "Permission denied"
- Check Firestore security rules are deployed
- Verify rules allow authenticated users to read/write

### Error: "Invalid API key"
- Double-check `.env.local` has correct Firebase credentials
- Restart dev server after updating `.env.local`

### Plans not showing
- Run `pnpm run seed-plans` to create plans
- Check Firestore console to verify plans exist
- Check browser console for errors

## Next Steps

After Firebase is connected:

1. ✅ Vendor registration and login working
2. ✅ Subscription plans visible
3. ✅ Payment flow functional (test mode)
4. ⏭️ Deploy security rules to production
5. ⏭️ Set up Razorpay live credentials
6. ⏭️ Configure webhook endpoints

## Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- Use test credentials for development
- Switch to live credentials only in production
- Regularly review Firestore security rules
- Enable Firebase App Check for production


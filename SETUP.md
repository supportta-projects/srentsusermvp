# Quick Setup Guide

## 1. Install Dependencies

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install project dependencies
pnpm install
```

## 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Copy your Firebase config from Project Settings
4. Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 3. Deploy Firestore Rules & Indexes

```bash
# Install Firebase CLI if needed
pnpm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

## 4. Seed Database

```bash
pnpm run seed
```

This will create:
- 4 shops (Bengaluru, Mumbai, Delhi, Chennai)
- 20 products across different categories

## 5. Run Development Server

```bash
pnpm run dev
```

Open http://localhost:3000

## 6. (Optional) Set up Google Analytics

Add your GA4 measurement ID to `.env.local`:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Troubleshooting

### Images not loading
- Images currently use Unsplash placeholders
- Replace with actual product images in Firebase Storage for production
- Update `imageUrls` in seed data

### Firestore permission errors
- Make sure Firestore rules are deployed
- Check that rules allow read access to products and shops
- Verify contact creation rules

### Seed script fails
- Ensure Firebase config is correct in `.env.local`
- Check that Firestore is enabled in Firebase Console
- Verify you have write permissions

## Next Steps

1. Replace placeholder images with actual product photos
2. Set up Firebase Functions for email notifications
3. Configure custom domain (if needed)
4. Deploy to Vercel or Firebase Hosting


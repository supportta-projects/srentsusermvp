/**
 * Seed Subscription Plans using Firebase Admin SDK
 * 
 * This script uses Admin SDK which bypasses security rules
 * Perfect for seeding, migrations, and admin operations
 * 
 * Run with: pnpm run seed-plans-admin
 */

import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Firebase Admin SDK
function initializeAdmin() {
  // Check if already initialized
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Option 1: Use service account key file (recommended for local)
  const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  // Option 2: Use environment variables (for production/CI)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  // Option 3: Use Application Default Credentials (for Firebase Functions/Cloud Run)
  try {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK');
    console.error('\n💡 Setup options:');
    console.error('1. Download service account key from Firebase Console');
    console.error('2. Save it as serviceAccountKey.json in project root');
    console.error('3. Or set FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
    console.error('\n📖 See ADMIN_SDK_SETUP.md for detailed instructions\n');
    throw error;
  }
}

const subscriptionPlans: Omit<admin.firestore.DocumentData, 'id'>[] = [
  {
    name: 'Basic',
    description: 'A basic plan for startups and individual users',
    amount: 1499, // ₹1499/month
    duration: 30, // 30 days
    features: [
      'Full access to vendor dashboard',
      'Unlimited product listings',
      'Unlimited orders management',
      'Customer management',
      'Staff management',
      'Analytics and reports',
      'Email support',
    ],
    isActive: true,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    name: 'Premium',
    description: 'A premium plan for growing businesses',
    amount: 6300, // ₹6300 for 6 months (₹35/day)
    duration: 180, // 180 days (6 months)
    features: [
      'Full access to vendor dashboard',
      'Unlimited product listings',
      'Unlimited orders management',
      'Customer management',
      'Staff management',
      'Analytics and reports',
      'Priority email support',
      'Save ₹2694 compared to monthly',
    ],
    isActive: true,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    name: 'Enterprise',
    description: 'An enterprise plan with advanced features for large organizations',
    amount: 9999, // ₹9999/year (₹27/day, highlighted as ₹35/day)
    duration: 365, // 365 days
    features: [
      'Full access to vendor dashboard',
      'Unlimited product listings',
      'Unlimited orders management',
      'Customer management',
      'Staff management',
      'Analytics and reports',
      'Priority email support',
      'Phone support',
      'Save ₹4497 compared to monthly',
      'Best value - Only ₹35/day',
    ],
    isActive: true,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
];

async function seedSubscriptionPlans() {
  console.log('🌱 Seeding subscription plans using Admin SDK...\n');

  try {
    // Initialize Admin SDK
    const app = initializeAdmin();
    const db = admin.firestore();

    console.log(`✅ Connected to Firebase project: ${app.options.projectId}\n`);

    for (const plan of subscriptionPlans) {
      const planId = plan.name.toLowerCase().replace(/\s+/g, '-').trim();
      const finalPlanId = planId === 'basic' ? 'monthly' : 
                         planId === 'premium' ? 'six-month' : 
                         'yearly';

      const planRef = db.collection('subscription_plans').doc(finalPlanId);
      
      // Check if plan already exists
      const existingPlan = await planRef.get();
      
      if (existingPlan.exists) {
        console.log(`⚠️  Plan "${plan.name}" already exists, skipping...`);
        continue;
      }

      await planRef.set(plan);
      console.log(`✅ Created plan: ${plan.name} (${finalPlanId})`);
    }

    console.log('\n✅ Subscription plans seeded successfully!');
    console.log('\nPlans created:');
    console.log('  - Basic Plan (₹1499/month)');
    console.log('  - Premium Plan (₹6300/6 months = ₹35/day)');
    console.log('  - Enterprise Plan (₹9999/year = ₹27/day, highlighted as ₹35/day)');
    console.log('\n💡 These plans are now available in your Firestore database');
  } catch (error: any) {
    console.error('❌ Error seeding subscription plans:', error.message);
    if (error.code === 'ENOENT') {
      console.error('\n💡 Make sure serviceAccountKey.json exists in project root');
    }
    process.exit(1);
  } finally {
    // Clean up
    if (admin.apps.length > 0) {
      await admin.app().delete();
    }
  }
}

seedSubscriptionPlans()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });


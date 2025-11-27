/**
 * Seed Subscription Plans
 * 
 * Creates default subscription plans in Firestore
 */

import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { SubscriptionPlan } from '../src/types';

const subscriptionPlans: Omit<SubscriptionPlan, 'id'>[] = [
  {
    name: 'Basic',
    description: 'A basic plan for startups and individual users',
    amount: 1799, // ₹1799/month
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Premium',
    description: 'A premium plan for growing businesses',
    amount: 9000, // ₹9000 for 6 months (₹50/day)
    duration: 180, // 180 days (6 months)
    features: [
      'Full access to vendor dashboard',
      'Unlimited product listings',
      'Unlimited orders management',
      'Customer management',
      'Staff management',
      'Analytics and reports',
      'Priority email support',
      'Save ₹1,794 compared to monthly',
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Enterprise',
    description: 'An enterprise plan with advanced features for large organizations',
    amount: 14999, // ₹14999/year (₹41/day)
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
      'Save ₹6,589 compared to monthly',
      'Best value - Only ₹41/day',
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedSubscriptionPlans() {
  console.log('🌱 Seeding subscription plans...\n');

  try {
    for (const plan of subscriptionPlans) {
      const planId = plan.name.toLowerCase().replace(/\s+/g, '-').trim();
      const finalPlanId = planId === 'basic' ? 'monthly' : 
                         planId === 'premium' ? 'six-month' : 
                         'yearly';

      const planRef = doc(db, 'subscription_plans', finalPlanId);
      
      // Check if plan already exists
      const existingPlan = await getDoc(planRef);
      
      if (existingPlan.exists()) {
        console.log(`⚠️  Plan "${plan.name}" already exists, skipping...`);
        continue;
      }

      await setDoc(planRef, plan);
      console.log(`✅ Created plan: ${plan.name} (${finalPlanId})`);
    }

    console.log('\n✅ Subscription plans seeded successfully!');
    console.log('\nPlans created:');
    console.log('  - Basic Plan (₹1799/month)');
    console.log('  - Premium Plan (₹9000/6 months = ₹50/day)');
    console.log('  - Enterprise Plan (₹14999/year = ₹41/day)');
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error);
    process.exit(1);
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


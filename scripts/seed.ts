// Seed script to populate Firestore with dummy data
// Run with: npx tsx scripts/seed.ts

import { seedDatabase } from '../src/lib/seed';

seedDatabase()
  .then(() => {
    console.log('✅ Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });


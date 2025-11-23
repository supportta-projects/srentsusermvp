/**
 * Script to verify Firebase connection and configuration
 * Run with: pnpm exec tsx scripts/verify-firebase.ts
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function verifyFirebase() {
  console.log('🔍 Verifying Firebase Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  let allVarsPresent = true;
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value && !value.includes('demo') && !value.includes('123456789')) {
      console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`  ❌ ${varName}: ${value || 'NOT SET'} (using demo/placeholder)`);
      allVarsPresent = false;
    }
  }

  if (!allVarsPresent) {
    console.log('\n⚠️  Warning: Some Firebase environment variables are missing or using demo values.');
    console.log('   Please update .env.local with your Firebase project credentials.\n');
  }

  // Initialize Firebase
  try {
    console.log('\n🔌 Initializing Firebase...');
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('  ✅ Firebase app initialized');
    } else {
      app = getApps()[0];
      console.log('  ✅ Using existing Firebase app');
    }

    // Test Firestore connection
    console.log('\n📊 Testing Firestore connection...');
    const db = getFirestore(app);
    
    // Try to write and read a test document
    const testDocRef = doc(db, '_test', 'connection');
    await setDoc(testDocRef, {
      timestamp: new Date(),
      message: 'Firebase connection test',
    });
    console.log('  ✅ Firestore write successful');

    const testDoc = await getDoc(testDocRef);
    if (testDoc.exists()) {
      console.log('  ✅ Firestore read successful');
      console.log(`  📄 Test document data: ${JSON.stringify(testDoc.data(), null, 2)}`);
    }

    // Test Auth
    console.log('\n🔐 Testing Firebase Auth...');
    const auth = getAuth(app);
    console.log(`  ✅ Auth initialized (Project: ${auth.app.options.projectId})`);

    console.log('\n✅ Firebase connection verified successfully!');
    console.log(`   Project ID: ${firebaseConfig.projectId}`);
    console.log(`   Auth Domain: ${firebaseConfig.authDomain}\n`);

    return true;
  } catch (error: any) {
    console.error('\n❌ Firebase connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'unknown'}\n`);
    
    if (error.code === 'permission-denied') {
      console.log('💡 Tip: Make sure Firestore security rules allow writes to _test collection');
      console.log('   Or check if Firestore API is enabled in Firebase Console\n');
    } else if (error.code === 'unavailable') {
      console.log('💡 Tip: Check your internet connection and Firebase project status\n');
    }
    
    return false;
  }
}

// Run verification
verifyFirebase()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });


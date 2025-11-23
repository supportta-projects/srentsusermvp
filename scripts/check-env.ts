/**
 * Check Firebase Environment Variables
 * Run with: pnpm exec tsx scripts/check-env.ts
 */

import * as path from 'path';
import * as fs from 'fs';

// Load .env.local file manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split(/\r?\n/);
  console.log(`📄 Found .env.local with ${lines.length} lines\n`);
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }
    
    // Handle different formats: KEY=value, KEY="value", KEY='value'
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
} else {
  console.log('⚠️  .env.local file not found!\n');
  console.log('💡 Creating template .env.local file...\n');
  
  // Create template file
  const template = `# Firebase Configuration
# Get these values from: https://console.firebase.google.com/
# Project Settings → General → Your apps → Web app

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
`;
  
  fs.writeFileSync(envPath, template);
  console.log('✅ Created .env.local template file');
  console.log('   Please update it with your Firebase credentials!\n');
}

console.log('📋 Checking Firebase Environment Variables...\n');

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

let allValid = true;

for (const varName of requiredVars) {
  const value = process.env[varName];
  
  if (!value) {
    console.log(`❌ ${varName}: NOT SET`);
    allValid = false;
  } else if (value.includes('demo') || value.includes('123456789') || value.includes('placeholder') || value.includes('abc123')) {
    console.log(`⚠️  ${varName}: ${value.substring(0, 40)}... (DEMO VALUE - NEEDS UPDATE)`);
    allValid = false;
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 40)}...`);
  }
}

console.log('\n');

if (!allValid) {
  console.log('🔧 To fix this:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('2. Select your project (or create one)');
  console.log('3. Go to Project Settings → General');
  console.log('4. Scroll to "Your apps" → Web app');
  console.log('5. Copy the config values');
  console.log('6. Update .env.local file with real values\n');
  console.log('📝 Example .env.local format:');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id');
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com');
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012');
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef\n');
  process.exit(1);
} else {
  console.log('✅ All Firebase environment variables are set correctly!');
  console.log('   You can now run: pnpm run verify-firebase\n');
  process.exit(0);
}


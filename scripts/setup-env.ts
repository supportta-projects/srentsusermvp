/**
 * Setup Environment Variables
 * Adds Firebase configuration template to .env.local if missing
 * Run with: pnpm exec tsx scripts/setup-env.ts
 */

import * as path from 'path';
import * as fs from 'fs';

const envPath = path.join(process.cwd(), '.env.local');
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

function loadEnvFile(): Map<string, string> {
  const envMap = new Map<string, string>();
  
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split(/\r?\n/);
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return;
      }
      
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        if (key && value) {
          envMap.set(key, value);
        }
      }
    });
  }
  
  return envMap;
}

function checkMissingVars(envMap: Map<string, string>): string[] {
  const missing: string[] = [];
  
  for (const varName of requiredVars) {
    const value = envMap.get(varName);
    if (!value || value.includes('your-') || value.includes('demo') || value.includes('123456789')) {
      missing.push(varName);
    }
  }
  
  return missing;
}

async function main() {
  console.log('🔍 Checking .env.local file...\n');
  
  const envMap = loadEnvFile();
  const missing = checkMissingVars(envMap);
  
  if (missing.length === 0) {
    console.log('✅ All Firebase environment variables are set!\n');
    process.exit(0);
  }
  
  console.log(`⚠️  Missing or invalid Firebase variables: ${missing.length}\n`);
  
  // Check if file exists
  let existingContent = '';
  if (fs.existsSync(envPath)) {
    existingContent = fs.readFileSync(envPath, 'utf-8');
    console.log(`📄 Found existing .env.local file (${existingContent.split('\n').length} lines)\n`);
  }
  
  // Check if Firebase section exists
  const hasFirebaseSection = existingContent.includes('NEXT_PUBLIC_FIREBASE');
  
  if (!hasFirebaseSection) {
    console.log('📝 Adding Firebase configuration template to .env.local...\n');
    
    const firebaseTemplate = `
# Firebase Configuration
# Get these values from: https://console.firebase.google.com/
# Project Settings → General → Your apps → Web app (</> icon)
# 
# IMPORTANT: Replace the placeholder values below with your actual Firebase credentials!

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
`;
    
    // Append to existing file or create new
    const newContent = existingContent + (existingContent.endsWith('\n') ? '' : '\n') + firebaseTemplate;
    fs.writeFileSync(envPath, newContent);
    
    console.log('✅ Added Firebase template to .env.local\n');
  } else {
    console.log('ℹ️  Firebase variables exist but need to be updated with real values\n');
  }
  
  console.log('📋 Next Steps:\n');
  console.log('1. Open .env.local in your editor');
  console.log('2. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('3. Select your project → Project Settings → General');
  console.log('4. Scroll to "Your apps" → Click Web app icon (</>)');
  console.log('5. Copy the config values and paste them into .env.local');
  console.log('6. Replace all placeholder values (your-*, demo, 123456789, etc.)');
  console.log('7. Run: pnpm run check-env (to verify)\n');
  console.log('💡 Quick link: https://console.firebase.google.com/project/_/settings/general\n');
}

main().catch(console.error);


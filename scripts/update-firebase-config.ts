/**
 * Update Firebase config in .env.local
 */

import * as path from 'path';
import * as fs from 'fs';

const envPath = path.join(process.cwd(), '.env.local');

// Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD9SvLWgnDiaCksPLjnnEPsKoMRenbTxAs",
  authDomain: "rentorent-fb156.firebaseapp.com",
  projectId: "rentorent-fb156",
  storageBucket: "rentorent-fb156.firebasestorage.app",
  messagingSenderId: "839422373079",
  appId: "1:839422373079:web:e9b8586c007ff5a8289492"
};

function updateEnvFile() {
  let content = '';
  
  // Read existing file if it exists
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf-8');
  }
  
  // Update or add Firebase variables
  const lines = content.split(/\r?\n/);
  const newLines: string[] = [];
  const existingKeys = new Set<string>();
  
  // Process existing lines and update Firebase vars
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check if this is a Firebase variable
    let isFirebaseVar = false;
    for (const [key, value] of Object.entries(firebaseConfig)) {
      const envKey = `NEXT_PUBLIC_FIREBASE_${key.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '')}`;
      if (trimmed.startsWith(`${envKey}=`) || trimmed.startsWith(`# ${envKey}`)) {
        // Replace with actual value
        newLines.push(`${envKey}=${value}`);
        existingKeys.add(envKey);
        isFirebaseVar = true;
        break;
      }
    }
    
    if (!isFirebaseVar) {
      newLines.push(line);
    }
  }
  
  // Add missing Firebase variables
  const firebaseVars: Record<string, string> = {
    'NEXT_PUBLIC_FIREBASE_API_KEY': firebaseConfig.apiKey,
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': firebaseConfig.authDomain,
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': firebaseConfig.projectId,
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': firebaseConfig.storageBucket,
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': firebaseConfig.messagingSenderId,
    'NEXT_PUBLIC_FIREBASE_APP_ID': firebaseConfig.appId,
  };
  
  // Check if Firebase section exists
  let hasFirebaseSection = false;
  for (const line of newLines) {
    if (line.includes('Firebase Configuration') || line.includes('NEXT_PUBLIC_FIREBASE')) {
      hasFirebaseSection = true;
      break;
    }
  }
  
  // Add Firebase section if missing
  if (!hasFirebaseSection) {
    newLines.push('');
    newLines.push('# Firebase Configuration');
    newLines.push('# Project: rentorent-fb156');
  }
  
  // Add missing variables
  for (const [key, value] of Object.entries(firebaseVars)) {
    if (!existingKeys.has(key)) {
      newLines.push(`${key}=${value}`);
    }
  }
  
  // Write updated content
  const updatedContent = newLines.join('\n');
  fs.writeFileSync(envPath, updatedContent);
  
  console.log('✅ Updated .env.local with Firebase credentials');
  console.log(`   Project: ${firebaseConfig.projectId}`);
  console.log(`   Auth Domain: ${firebaseConfig.authDomain}\n`);
}

updateEnvFile();


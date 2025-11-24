/**
 * Test contact email API route
 * Run with: pnpm tsx scripts/test-contact-email.ts
 */

import * as path from 'path';
import * as fs from 'fs';

// Load environment variables manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').trim();
      if (key && value) {
        process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  });
}

// Import email function directly
import { sendContactNotification } from '../src/lib/email';

const testContactData = {
  name: 'Test User',
  phone: '9876543210',
  message: 'This is a test contact form submission',
  productTitle: 'Test Product - Canon EOS R5',
  productId: 'test_product_123',
  shopId: 'test_shop_456',
  shopName: 'Test Camera Shop',
  productPrice: 5000,
  productCity: 'Mumbai',
};

async function testContactEmail() {
  try {
    console.log('📧 Testing Contact Email Notification...\n');
    console.log('Test Data:');
    console.log(JSON.stringify(testContactData, null, 2));
    console.log('\n');
    
    await sendContactNotification(testContactData);
    
    console.log('\n✅ Contact email test completed successfully!');
    console.log('Check your inbox at: info@abijithcb.com');
  } catch (error: any) {
    console.error('\n❌ Contact email test failed!');
    console.error('Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Response:', error.response);
    process.exit(1);
  }
}

testContactEmail();


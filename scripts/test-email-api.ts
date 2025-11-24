/**
 * Test the email API route directly
 * Run with: pnpm tsx scripts/test-email-api.ts
 */

const testContactData = {
  type: 'contact',
  data: {
    name: 'Test User',
    phone: '9876543210',
    message: 'This is a test contact form submission',
    productTitle: 'Test Product - Canon EOS R5',
    productId: 'test_product_123',
    shopId: 'test_shop_456',
    shopName: 'Test Camera Shop',
    productPrice: 5000,
    productCity: 'Mumbai',
  },
};

async function testEmailAPI() {
  try {
    console.log('📧 Testing Email API Route...\n');
    console.log('Request data:', JSON.stringify(testContactData, null, 2));
    console.log('\n');
    
    const response = await fetch('http://localhost:3000/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testContactData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('\n✅ Email API route test successful!');
      console.log('Check your inbox at: info@abijithcb.com');
    } else {
      console.error('\n❌ Email API route test failed!');
      console.error('Error:', result);
    }
  } catch (error: any) {
    console.error('\n❌ Error testing email API route:');
    console.error('Error:', error.message);
    console.error('Make sure the dev server is running on http://localhost:3000');
  }
}

testEmailAPI();


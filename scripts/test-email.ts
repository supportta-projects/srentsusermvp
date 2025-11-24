/**
 * Test email configuration
 * Run with: pnpm tsx scripts/test-email.ts
 */

import nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables manually (like other scripts)
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

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER || 'contact@rentorent.net';
const SMTP_PASS = process.env.SMTP_PASS || '1@Abijithcb';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@abijithcb.com';

console.log('📧 Testing Email Configuration...\n');
console.log('Configuration:');
console.log('  SMTP Host:', SMTP_HOST);
console.log('  SMTP Port:', SMTP_PORT);
console.log('  SMTP User:', SMTP_USER);
console.log('  Notification Email:', NOTIFICATION_EMAIL);
console.log('  Has Password:', !!SMTP_PASS);
console.log('');

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

async function testEmail() {
  try {
    // Step 1: Verify SMTP connection
    console.log('Step 1: Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Step 2: Send test email
    console.log('Step 2: Sending test email...');
    const result = await transporter.sendMail({
      from: `"RentOrent Test" <${SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject: 'Test Email from RentOrent',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from RentOrent to verify email configuration.</p>
        <p>If you receive this email, your email setup is working correctly!</p>
        <p>Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      `,
      text: 'This is a test email from RentOrent to verify email configuration.',
    });

    console.log('✅ Test email sent successfully!');
    console.log('Email Details:');
    console.log('  Message ID:', result.messageId);
    console.log('  Accepted:', result.accepted);
    console.log('  Rejected:', result.rejected);
    console.log('\n✅ Email configuration is working! Check your inbox at:', NOTIFICATION_EMAIL);
  } catch (error: any) {
    console.error('❌ Email test failed!');
    console.error('Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Command:', error.command);
    console.error('Error Response:', error.response);
    
    if (error.code === 'EAUTH') {
      console.error('\n💡 Authentication failed. Check your SMTP_USER and SMTP_PASS in .env.local');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n💡 Connection failed. Check your SMTP_HOST and SMTP_PORT in .env.local');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Connection timeout. Check your network connection and SMTP settings');
    }
    
    process.exit(1);
  }
}

testEmail();


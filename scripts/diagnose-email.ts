/**
 * Diagnose email issues
 * Run with: pnpm tsx scripts/diagnose-email.ts
 */

import nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
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

console.log('🔍 Email Configuration Diagnosis\n');
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
  debug: true, // Enable debug output
  logger: true, // Enable logging
});

async function diagnose() {
  try {
    // Step 1: Verify connection
    console.log('Step 1: Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    // Step 2: Send test email with full details
    console.log('Step 2: Sending detailed test email...');
    const result = await transporter.sendMail({
      from: `"RentOrent" <${SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject: 'Test Contact Email - ' + new Date().toISOString(),
      html: `
        <h2>Test Contact Email</h2>
        <p>This is a test email to verify contact form email delivery.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        <p><strong>From:</strong> ${SMTP_USER}</p>
        <p><strong>To:</strong> ${NOTIFICATION_EMAIL}</p>
        <hr>
        <p><strong>Test Contact Details:</strong></p>
        <ul>
          <li>Name: Test User</li>
          <li>Phone: 9876543210</li>
          <li>Product: Test Product</li>
          <li>Message: This is a test message</li>
        </ul>
      `,
      text: `Test Contact Email\n\nThis is a test email to verify contact form email delivery.\n\nSent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\nFrom: ${SMTP_USER}\nTo: ${NOTIFICATION_EMAIL}`,
    });

    console.log('✅ Test email sent!');
    console.log('\nEmail Details:');
    console.log('  Message ID:', result.messageId);
    console.log('  Accepted:', result.accepted);
    console.log('  Rejected:', result.rejected);
    console.log('  Response:', result.response);
    console.log('  Envelope:', result.envelope);
    
    if (result.rejected && result.rejected.length > 0) {
      console.error('\n❌ Email was rejected!');
      console.error('Rejected addresses:', result.rejected);
    }
    
    if (!result.accepted || result.accepted.length === 0) {
      console.error('\n❌ Email was not accepted!');
    } else {
      console.log('\n✅ Email was accepted by server');
      console.log('📬 Check your inbox at:', NOTIFICATION_EMAIL);
      console.log('💡 Also check spam/junk folder');
    }
    
  } catch (error: any) {
    console.error('\n❌ Diagnosis failed!');
    console.error('Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Response:', error.response);
    
    if (error.code === 'EAUTH') {
      console.error('\n💡 Authentication failed. Check:');
      console.error('  1. SMTP_USER is correct:', SMTP_USER);
      console.error('  2. SMTP_PASS is correct');
      console.error('  3. Email account allows "less secure apps" or app passwords');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n💡 Connection failed. Check:');
      console.error('  1. SMTP_HOST is correct:', SMTP_HOST);
      console.error('  2. SMTP_PORT is correct:', SMTP_PORT);
      console.error('  3. Firewall/network allows connection');
    }
  }
}

diagnose();


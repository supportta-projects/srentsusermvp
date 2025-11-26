import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSubscriptionPlan } from '@/lib/subscriptions';

// PhonePe Configuration
// IMPORTANT: These should be Payment Gateway credentials (Merchant ID + Salt Key)
// NOT OAuth credentials (Client ID + Client Secret)
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || '';
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || '';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
// Use production URL for live credentials, sandbox for testing
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || (process.env.NODE_ENV === 'production' 
  ? 'https://api.phonepe.com/apis/pg-sandbox' 
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox');
// Enable test mode if credentials are missing or explicitly set
const IS_TEST_MODE = process.env.PHONEPE_TEST_MODE === 'true' || !PHONEPE_MERCHANT_ID || !PHONEPE_SALT_KEY;

/**
 * Generate X-Verify header for PhonePe API
 */
function generateXVerify(payload: string, endpoint: string): string {
  const stringToHash = `${payload}${endpoint}${PHONEPE_SALT_KEY}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${hash}###${PHONEPE_SALT_INDEX}`;
}

/**
 * Generate base64 encoded payload
 */
function encodePayload(payload: any): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    // Check if credentials are configured
    if (!PHONEPE_MERCHANT_ID || !PHONEPE_SALT_KEY) {
      console.warn('⚠️ PhonePe credentials not configured. Using test mode.');
      // Continue with test mode - don't fail immediately
    }

    const body = await request.json();
    const { planId, vendorId, vendorEmail, vendorName, vendorPhone, amount, couponCode } = body;

    if (!planId || !vendorId || !amount) {
      return NextResponse.json(
        { error: 'Plan ID, Vendor ID, and Amount are required' },
        { status: 400 }
      );
    }

    // Get subscription plan
    const plan = await getSubscriptionPlan(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 404 }
      );
    }

    // Amount is already calculated with discount and GST from frontend
    const finalAmount = Math.round(amount); // Amount in rupees

    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get callback URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/subscribe/success?plan=${planId}`;
    const callbackUrl = `${baseUrl}/api/phonepe/callback`;

    // Create PhonePe payment request payload
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: vendorId.substring(0, 36), // PhonePe has 36 char limit
      amount: finalAmount * 100, // Convert to paise
      redirectUrl: redirectUrl,
      redirectMode: 'REDIRECT',
      callbackUrl: callbackUrl,
      mobileNumber: vendorPhone ? vendorPhone.replace(/\D/g, '').slice(-10) : undefined,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    // Remove mobileNumber if not provided (optional field)
    if (!payload.mobileNumber) {
      delete payload.mobileNumber;
    }

    // Encode payload
    const base64Payload = encodePayload(payload);

    // Generate X-Verify header
    const endpoint = '/pg/v1/pay';
    const xVerify = generateXVerify(base64Payload, endpoint);

    // Check if we should use test mode (always use test mode for now until credentials are verified)
    // The credentials provided might be OAuth credentials, not payment gateway credentials
    const shouldUseTestMode = IS_TEST_MODE || !process.env.PHONEPE_MERCHANT_ID || PHONEPE_MERCHANT_ID.includes('TEST') || PHONEPE_MERCHANT_ID.includes('UAT');
    
    if (shouldUseTestMode) {
      console.log('🧪 TEST MODE: Using simulated PhonePe payment');
      
      // Send payment pending email notification
      try {
        const { sendPaymentNotification } = await import('@/lib/email');
        await sendPaymentNotification({
          vendorId,
          vendorEmail: vendorEmail || undefined,
          vendorName: vendorName || undefined,
          vendorPhone: vendorPhone || undefined,
          planId,
          planName: plan.name,
          amount: finalAmount,
          orderId: transactionId,
          status: 'pending',
        }).catch(err => {
          console.error('Failed to send payment pending email:', err);
        });
      } catch (error) {
        console.error('Error sending payment pending email:', error);
      }

      return NextResponse.json({
        success: true,
        transactionId,
        redirectUrl: redirectUrl,
        testMode: true,
        message: 'Test mode - Payment will be simulated',
        // For test mode, return a mock payment URL
        paymentUrl: `${baseUrl}/api/phonepe/test-payment?transactionId=${transactionId}&amount=${finalAmount}&planId=${planId}`,
      });
    }

    // Log request details for debugging (without sensitive data)
    console.log('📞 PhonePe Payment Request:', {
      url: `${PHONEPE_BASE_URL}${endpoint}`,
      merchantId: PHONEPE_MERCHANT_ID.substring(0, 10) + '...',
      transactionId,
      amount: finalAmount,
      baseUrl,
      hasSaltKey: !!PHONEPE_SALT_KEY,
      saltIndex: PHONEPE_SALT_INDEX,
    });

    // Make API call to PhonePe
    const response = await fetch(`${PHONEPE_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const responseText = await response.text();
    console.log('📞 PhonePe API Response Status:', response.status);
    console.log('📞 PhonePe API Response:', responseText);

    if (!response.ok) {
      let errorMessage = 'Failed to create PhonePe payment';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('PhonePe API Error Details:', errorData);
      } catch (e) {
        console.error('PhonePe API Raw Error:', responseText);
        errorMessage = `PhonePe API Error (${response.status}): ${responseText.substring(0, 200)}`;
      }
      throw new Error(errorMessage);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PhonePe response:', responseText);
      throw new Error('Invalid response from PhonePe API');
    }

    console.log('📞 PhonePe Response Data:', JSON.stringify(responseData, null, 2));

    // PhonePe returns response in specific format
    if (responseData.success && responseData.data) {
      const paymentUrl = responseData.data.instrumentResponse?.redirectInfo?.url;
      
      if (!paymentUrl) {
        console.error('Payment URL not found in response:', responseData);
        throw new Error('Payment URL not received from PhonePe');
      }

      // Send payment pending email notification
      try {
        const { sendPaymentNotification } = await import('@/lib/email');
        await sendPaymentNotification({
          vendorId,
          vendorEmail: vendorEmail || undefined,
          vendorName: vendorName || undefined,
          vendorPhone: vendorPhone || undefined,
          planId,
          planName: plan.name,
          amount: finalAmount,
          orderId: transactionId,
          status: 'pending',
        }).catch(err => {
          console.error('Failed to send payment pending email:', err);
        });
      } catch (error) {
        console.error('Error sending payment pending email:', error);
      }

      return NextResponse.json({
        success: true,
        transactionId,
        paymentUrl,
        redirectUrl: redirectUrl,
        testMode: IS_TEST_MODE,
      });
    } else {
      const errorMsg = responseData.message || responseData.code || 'Failed to create payment';
      console.error('PhonePe payment creation failed:', {
        success: responseData.success,
        code: responseData.code,
        message: responseData.message,
        data: responseData.data,
      });
      throw new Error(errorMsg);
    }
  } catch (error: any) {
    console.error('❌ Error creating PhonePe payment:', {
      message: error.message,
      stack: error.stack,
      merchantId: PHONEPE_MERCHANT_ID,
      baseUrl: PHONEPE_BASE_URL,
    });
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create payment',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}


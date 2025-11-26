import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { 
  updateSubscriptionPayment,
  createVendorSubscription,
  getSubscriptionPlan,
  createSubscriptionPayment
} from '@/lib/subscriptions';

// PhonePe Configuration
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || process.env.PHONEPE_CLIENT_ID || 'SU2505202010385674968962';
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || process.env.PHONEPE_CLIENT_SECRET || '9eb5f4be-0f8e-4379-83c8-82da65f06b50';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const IS_TEST_MODE = process.env.PHONEPE_TEST_MODE === 'true' || process.env.NODE_ENV !== 'production';

/**
 * Verify PhonePe callback signature
 */
function verifyCallbackSignature(payload: string, xVerify: string): boolean {
  try {
    const [hash, saltIndex] = xVerify.split('###');
    const stringToHash = `${payload}/pg/v1/status/${PHONEPE_MERCHANT_ID}${PHONEPE_SALT_KEY}`;
    const calculatedHash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    return calculatedHash === hash && saltIndex === PHONEPE_SALT_INDEX;
  } catch (error) {
    console.error('Error verifying callback signature:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const xVerify = request.headers.get('x-verify');

    if (!xVerify) {
      return NextResponse.json(
        { error: 'Missing X-Verify header' },
        { status: 401 }
      );
    }

    // PhonePe sends callback in specific format
    const { response } = body;
    if (!response) {
      return NextResponse.json(
        { error: 'Invalid callback format' },
        { status: 400 }
      );
    }

    // Decode base64 response
    const decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
    const paymentData = JSON.parse(decodedResponse);

    // In test mode, skip signature verification
    if (!IS_TEST_MODE) {
      const isValid = verifyCallbackSignature(response, xVerify);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid callback signature' },
          { status: 401 }
        );
      }
    }

    const {
      merchantTransactionId,
      transactionId,
      state,
      amount,
    } = paymentData;

    // Extract vendorId and planId from merchantTransactionId or notes
    // Format: TXN_timestamp_random or we can store in notes
    const vendorId = paymentData.merchantUserId || paymentData.merchantTransactionId?.split('_')[1];
    const planId = paymentData.notes?.planId || paymentData.merchantTransactionId?.split('_')[3] || paymentData.merchantTransactionId?.split('_')[2];

    if (!vendorId || !planId) {
      console.error('Missing vendorId or planId in callback');
      return NextResponse.json(
        { error: 'Missing required information' },
        { status: 400 }
      );
    }

    // Get plan details
    const plan = await getSubscriptionPlan(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Check payment status
    if (state !== 'COMPLETED') {
      // Payment failed or pending
      await createSubscriptionPayment({
        vendorId,
        subscriptionId: vendorId,
        amount: amount / 100, // Convert from paise to rupees
        planId: plan.id,
        planName: plan.name,
        razorpayOrderId: merchantTransactionId,
        razorpayPaymentId: transactionId,
        status: state === 'PENDING' ? 'pending' : 'failed',
        failedAt: state === 'FAILED' ? new Date() : undefined,
      });

      return NextResponse.json({
        success: false,
        status: state,
      });
    }

    // Payment successful
    const paymentAmount = amount / 100; // Convert from paise to rupees

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create payment record
    const paymentRecordId = await createSubscriptionPayment({
      vendorId,
      subscriptionId: vendorId,
      amount: paymentAmount,
      planId: plan.id,
      planName: plan.name,
      razorpayOrderId: merchantTransactionId,
      razorpayPaymentId: transactionId,
      status: 'completed',
      completedAt: new Date(),
    });

    // Create or update vendor subscription
    await createVendorSubscription(vendorId, {
      vendorId,
      planId: plan.id,
      planName: plan.name,
      amount: paymentAmount,
      duration: plan.duration,
      status: 'active',
      startDate,
      endDate,
      razorpayOrderId: merchantTransactionId,
      razorpayPaymentId: transactionId,
      autoRenew: false,
    });

    // Update payment status
    await updateSubscriptionPayment(paymentRecordId, {
      status: 'completed',
      completedAt: new Date(),
    });

    // Send payment completed email notification
    try {
      const { sendPaymentNotification } = await import('@/lib/email');
      await sendPaymentNotification({
        vendorId,
        vendorEmail: paymentData.merchantUserEmail || undefined,
        vendorName: paymentData.merchantUserName || undefined,
        vendorPhone: paymentData.merchantUserPhone || undefined,
        planId,
        planName: plan.name,
        amount: paymentAmount,
        orderId: merchantTransactionId,
        paymentId: transactionId,
        status: 'completed',
        paymentDate: new Date(),
      }).catch(err => {
        console.error('Failed to send payment completed email:', err);
      });
    } catch (error) {
      console.error('Error sending payment completed email:', error);
    }

    return NextResponse.json({
      success: true,
      subscription: {
        status: 'active',
        startDate,
        endDate,
      },
    });
  } catch (error: any) {
    console.error('Error processing PhonePe callback:', error);
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { 
  updateSubscriptionPayment,
  createVendorSubscription,
  getSubscriptionPlan,
  createSubscriptionPayment
} from '@/lib/subscriptions';

// Use test credentials if live credentials not available
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_TEST_KEY_SECRET || 'dummy_secret_123';
const IS_TEST_MODE = !process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET.includes('dummy');

function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const text = `${orderId}|${paymentId}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(text);
  const generatedSignature = hmac.digest('hex');
  return generatedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId, signature, vendorId, planId, vendorEmail, vendorName, vendorPhone } = body;

    if (!orderId || !paymentId || !signature || !vendorId || !planId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In test/dummy mode, skip signature verification
    if (IS_TEST_MODE && (RAZORPAY_KEY_SECRET.includes('dummy') || !process.env.RAZORPAY_KEY_SECRET)) {
      console.log('🧪 TEST MODE: Skipping payment signature verification');
      // Allow test payments to proceed
    } else {
      // Verify payment signature (live mode)
      const isValid = verifyPaymentSignature(orderId, paymentId, signature, RAZORPAY_KEY_SECRET);
      
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid payment signature' },
          { status: 401 }
        );
      }
    }

    // Get plan details
    const plan = await getSubscriptionPlan(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Calculate amount with GST (18%)
    const GST_RATE = 0.18;
    const baseAmount = plan.amount;
    const totalAmount = Math.round(baseAmount * (1 + GST_RATE));

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create payment record (store total amount with GST)
    const paymentRecordId = await createSubscriptionPayment({
      vendorId,
      subscriptionId: vendorId, // Same as vendorId for vendor_subscriptions
      amount: totalAmount, // Total amount including GST
      planId: plan.id,
      planName: plan.name,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      status: 'completed',
      completedAt: new Date(),
    });

    // Create or update vendor subscription
    await createVendorSubscription(vendorId, {
      vendorId,
      planId: plan.id,
      planName: plan.name,
      amount: totalAmount, // Total amount including GST
      duration: plan.duration,
      status: 'active',
      startDate,
      endDate,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
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
        vendorEmail: vendorEmail || undefined,
        vendorName: vendorName || undefined,
        vendorPhone: vendorPhone || undefined,
        planId,
        planName: plan.name,
        amount: totalAmount, // Total amount including GST
        orderId,
        paymentId,
        status: 'completed',
        paymentDate: new Date(),
      }).catch(err => {
        console.error('Failed to send payment completed email:', err);
        // Don't throw - email failure shouldn't break payment verification
      });
    } catch (error) {
      console.error('Error sending payment completed email:', error);
      // Don't throw - email failure shouldn't break payment verification
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
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}


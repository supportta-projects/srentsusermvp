import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getSubscriptionPlan } from '@/lib/subscriptions';

// Use test credentials if live credentials not available
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_TEST_KEY_ID || 'rzp_test_dummy123';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_TEST_KEY_SECRET || 'dummy_secret_123';
const IS_TEST_MODE = !process.env.RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.includes('test') || RAZORPAY_KEY_ID.includes('dummy');

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, vendorId, vendorEmail, vendorName, vendorPhone, amount: customAmount } = body;

    if (!planId || !vendorId) {
      return NextResponse.json(
        { error: 'Plan ID and Vendor ID are required' },
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

    // Use custom amount if provided (already includes GST from frontend), otherwise calculate with GST
    const GST_RATE = 0.18;
    const finalAmount = customAmount || Math.round(plan.amount * (1 + GST_RATE));

    // In test/dummy mode, return mock order without calling Razorpay API
    if (IS_TEST_MODE && (RAZORPAY_KEY_ID.includes('dummy') || !process.env.RAZORPAY_KEY_ID)) {
      console.log('🧪 TEST MODE: Using dummy Razorpay order');
      const mockOrderId = `order_test_${Date.now()}`;
      
      // Send payment pending email notification for test mode
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
          orderId: mockOrderId,
          status: 'pending',
        }).catch(err => {
          console.error('Failed to send payment pending email:', err);
        });
      } catch (error) {
        console.error('Error sending payment pending email:', error);
      }
      
      return NextResponse.json({
        orderId: mockOrderId,
        amount: finalAmount * 100, // Convert to paise
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        testMode: true,
        message: 'Test mode - Payment will be simulated',
      });
    }

    // Create Razorpay order (live or test with real Razorpay account)
    const options = {
      amount: finalAmount * 100, // Convert to paise (total with GST)
      currency: 'INR',
      receipt: `sub_${vendorId}_${Date.now()}`,
      notes: {
        vendorId,
        planId,
        planName: plan.name,
      },
    };

    const order = await razorpay.orders.create(options);

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
        orderId: order.id,
        status: 'pending',
      }).catch(err => {
        console.error('Failed to send payment pending email:', err);
        // Don't throw - email failure shouldn't break order creation
      });
    } catch (error) {
      console.error('Error sending payment pending email:', error);
      // Don't throw - email failure shouldn't break order creation
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || RAZORPAY_KEY_ID,
      testMode: IS_TEST_MODE,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}


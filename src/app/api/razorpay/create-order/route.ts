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
    const { planId, vendorId } = body;

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

    // In test/dummy mode, return mock order without calling Razorpay API
    if (IS_TEST_MODE && (RAZORPAY_KEY_ID.includes('dummy') || !process.env.RAZORPAY_KEY_ID)) {
      console.log('🧪 TEST MODE: Using dummy Razorpay order');
      const mockOrderId = `order_test_${Date.now()}`;
      
      return NextResponse.json({
        orderId: mockOrderId,
        amount: plan.amount * 100,
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        testMode: true,
        message: 'Test mode - Payment will be simulated',
      });
    }

    // Create Razorpay order (live or test with real Razorpay account)
    const options = {
      amount: plan.amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `sub_${vendorId}_${Date.now()}`,
      notes: {
        vendorId,
        planId,
        planName: plan.name,
      },
    };

    const order = await razorpay.orders.create(options);

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


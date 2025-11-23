import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { 
  updateSubscriptionPayment, 
  createVendorSubscription,
  getSubscriptionPlan 
} from '@/lib/subscriptions';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const generatedSignature = hmac.digest('hex');
  return generatedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature, RAZORPAY_WEBHOOK_SECRET);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    // Handle payment success
    if (eventType === 'payment.captured') {
      const { payment, order } = payload.entity;
      
      // Find payment record by order ID
      // Note: You'll need to store orderId when creating payment record
      // For now, we'll update based on order notes
      const vendorId = order.notes?.vendorId;
      const planId = order.notes?.planId;

      if (!vendorId || !planId) {
        return NextResponse.json(
          { error: 'Missing vendor or plan information' },
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

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);

      // Create or update vendor subscription
      await createVendorSubscription(vendorId, {
        vendorId,
        planId: plan.id,
        planName: plan.name,
        amount: plan.amount,
        duration: plan.duration,
        status: 'active',
        startDate,
        endDate,
        razorpayOrderId: order.id,
        razorpayPaymentId: payment.id,
        autoRenew: false,
      });

      // Update payment status
      // Note: You'll need to find payment record by orderId
      // This is a simplified version - you may need to query by orderId
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}


/**
 * PhonePe Webhook Handler
 * POST /api/payments/phonepe/webhook
 * 
 * Receives server-to-server notifications from PhonePe about payment status
 * This is the source of truth for payment status
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifySignature,
  decodePayload,
  mapPhonePeStatus,
} from '@/lib/phonepe';
import {
  getOrderByTransactionId,
  updateOrderStatus,
  createPaymentEvent,
} from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Get X-VERIFY header for signature verification
    const xVerify = request.headers.get('x-verify');
    if (!xVerify) {
      console.error('❌ Webhook: Missing X-VERIFY header');
      return NextResponse.json(
        { error: 'Missing X-VERIFY header' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { response: base64Response } = body;

    if (!base64Response) {
      console.error('❌ Webhook: Missing response in body');
      return NextResponse.json(
        { error: 'Missing response in body' },
        { status: 400 }
      );
    }

    // Decode base64 response
    let paymentData;
    try {
      paymentData = decodePayload(base64Response);
    } catch (e) {
      console.error('❌ Webhook: Failed to decode payload:', e);
      return NextResponse.json(
        { error: 'Invalid payload format' },
        { status: 400 }
      );
    }

    const {
      merchantTransactionId,
      transactionId,
      state,
      amount,
      code,
      responseCode,
    } = paymentData;

    if (!merchantTransactionId) {
      console.error('❌ Webhook: Missing merchantTransactionId');
      return NextResponse.json(
        { error: 'Missing merchantTransactionId' },
        { status: 400 }
      );
    }

    // Verify signature
    // For webhook, API path is typically /pg/v1/webhook or similar
    // Check PhonePe docs for exact path
    const apiPath = '/pg/v1/webhook'; // Adjust based on PhonePe docs
    const isValid = verifySignature(base64Response, apiPath, xVerify);

    if (!isValid) {
      console.error('❌ Webhook: Invalid signature', {
        merchantTransactionId,
        transactionId,
      });
      
      // Log failed verification attempt
      await createPaymentEvent({
        order_id: 'unknown', // We don't know order ID yet
        event_type: 'webhook_signature_failed',
        payload: {
          merchantTransactionId,
          transactionId,
        },
      });

      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Get order from database
    const order = await getOrderByTransactionId(merchantTransactionId);
    if (!order) {
      console.error('❌ Webhook: Order not found', { merchantTransactionId });
      // Still return 200 to prevent PhonePe from retrying
      return NextResponse.json({ received: true });
    }

    // Log webhook received
    await createPaymentEvent({
      order_id: order.id,
      event_type: 'phonepe_webhook',
      payload: paymentData,
    });

    // Map PhonePe status to internal status
    const phonepeStatus = state || code || responseCode || 'UNKNOWN';
    const internalStatus = mapPhonePeStatus(phonepeStatus);

    // Update order status (idempotent - safe to call multiple times)
    const previousStatus = order.status;
    
    if (previousStatus !== internalStatus) {
      await updateOrderStatus(order.id, internalStatus, {
        metadata: {
          ...order.metadata,
          phonepeTransactionId: transactionId,
          phonepeStatus,
          phonepeWebhookData: paymentData,
          webhookReceivedAt: new Date().toISOString(),
        },
      });

      // Log status update
      await createPaymentEvent({
        order_id: order.id,
        event_type: 'webhook_status_update',
        payload: {
          previousStatus,
          newStatus: internalStatus,
          phonepeStatus,
          transactionId,
        },
      });

      console.log('✅ Webhook: Order status updated', {
        orderId: order.id,
        merchantTransactionId,
        previousStatus,
        newStatus: internalStatus,
      });
    } else {
      console.log('ℹ️ Webhook: Status unchanged', {
        orderId: order.id,
        status: internalStatus,
      });
    }

    // Always return 200 OK to PhonePe
    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed',
    });
  } catch (error: any) {
    console.error('❌ Error processing PhonePe webhook:', error);
    
    // Still return 200 to prevent PhonePe from retrying on transient errors
    // Log the error for investigation
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
      },
      { status: 200 } // Return 200 to prevent retries
    );
  }
}


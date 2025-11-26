/**
 * PhonePe Payment Status Check API
 * GET /api/payments/phonepe/status?txnId={merchantTransactionId}
 * 
 * Checks payment status with PhonePe and updates order
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateXVerify,
  getPhonePeAccessToken,
  PHONEPE_BASE_URL,
  PHONEPE_MERCHANT_ID,
  mapPhonePeStatus,
  isTestMode,
  isDummyMode,
} from '@/lib/phonepe';
import {
  getOrderByTransactionId,
  updateOrderStatus,
  createPaymentEvent,
} from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const merchantTransactionId = searchParams.get('txnId');

    if (!merchantTransactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Get order from database
    const order = await getOrderByTransactionId(merchantTransactionId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // DUMMY MODE: Simulate successful payment without API calls
    if (isDummyMode()) {
      console.log('🧪 DUMMY MODE: Simulating payment status check (no API calls)');
      
      // In dummy mode, simulate successful payment
      const dummyStatus = 'success';
      
      // Update order if not already successful
      if (order.status !== dummyStatus) {
        await updateOrderStatus(order.id, dummyStatus, {
          metadata: {
            ...order.metadata,
            dummyMode: true,
            dummyCompletedAt: new Date().toISOString(),
          },
        });

        // Log dummy payment completion
        await createPaymentEvent({
          order_id: order.id,
          event_type: 'dummy_payment_completed',
          payload: {
            merchantTransactionId,
            status: dummyStatus,
            dummyMode: true,
          },
        });
      }

      return NextResponse.json({
        status: dummyStatus,
        orderId: order.id,
        transactionId: merchantTransactionId,
        amount: order.amount_paise,
        amountRupees: order.amount_paise / 100,
        phonepeStatus: 'PAYMENT_SUCCESS',
        dummyMode: true,
        message: 'Dummy payment completed successfully',
      });
    }

    // TEST MODE: Use PhonePe's actual sandbox/test API for status check
    if (isTestMode()) {
      console.log('🧪 TEST MODE: Checking payment status via PhonePe Sandbox API');
    }

    // Get OAuth access token for API authentication
    let accessToken: string;
    try {
      accessToken = await getPhonePeAccessToken();
    } catch (error: any) {
      console.error('❌ Failed to get OAuth token for status check:', error);
      return NextResponse.json(
        {
          status: order.status,
          orderId: order.id,
          error: 'Failed to authenticate with PhonePe API',
        },
        { status: 500 }
      );
    }

    // Build PhonePe status check request
    // According to PhonePe docs: /checkout/v2/order/{merchantOrderId}/status
    // Note: merchantOrderId is the merchantTransactionId we sent
    const apiPath = `/checkout/v2/order/${merchantTransactionId}/status`;
    
    // For status check (GET), checksum is: SHA256(apiPath + SALT_KEY) + "###" + SALT_INDEX
    const xVerify = generateXVerify('', apiPath); // Empty payload for GET status check

    console.log('📞 Checking PhonePe payment status:', {
      merchantTransactionId,
      orderId: order.id,
    });

    // Make API call to PhonePe
    const response = await fetch(`${PHONEPE_BASE_URL}${apiPath}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': PHONEPE_MERCHANT_ID,
        'Accept': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('📞 PhonePe Status Response:', {
      status: response.status,
    });

    // Log status check event
    await createPaymentEvent({
      order_id: order.id,
      event_type: 'status_check',
      payload: {
        httpStatus: response.status,
        response: responseText.substring(0, 500),
      },
    });

    if (!response.ok) {
      console.error('PhonePe status check failed:', responseText);
      return NextResponse.json(
        {
          status: order.status, // Return current status
          orderId: order.id,
          error: 'Failed to check payment status',
        },
        { status: response.status }
      );
    }

    // Parse response
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PhonePe status response:', responseText);
      return NextResponse.json(
        {
          status: order.status,
          orderId: order.id,
          error: 'Invalid response from PhonePe',
        },
        { status: 500 }
      );
    }

    // Extract payment status from PhonePe response
    // According to PhonePe API documentation structure
    const phonepeStatus = responseData?.data?.state || 
                         responseData?.data?.status || 
                         responseData?.state || 
                         responseData?.status || 
                         'UNKNOWN';

    const internalStatus = mapPhonePeStatus(phonepeStatus);

    // Update order status if changed
    if (order.status !== internalStatus) {
      await updateOrderStatus(order.id, internalStatus, {
        metadata: {
          ...order.metadata,
          phonepeStatus,
          phonepeResponse: responseData,
          statusCheckedAt: new Date().toISOString(),
        },
      });

      // Log status change
      await createPaymentEvent({
        order_id: order.id,
        event_type: 'status_updated',
        payload: {
          oldStatus: order.status,
          newStatus: internalStatus,
          phonepeStatus,
        },
      });
    }

    return NextResponse.json({
      status: internalStatus,
      orderId: order.id,
      transactionId: merchantTransactionId,
      amount: order.amount_paise,
      amountRupees: order.amount_paise / 100,
      phonepeStatus,
    });
  } catch (error: any) {
    console.error('❌ Error checking PhonePe payment status:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to check payment status',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}


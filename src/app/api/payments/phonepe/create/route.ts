/**
 * PhonePe Payment Creation API
 * POST /api/payments/phonepe/create
 * 
 * Creates a payment order and initiates PhonePe payment
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSubscriptionPlan } from '@/lib/subscriptions';
import {
  generateXVerify,
  encodePayload,
  generateMerchantTransactionId,
  getPhonePeConfig,
  getPhonePeAccessToken,
  isTestMode,
  isDummyMode,
  type PhonePePayRequest,
  PHONEPE_BASE_URL,
  APP_BASE_URL,
} from '@/lib/phonepe';
import { createOrder, createPaymentEvent, updateOrderStatus } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user (you'll need to implement auth check)
    const authHeader = request.headers.get('authorization');
    // TODO: Verify JWT token and get user_id
    // For now, we'll get it from request body - in production, use proper auth
    const body = await request.json();
    const { userId, planId, amount, description, metadata, vendorPhone } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      );
    }

    if (!planId || !amount) {
      return NextResponse.json(
        { error: 'Plan ID and amount are required' },
        { status: 400 }
      );
    }

    // Validate PhonePe configuration
    const config = getPhonePeConfig();
    if (!config.isConfigured) {
      return NextResponse.json(
        { error: 'PhonePe payment gateway is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Get subscription plan details
    const plan = await getSubscriptionPlan(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 404 }
      );
    }

    // Convert amount from rupees to paise (PhonePe expects paise)
    // Amount comes from frontend in rupees, convert to paise
    const amountPaise = Math.round(amount * 100);
    if (amountPaise < 100) {
      return NextResponse.json(
        { error: 'Minimum payment amount is ₹1 (100 paise)' },
        { status: 400 }
      );
    }

    // Generate unique merchant transaction ID
    const merchantTransactionId = generateMerchantTransactionId('RENT');

    // Create order in Supabase
    const order = await createOrder({
      user_id: userId,
      phonepe_txn_id: merchantTransactionId,
      amount_paise: amountPaise,
      currency: 'INR',
      description: description || `Subscription: ${plan.name}`,
      metadata: {
        planId,
        planName: plan.name,
        ...metadata,
      },
    });

    // Log order creation event
    await createPaymentEvent({
      order_id: order.id,
      event_type: 'order_created',
      payload: {
        planId,
        amountPaise,
        merchantTransactionId,
      },
    });

    // DUMMY MODE: Completely simulate payment without any API calls
    if (isDummyMode()) {
      console.log('🧪 DUMMY MODE: Simulating PhonePe payment (no API calls)');
      
      // Update order status to pending
      await updateOrderStatus(order.id, 'pending');
      
      // Create a test payment URL that redirects back to our redirect page
      const testRedirectUrl = `${APP_BASE_URL}/payments/phonepe/redirect?txnId=${merchantTransactionId}&dummy=true`;
      
      // Log dummy mode event
      await createPaymentEvent({
        order_id: order.id,
        event_type: 'dummy_payment_initiated',
        payload: {
          merchantTransactionId,
          amountPaise,
          dummyMode: true,
        },
      });

      return NextResponse.json({
        success: true,
        redirectUrl: testRedirectUrl,
        orderId: order.id,
        transactionId: merchantTransactionId,
        dummyMode: true,
      });
    }

    // TEST MODE: Use PhonePe's actual sandbox/test API
    // This makes real API calls to PhonePe's test environment
    if (isTestMode()) {
      console.log('🧪 TEST MODE: Using PhonePe Sandbox/Test API');
    }

    // Build PhonePe payment request payload
    const redirectUrl = `${APP_BASE_URL}/payments/phonepe/redirect?txnId=${merchantTransactionId}`;
    const callbackUrl = `${APP_BASE_URL}/api/payments/phonepe/webhook`;

    const payRequest: PhonePePayRequest = {
      merchantId: config.merchantId,
      merchantTransactionId,
      merchantUserId: userId.substring(0, 36), // PhonePe has 36 char limit
      amount: amountPaise,
      redirectUrl,
      redirectMode: 'REDIRECT',
      callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    // Add mobile number if provided
    if (vendorPhone) {
      const cleanPhone = vendorPhone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length === 10) {
        payRequest.mobileNumber = cleanPhone;
      }
    }

    // Encode payload as Base64
    const base64Payload = encodePayload(payRequest);

    // Generate X-VERIFY header
    // According to PhonePe docs: /checkout/v2/pay
    const apiPath = '/checkout/v2/pay';
    const xVerify = generateXVerify(base64Payload, apiPath);

    // Get OAuth access token for API authentication
    let accessToken: string;
    try {
      accessToken = await getPhonePeAccessToken();
      console.log('✅ PhonePe OAuth token obtained');
    } catch (error: any) {
      console.error('❌ Failed to get OAuth token:', error);
      await updateOrderStatus(order.id, 'failed', {
        metadata: {
          ...order.metadata,
          error: 'Failed to authenticate with PhonePe API',
        },
      });
      return NextResponse.json(
        { error: 'Failed to authenticate with PhonePe. Please check your OAuth credentials.' },
        { status: 500 }
      );
    }

    // Log payment request (without sensitive data)
    console.log('📞 PhonePe Payment Request:', {
      merchantTransactionId,
      amountPaise,
      orderId: order.id,
      redirectUrl,
      environment: isTestMode() ? 'SANDBOX/TEST' : 'PRODUCTION',
    });

    // Make API call to PhonePe
    const response = await fetch(`${PHONEPE_BASE_URL}${apiPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-VERIFY': xVerify,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const responseText = await response.text();
    console.log('📞 PhonePe API Response:', {
      status: response.status,
      statusText: response.statusText,
    });

    // Log response event
    await createPaymentEvent({
      order_id: order.id,
      event_type: 'phonepe_api_response',
      payload: {
        status: response.status,
        response: responseText.substring(0, 500), // Limit response size
      },
    });

    if (!response.ok) {
      // Update order status to failed
      await updateOrderStatus(order.id, 'failed', {
        metadata: {
          ...order.metadata,
          error: responseText.substring(0, 200),
        },
      });

      let errorMessage = 'Failed to create PhonePe payment';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error?.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `PhonePe API Error (${response.status}): ${responseText.substring(0, 200)}`;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status || 500 }
      );
    }

    // Parse response
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PhonePe response:', responseText);
      throw new Error('Invalid response from PhonePe API');
    }

    // Extract redirect URL according to PhonePe API response structure
    const redirectUrlFromPhonePe = responseData?.data?.instrumentResponse?.redirectInfo?.url;

    if (!redirectUrlFromPhonePe) {
      console.error('Payment URL not found in response:', JSON.stringify(responseData, null, 2));
      await updateOrderStatus(order.id, 'failed', {
        metadata: {
          ...order.metadata,
          phonepeResponse: responseData,
        },
      });
      return NextResponse.json(
        { 
          error: 'Payment URL not received from PhonePe',
          details: responseData?.message || 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Update order status to pending
    await updateOrderStatus(order.id, 'pending');

    // Log successful payment initiation
    await createPaymentEvent({
      order_id: order.id,
      event_type: 'phonepe_payment_initiated',
      payload: {
        redirectUrl: redirectUrlFromPhonePe,
      },
    });

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrlFromPhonePe,
      orderId: order.id,
      transactionId: merchantTransactionId,
    });
  } catch (error: any) {
    console.error('❌ Error creating PhonePe payment:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to create payment',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}


/**
 * PhonePe Payment Gateway Utilities
 * Server-side only - never expose SALT_KEY to client
 */

import crypto from 'crypto';

// PhonePe Configuration (server-side only)
const PHONEPE_ENV = process.env.PHONEPE_ENV || 'sandbox';
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || '';
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY || '';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
// OAuth Credentials for Authorization
const PHONEPE_CLIENT_ID = process.env.PHONEPE_CLIENT_ID || '';
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || '';
// Test mode: Use PhonePe sandbox/test environment (real API calls to test environment)
// This is different from dummy mode - it uses PhonePe's actual test API
const PHONEPE_TEST_MODE = process.env.PHONEPE_TEST_MODE === 'true';
const PHONEPE_DUMMY_MODE = process.env.PHONEPE_DUMMY_MODE === 'true'; // Completely skip API calls
// PhonePe Base URLs according to official documentation
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || (
  PHONEPE_ENV === 'production'
    ? 'https://api.phonepe.com/apis/pg'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox'
);
const PHONEPE_AUTH_BASE_URL = process.env.PHONEPE_AUTH_BASE_URL || (
  PHONEPE_ENV === 'production'
    ? 'https://api.phonepe.com/apis/identity-manager'
    : 'https://api-preprod.phonepe.com/apis/identity-manager'
);

/**
 * Get OAuth Access Token from PhonePe
 * Required for API authentication
 * According to PhonePe docs: https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration/api-reference/authorization
 */
export async function getPhonePeAccessToken(): Promise<string> {
  if (!PHONEPE_CLIENT_ID || !PHONEPE_CLIENT_SECRET) {
    throw new Error('PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET are required for API authentication');
  }

  try {
    const authUrl = `${PHONEPE_AUTH_BASE_URL}/v1/oauth/token`;
    
    // Create Basic Auth header
    const credentials = Buffer.from(`${PHONEPE_CLIENT_ID}:${PHONEPE_CLIENT_SECRET}`).toString('base64');
    
    console.log('🔐 Requesting PhonePe OAuth token:', {
      url: authUrl,
      clientId: PHONEPE_CLIENT_ID.substring(0, 10) + '...',
      environment: PHONEPE_ENV,
    });
    
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('PhonePe OAuth Error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseText,
      });
      throw new Error(`Failed to get OAuth token: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse OAuth response:', responseText);
      throw new Error('Invalid JSON response from PhonePe OAuth endpoint');
    }
    
    if (!data.access_token) {
      console.error('OAuth response missing access_token:', data);
      throw new Error('Access token not received from PhonePe');
    }

    console.log('✅ PhonePe OAuth token obtained successfully');
    return data.access_token;
  } catch (error: any) {
    console.error('❌ Error getting PhonePe access token:', error);
    throw error;
  }
}
const APP_BASE_URL = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// PhonePe Payment Request according to official API documentation
export interface PhonePePayRequest {
  merchantId: string;
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number; // in paise
  redirectUrl: string;
  redirectMode: 'REDIRECT';
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type: 'PAY_PAGE';
  };
}

// PhonePe API Response structure
export interface PhonePePayResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    instrumentResponse: {
      type: string;
      redirectInfo: {
        url: string;
        method: string;
      };
    };
  };
}

export interface PhonePeStatusRequest {
  merchantId: string;
  merchantTransactionId: string;
}

/**
 * Generate X-VERIFY header for PhonePe API
 * Formula: SHA256(base64Payload + apiPath + SALT_KEY) + "###" + SALT_INDEX
 * 
 * For status check (GET), base64Payload may be empty
 */
export function generateXVerify(base64Payload: string, apiPath: string): string {
  if (!PHONEPE_SALT_KEY) {
    throw new Error('PHONEPE_SALT_KEY is not configured');
  }

  // For GET requests (status check), payload is empty
  const stringToHash = base64Payload 
    ? `${base64Payload}${apiPath}${PHONEPE_SALT_KEY}`
    : `${apiPath}${PHONEPE_SALT_KEY}`;
  
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${hash}###${PHONEPE_SALT_INDEX}`;
}

/**
 * Generate base64 encoded payload
 */
export function encodePayload(payload: any): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Decode base64 payload
 */
export function decodePayload(base64String: string): any {
  return JSON.parse(Buffer.from(base64String, 'base64').toString('utf-8'));
}

/**
 * Verify PhonePe callback/webhook signature
 */
export function verifySignature(
  base64Payload: string,
  apiPath: string,
  xVerify: string
): boolean {
  try {
    if (!PHONEPE_SALT_KEY) {
      console.error('PHONEPE_SALT_KEY not configured for signature verification');
      return false;
    }

    const [hash, saltIndex] = xVerify.split('###');
    if (saltIndex !== PHONEPE_SALT_INDEX) {
      console.error('Salt index mismatch:', saltIndex, 'expected', PHONEPE_SALT_INDEX);
      return false;
    }

    const stringToHash = `${base64Payload}${apiPath}${PHONEPE_SALT_KEY}`;
    const calculatedHash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    
    return calculatedHash === hash;
  } catch (error) {
    console.error('Error verifying PhonePe signature:', error);
    return false;
  }
}

/**
 * Get PhonePe configuration
 */
export function getPhonePeConfig() {
  return {
    merchantId: PHONEPE_MERCHANT_ID,
    saltKey: PHONEPE_SALT_KEY ? '***configured***' : 'NOT SET',
    saltIndex: PHONEPE_SALT_INDEX,
    baseUrl: PHONEPE_BASE_URL,
    appBaseUrl: APP_BASE_URL,
    env: PHONEPE_ENV,
    isConfigured: !!PHONEPE_MERCHANT_ID && !!PHONEPE_SALT_KEY,
    testMode: PHONEPE_TEST_MODE, // Using PhonePe sandbox/test environment
    dummyMode: PHONEPE_DUMMY_MODE, // Completely skip API calls (simulation only)
  };
}

export function isTestMode(): boolean {
  return PHONEPE_TEST_MODE;
}

export function isDummyMode(): boolean {
  return PHONEPE_DUMMY_MODE;
}

/**
 * Map PhonePe status to internal order status
 */
export function mapPhonePeStatus(phonepeStatus: string): 'pending' | 'success' | 'failed' | 'cancelled' {
  const status = phonepeStatus.toUpperCase();
  
  if (status === 'SUCCESS' || status === 'PAYMENT_SUCCESS') {
    return 'success';
  }
  
  if (status === 'PENDING' || status === 'PAYMENT_PENDING') {
    return 'pending';
  }
  
  if (status === 'FAILED' || status === 'PAYMENT_FAILED' || status === 'PAYMENT_ERROR') {
    return 'failed';
  }
  
  if (status === 'CANCELLED' || status === 'PAYMENT_CANCELLED') {
    return 'cancelled';
  }
  
  // Default to failed for unknown statuses
  return 'failed';
}

/**
 * Generate unique merchant transaction ID
 */
export function generateMerchantTransactionId(prefix: string = 'TXN'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${prefix}_${timestamp}_${random}`;
}

export {
  PHONEPE_MERCHANT_ID,
  PHONEPE_SALT_KEY,
  PHONEPE_SALT_INDEX,
  PHONEPE_CLIENT_ID,
  PHONEPE_CLIENT_SECRET,
  PHONEPE_BASE_URL,
  PHONEPE_AUTH_BASE_URL,
  APP_BASE_URL,
  PHONEPE_ENV,
  PHONEPE_TEST_MODE,
  PHONEPE_DUMMY_MODE,
};


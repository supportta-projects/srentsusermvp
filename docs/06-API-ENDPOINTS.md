# 🔌 API Endpoints Reference

Complete reference for all API endpoints in the RentOrent MVP.

## 📋 Table of Contents

1. [Email API](#email-api)
2. [Razorpay API](#razorpay-api)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)

---

## Email API

### POST `/api/email/send`

Send an email notification.

**Request Body**:
```typescript
{
  to: string;           // Recipient email address
  subject: string;      // Email subject
  html: string;         // HTML email content
}
```

**Response**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Example**:
```typescript
const response = await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'shop@example.com',
    subject: 'New Rental Inquiry',
    html: '<p>You have a new inquiry!</p>',
  }),
});

const data = await response.json();
```

**Error Codes**:
- `400`: Missing required fields
- `500`: SMTP error

---

## Razorpay API

### POST `/api/razorpay/create-order`

Create a Razorpay order for payment.

**Request Body**:
```typescript
{
  planId: string;       // 'monthly', 'six-month', 'yearly'
  amount: number;        // Amount in ₹ (e.g., 1499)
}
```

**Response**:
```typescript
{
  orderId: string;      // Razorpay order ID
  error?: string;
}
```

**Example**:
```typescript
const response = await fetch('/api/razorpay/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    planId: 'monthly',
    amount: 1499,
  }),
});

const { orderId } = await response.json();
```

**Error Codes**:
- `400`: Invalid plan ID or amount
- `500`: Razorpay API error

---

### POST `/api/razorpay/verify-payment`

Verify Razorpay payment signature.

**Request Body**:
```typescript
{
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Example**:
```typescript
const response = await fetch('/api/razorpay/verify-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razorpay_order_id: 'order_xxx',
    razorpay_payment_id: 'pay_xxx',
    razorpay_signature: 'signature_xxx',
  }),
});

const { success } = await response.json();
```

**Error Codes**:
- `400`: Invalid signature
- `500`: Verification error

---

### POST `/api/razorpay/webhook`

Handle Razorpay webhook events.

**Request Headers**:
```
X-Razorpay-Signature: string
```

**Request Body**:
```typescript
{
  event: string;        // Event type (e.g., 'payment.captured')
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        status: string;
        // ... other fields
      };
    };
  };
}
```

**Response**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Example**:
```typescript
// This is called by Razorpay, not your frontend
// Configure webhook URL in Razorpay dashboard:
// https://yourdomain.com/api/razorpay/webhook
```

**Error Codes**:
- `400`: Invalid signature
- `500`: Processing error

---

## Authentication

Authentication is handled by Supabase, not custom API routes. See [Authentication Flow](./03-DATA-FLOW.md#authentication-flow) for details.

---

## Error Handling

### Standard Error Response

All API endpoints return errors in this format:

```typescript
{
  error: string;        // Error message
  code?: string;        // Error code (optional)
}
```

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (not authorized)
- `404`: Not Found
- `500`: Internal Server Error

### Example Error Handling

```typescript
try {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const result = await response.json();
  return result;
} catch (error) {
  console.error('API Error:', error);
  // Handle error
}
```

---

## 🎓 For Beginners

### How to Use API Endpoints

1. **Import fetch**: Use browser's `fetch` API
2. **Set headers**: Always include `Content-Type: application/json`
3. **Handle errors**: Check `response.ok` and handle errors
4. **Parse response**: Use `await response.json()`

### Example Template

```typescript
async function callAPI(endpoint: string, data: any) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2024


# 🔄 Data Flow Documentation

This document explains how data flows through the RentOrent MVP system, from user interactions to database storage and back.

## 📋 Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [User Registration Flow](#user-registration-flow)
3. [Profile Management Flow](#profile-management-flow)
4. [Subscription Payment Flow](#subscription-payment-flow)
5. [Product Browsing Flow](#product-browsing-flow)
6. [Contact/Lead Generation Flow](#contactlead-generation-flow)
7. [Email Notification Flow](#email-notification-flow)

---

## Authentication Flow

### Visual Flow Diagram

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Enter email & PIN
       │
┌──────▼──────────────────┐
│  Login Page              │
│  (/login)                │
└──────┬──────────────────┘
       │
       │ 2. Submit form
       │
┌──────▼──────────────────┐
│  AuthContext             │
│  signIn()                │
└──────┬──────────────────┘
       │
       │ 3. API call
       │
┌──────▼──────────────────┐
│  Supabase Auth           │
│  signInWithPassword()    │
└──────┬──────────────────┘
       │
       │ 4. Verify credentials
       │
┌──────▼──────────────────┐
│  Supabase Database       │
│  auth.users              │
└──────┬──────────────────┘
       │
       │ 5. Return user session
       │
┌──────▼──────────────────┐
│  AuthContext             │
│  onAuthStateChange()     │
└──────┬──────────────────┘
       │
       │ 6. Update state
       │
┌──────▼──────────────────┐
│  React Components        │
│  (Re-render with user)   │
└──────────────────────────┘
```

### Step-by-Step Process

1. **User Action**: User enters email and 6-digit PIN on login page
2. **Form Submission**: `handleSubmit()` validates and calls `signIn()`
3. **Supabase Auth**: `supabase.auth.signInWithPassword()` authenticates user
4. **Session Creation**: Supabase creates session and returns user object
5. **State Update**: `onAuthStateChange` listener updates `AuthContext`
6. **UI Update**: React components re-render with authenticated user
7. **Redirect**: User redirected to `/vendor` or checkout page

### Code Example

```typescript
// src/contexts/AuthContext.tsx
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;

  // Auth state listener automatically updates state
  // No manual state update needed
};
```

---

## User Registration Flow

### Visual Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Fill registration form
       │
┌──────▼──────────────────┐
│  Register Page           │
│  (/register)             │
└──────┬──────────────────┘
       │
       │ 2. Submit form
       │
┌──────▼──────────────────┐
│  AuthContext             │
│  signUp()                │
└──────┬──────────────────┘
       │
       │ 3. Create account
       │
┌──────▼──────────────────┐
│  Supabase Auth           │
│  signUp()                │
└──────┬──────────────────┘
       │
       │ 4. Create user
       │
┌──────▼──────────────────┐
│  Database Trigger        │
│  handle_new_user()       │
└──────┬──────────────────┘
       │
       │ 5. Auto-create profile
       │
┌──────▼──────────────────┐
│  Supabase Database       │
│  profiles table          │
└──────┬──────────────────┘
       │
       │ 6. Return user
       │
┌──────▼──────────────────┐
│  AuthContext             │
│  Update state            │
└──────┬──────────────────┘
       │
       │ 7. Redirect
       │
┌──────▼──────────────────┐
│  Vendor Page             │
│  (/vendor)               │
└──────────────────────────┘
```

### Step-by-Step Process

1. **User Action**: User fills registration form (name, email, PIN)
2. **Form Validation**: Client-side validation checks all fields
3. **API Call**: `signUp()` calls `supabase.auth.signUp()`
4. **User Creation**: Supabase creates user in `auth.users` table
5. **Trigger Fires**: `on_auth_user_created` trigger executes
6. **Profile Creation**: `handle_new_user()` function creates profile
7. **Data Extraction**: Extracts `name` and `phone` from metadata
8. **State Update**: Auth context updates with new user
9. **Redirect**: User redirected to vendor page or checkout

### Code Example

```typescript
// src/contexts/AuthContext.tsx
const signUp = async (email: string, password: string, name: string, phone?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        name: name.trim(),
        phone: phone?.trim() || undefined,
      },
    },
  });

  if (error) throw error;
  // Profile automatically created by trigger
};
```

### Database Trigger

```sql
-- Automatically creates profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Profile Management Flow

### Visual Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Navigate to /profile
       │
┌──────▼──────────────────┐
│  Profile Page            │
│  (/profile)              │
└──────┬──────────────────┘
       │
       │ 2. Load profile
       │
┌──────▼──────────────────┐
│  getCurrentUserProfile() │
└──────┬──────────────────┘
       │
       │ 3. Query Supabase
       │
┌──────▼──────────────────┐
│  Supabase Database       │
│  profiles table          │
└──────┬──────────────────┘
       │
       │ 4. Return profile data
       │
┌──────▼──────────────────┐
│  Profile Page            │
│  (Display form)          │
└──────┬──────────────────┘
       │
       │ 5. User edits & saves
       │
┌──────▼──────────────────┐
│  upsertProfile()         │
└──────┬──────────────────┘
       │
       │ 6. Update database
       │
┌──────▼──────────────────┐
│  Supabase Database       │
│  profiles table          │
└──────┬──────────────────┘
       │
       │ 7. Trigger updates
       │    updated_at
       │
┌──────▼──────────────────┐
│  Profile Page            │
│  (Show success)          │
└──────────────────────────┘
```

### Step-by-Step Process

1. **Page Load**: User navigates to `/profile`
2. **Fetch Profile**: `getCurrentUserProfile()` queries Supabase
3. **RLS Check**: Supabase RLS verifies user can access their profile
4. **Data Return**: Profile data returned (or null if doesn't exist)
5. **Form Population**: Form fields populated with profile data
6. **User Edits**: User modifies fields and clicks "Save"
7. **Validation**: Client-side validation (GST format, PIN code, etc.)
8. **Update**: `upsertProfile()` updates database
9. **Trigger**: `update_profiles_updated_at` trigger updates timestamp
10. **Success**: Success message shown to user

### Code Example

```typescript
// src/app/profile/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation
  if (!fullName.trim()) {
    setError('Full name is required');
    return;
  }

  // Update profile
  const { error: updateError } = await upsertProfile({
    full_name: fullName.trim(),
    phone: phone.trim() || undefined,
    company_name: companyName.trim() || undefined,
    // ... other fields
  });

  if (updateError) {
    setError(updateError.message);
    return;
  }

  setSuccess(true);
};
```

---

## Subscription Payment Flow

### Visual Flow Diagram

```
┌─────────────┐
│   Vendor    │
└──────┬──────┘
       │
       │ 1. Select plan
       │
┌──────▼──────────────────┐
│  Subscription Page      │
│  (/vendor/subscription) │
└──────┬──────────────────┘
       │
       │ 2. Click "Subscribe"
       │
┌──────▼──────────────────┐
│  Checkout Page          │
│  (/vendor/checkout)     │
└──────┬──────────────────┘
       │
       │ 3. Create order
       │
┌──────▼──────────────────┐
│  API: /api/razorpay/     │
│  create-order            │
└──────┬──────────────────┘
       │
       │ 4. Razorpay API
       │
┌──────▼──────────────────┐
│  Razorpay                │
│  (Order created)         │
└──────┬──────────────────┘
       │
       │ 5. Return order ID
       │
┌──────▼──────────────────┐
│  Payment Modal           │
│  (Razorpay Checkout)     │
└──────┬──────────────────┘
       │
       │ 6. User pays
       │
┌──────▼──────────────────┐
│  Razorpay                │
│  (Payment processed)     │
└──────┬──────────────────┘
       │
       │ 7. Webhook
       │
┌──────▼──────────────────┐
│  API: /api/razorpay/     │
│  webhook                 │
└──────┬──────────────────┘
       │
       │ 8. Verify signature
       │
┌──────▼──────────────────┐
│  Update Subscription     │
│  (localStorage)          │
└──────┬──────────────────┘
       │
       │ 9. Redirect
       │
┌──────▼──────────────────┐
│  Success Page            │
│  (/vendor/subscribe/     │
│   success)               │
└──────────────────────────┘
```

### Step-by-Step Process

1. **Plan Selection**: Vendor selects subscription plan (Monthly/6-Month/Yearly)
2. **Checkout**: Redirected to `/vendor/checkout?plan=monthly`
3. **Order Creation**: Frontend calls `/api/razorpay/create-order`
4. **Razorpay Order**: Backend creates Razorpay order
5. **Payment Modal**: Razorpay checkout modal opens
6. **Payment**: User completes payment via Razorpay
7. **Webhook**: Razorpay sends webhook to `/api/razorpay/webhook`
8. **Signature Verification**: Backend verifies webhook signature
9. **Subscription Update**: Subscription saved to localStorage
10. **Success**: User redirected to success page

### Code Example

```typescript
// Frontend: Create order
const response = await fetch('/api/razorpay/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ planId: 'monthly', amount: 1499 }),
});

const { orderId } = await response.json();

// Open Razorpay checkout
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: 1499 * 100, // in paise
  currency: 'INR',
  order_id: orderId,
  handler: async (response) => {
    // Verify payment
    await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      body: JSON.stringify(response),
    });
  },
};

const razorpay = new window.Razorpay(options);
razorpay.open();
```

---

## Product Browsing Flow

### Visual Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Visit homepage
       │
┌──────▼──────────────────┐
│  Vendor Page              │
│  (/vendor)               │
└──────┬──────────────────┘
       │
       │ 2. Browse products
       │
┌──────▼──────────────────┐
│  getProducts()            │
│  (Firestore query)        │
└──────┬──────────────────┘
       │
       │ 3. Query Firestore
       │
┌──────▼──────────────────┐
│  Firebase Firestore       │
│  products collection      │
└──────┬──────────────────┘
       │
       │ 4. Return products
       │
┌──────▼──────────────────┐
│  Product Cards           │
│  (Display grid)          │
└──────┬──────────────────┘
       │
       │ 5. Click product
       │
┌──────▼──────────────────┐
│  Product Detail Page      │
│  (/products/[id])        │
└──────────────────────────┘
```

### Step-by-Step Process

1. **Page Load**: User visits vendor homepage
2. **Query Products**: `getProducts()` queries Firestore
3. **Filters Applied**: City, category, price filters applied
4. **Data Return**: Products returned from Firestore
5. **Display**: Product cards rendered in grid
6. **Pagination**: "Load More" button loads next batch
7. **Product Click**: User clicks product card
8. **Detail Page**: Product detail page loads
9. **Shop Info**: Shop information fetched and displayed

---

## Contact/Lead Generation Flow

### Visual Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Click "Contact"
       │
┌──────▼──────────────────┐
│  Contact Modal           │
│  (Opens)                 │
└──────┬──────────────────┘
       │
       │ 2. Fill form
       │
┌──────▼──────────────────┐
│  Submit Form             │
└──────┬──────────────────┘
       │
       │ 3. Create contact
       │
┌──────▼──────────────────┐
│  Firestore               │
│  contacts collection     │
└──────┬──────────────────┘
       │
       │ 4. Send email
       │
┌──────▼──────────────────┐
│  API: /api/email/send     │
└──────┬──────────────────┘
       │
       │ 5. SMTP
       │
┌──────▼──────────────────┐
│  Email Service           │
│  (Hostinger SMTP)        │
└──────┬──────────────────┘
       │
       │ 6. Email sent
       │
┌──────▼──────────────────┐
│  Shop Owner              │
│  (Receives email)        │
└──────────────────────────┘
```

### Step-by-Step Process

1. **User Action**: User clicks "Contact" or "Rent Now" button
2. **Modal Opens**: Contact modal opens with form
3. **Form Fill**: User enters name, phone, message (optional)
4. **Validation**: Client-side validation (phone format, etc.)
5. **Submit**: Form submitted to Firestore
6. **Contact Created**: Document created in `contacts` collection
7. **Email Trigger**: API endpoint `/api/email/send` called
8. **Email Sent**: SMTP service sends email to shop owner
9. **Success**: Success message shown to user
10. **Modal Closes**: Modal closes automatically

### Code Example

```typescript
// Create contact in Firestore
const contactsRef = collection(db, 'contacts');
await addDoc(contactsRef, {
  productId: product.id,
  shopId: product.shopId,
  name: name,
  phone: phone,
  message: message,
  status: 'pending',
  createdAt: new Date(),
});

// Send email notification
await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: shop.email,
    subject: `New Rental Inquiry: ${product.title}`,
    html: emailTemplate,
  }),
});
```

---

## Email Notification Flow

### Visual Flow Diagram

```
┌─────────────┐
│   System    │
└──────┬──────┘
       │
       │ 1. Event occurs
       │    (Contact, Payment, etc.)
       │
┌──────▼──────────────────┐
│  API Route               │
│  /api/email/send         │
└──────┬──────────────────┘
       │
       │ 2. Validate request
       │
┌──────▼──────────────────┐
│  Email Service           │
│  (Nodemailer)            │
└──────┬──────────────────┘
       │
       │ 3. Connect to SMTP
       │
┌──────▼──────────────────┐
│  SMTP Server             │
│  (Hostinger)             │
└──────┬──────────────────┘
       │
       │ 4. Send email
       │
┌──────▼──────────────────┐
│  Recipient               │
│  (Shop owner, Admin)     │
└──────────────────────────┘
```

### Step-by-Step Process

1. **Event Trigger**: Contact form submitted, payment completed, etc.
2. **API Call**: Frontend or backend calls `/api/email/send`
3. **Request Validation**: API validates email, subject, content
4. **SMTP Connection**: Nodemailer connects to SMTP server
5. **Email Sent**: Email sent via SMTP
6. **Confirmation**: Success/error response returned
7. **Logging**: Email attempt logged for debugging

### Code Example

```typescript
// src/app/api/email/send/route.ts
export async function POST(request: Request) {
  const { to, subject, html } = await request.json();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  });

  return Response.json({ success: true });
}
```

---

## 🎓 For Beginners

### Understanding Data Flow

Think of data flow like a **restaurant order**:

1. **Customer** (User) places order (action)
2. **Waiter** (Frontend) takes order to kitchen (API call)
3. **Kitchen** (Backend/Database) prepares food (processes data)
4. **Waiter** brings food back (returns data)
5. **Customer** receives food (sees result)

### Common Patterns

1. **CRUD Operations**:
   - **Create**: User → Form → API → Database
   - **Read**: User → Page Load → API → Database → Display
   - **Update**: User → Edit → API → Database → Refresh
   - **Delete**: User → Delete → API → Database → Remove

2. **Authentication Flow**:
   - Always goes through Supabase Auth
   - Session stored in browser
   - Automatically checked on page load

3. **Payment Flow**:
   - Always verify on backend
   - Never trust frontend payment data
   - Use webhooks for confirmation

### Debugging Tips

1. **Check Browser Console**: See frontend errors
2. **Check Network Tab**: See API calls and responses
3. **Check Database**: Verify data was saved
4. **Check Logs**: Server logs show backend errors

---

**Document Version**: 1.0  
**Last Updated**: 2024


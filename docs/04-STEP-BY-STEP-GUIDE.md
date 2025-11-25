# 📝 Step-by-Step Implementation Guide

This guide walks you through the implementation of the RentOrent MVP, step by step. Perfect for beginners and developers new to the project.

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Database Setup](#database-setup)
3. [Authentication Implementation](#authentication-implementation)
4. [Profile Management](#profile-management)
5. [Subscription System](#subscription-system)
6. [Payment Integration](#payment-integration)
7. [Email Notifications](#email-notifications)
8. [Testing & Deployment](#testing--deployment)

---

## Project Setup

### Step 1: Install Dependencies

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install project dependencies
pnpm install
```

**What this does**: Installs all required packages (Next.js, React, TypeScript, etc.)

### Step 2: Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Firebase Configuration (if using Firestore)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@rentorent.net
SMTP_PASS=your_password
NOTIFICATION_EMAIL=info@abijithcb.com
```

**Why**: Environment variables keep sensitive data out of code

### Step 3: Run Development Server

```bash
pnpm run dev
```

**What this does**: Starts Next.js development server on `http://localhost:3000`

---

## Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy project URL and anon key to `.env.local`

### Step 2: Run Database Schema

1. Open Supabase SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Run the SQL script

**What this creates**:
- `profiles` table
- RLS policies
- Triggers for auto-profile creation
- Indexes

### Step 3: Verify Setup

```sql
-- Check if table exists
SELECT * FROM profiles LIMIT 1;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';
```

**Expected**: Table exists, RLS is enabled

---

## Authentication Implementation

### Step 1: Create Supabase Client

**File**: `src/lib/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**What this does**: Creates a Supabase client for API calls

### Step 2: Create Auth Context

**File**: `src/contexts/AuthContext.tsx`

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapSupabaseUserToAppUser(session?.user || null));
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(mapSupabaseUserToAppUser(session?.user || null));
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

**What this does**: Provides authentication state and methods to all components

### Step 3: Wrap App with AuthProvider

**File**: `src/app/layout.tsx`

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**What this does**: Makes auth context available to all pages

### Step 4: Create Login Page

**File**: `src/app/login/page.tsx`

```typescript
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/vendor');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="PIN (6 digits)"
        maxLength={6}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
```

**Key Points**:
- ✅ Wrapped in Suspense (required for `useSearchParams()`)
- ✅ Uses `useAuth()` hook
- ✅ Handles errors and loading states

---

## Profile Management

### Step 1: Create Profile Helper Functions

**File**: `src/lib/supabase-profiles.ts`

```typescript
import { supabase } from './supabaseClient';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  // ... other fields
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function upsertProfile(updates: {
  full_name?: string;
  phone?: string;
  // ... other fields
}): Promise<{ data: Profile | null; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
}
```

**What this does**: Provides functions to read and update user profiles

### Step 2: Create Profile Page

**File**: `src/app/profile/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getCurrentUserProfile, upsertProfile } from '@/lib/supabase-profiles';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getCurrentUserProfile();
      if (profile) {
        setFullName(profile.full_name || '');
        setPhone(profile.phone || '');
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const { error: updateError } = await upsertProfile({
      full_name: fullName.trim(),
      phone: phone.trim() || undefined,
    });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 4000);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        required
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder="Phone (10 digits)"
      />
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Profile updated!</p>}
      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
```

**Key Points**:
- ✅ Loads profile on mount
- ✅ Validates input
- ✅ Shows success/error messages
- ✅ Handles loading states

---

## Subscription System

### Step 1: Create Subscription Plans

**File**: `src/lib/subscriptions.ts`

```typescript
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  return [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      description: 'Perfect for getting started',
      amount: 1499,
      duration: 30,
      features: ['Feature 1', 'Feature 2'],
      isActive: true,
    },
    // ... other plans
  ];
}
```

**What this does**: Returns available subscription plans (currently mock data)

### Step 2: Create Subscription Page

**File**: `src/app/vendor/subscription/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getSubscriptionPlans, SubscriptionPlan } from '@/lib/subscriptions';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      const data = await getSubscriptionPlans();
      setPlans(data);
      setLoading(false);
    };
    loadPlans();
  }, []);

  const handleSubscribe = (planId: string) => {
    router.push(`/vendor/checkout?plan=${planId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Choose Your Plan</h1>
      {plans.map((plan) => (
        <div key={plan.id}>
          <h2>{plan.name}</h2>
          <p>₹{plan.amount}</p>
          <button onClick={() => handleSubscribe(plan.id)}>
            Subscribe
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Payment Integration

### Step 1: Create Razorpay Order API

**File**: `src/app/api/razorpay/create-order/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { planId, amount } = await request.json();

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Step 2: Create Payment Verification API

**File**: `src/app/api/razorpay/verify-payment/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = 
      await request.json();

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Payment verified - update subscription
    // ... your logic here

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

**Key Points**:
- ✅ Always verify signature on backend
- ✅ Never trust frontend payment data
- ✅ Update subscription after verification

---

## Email Notifications

### Step 1: Create Email API

**File**: `src/app/api/email/send/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json();

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Step 2: Use Email API

```typescript
// In your component or API route
await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'shop@example.com',
    subject: 'New Rental Inquiry',
    html: '<p>You have a new inquiry!</p>',
  }),
});
```

---

## Testing & Deployment

### Step 1: Run Build

```bash
pnpm run build
```

**What to check**:
- ✅ No TypeScript errors
- ✅ No build errors
- ✅ All pages compile successfully

### Step 2: Test Locally

```bash
pnpm run start
```

**What to test**:
- ✅ Login/Register flows
- ✅ Profile updates
- ✅ Payment flow (test mode)
- ✅ Email sending

### Step 3: Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

## 🎓 Common Issues & Solutions

### Issue 1: "Cannot find module '@/components/...'"

**Solution**: Check `tsconfig.json` paths configuration:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue 2: "useSearchParams() should be wrapped in Suspense"

**Solution**: Wrap component in Suspense:
```typescript
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageContent />
    </Suspense>
  );
}
```

### Issue 3: "Type 'null' is not assignable to type 'string | undefined'"

**Solution**: Use `undefined` instead of `null`:
```typescript
// ❌ Wrong
phone: phone.trim() || null

// ✅ Correct
phone: phone.trim() || undefined
```

---

## 📚 Next Steps

1. Add more features (product management, etc.)
2. Migrate subscriptions to database
3. Add automated tests
4. Improve error handling
5. Add analytics

---

**Document Version**: 1.0  
**Last Updated**: 2024


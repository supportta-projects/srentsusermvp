# 🏗️ System Architecture

This document provides an overview of the RentOrent MVP system architecture, including technology stack, component structure, and design patterns.

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Application Structure](#application-structure)
4. [Component Architecture](#component-architecture)
5. [Data Layer](#data-layer)
6. [API Architecture](#api-architecture)
7. [Security Architecture](#security-architecture)
8. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Next.js     │  │   React      │  │  TypeScript  │ │
│  │   App Router  │  │  Components  │  │   Types      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└───────────────────────┬──────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        │
┌───────────────────────▼──────────────────────────────────┐
│              Next.js API Routes                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Razorpay   │  │     Email    │  │   Auth       │ │
│  │     API      │  │     API      │  │   Helpers    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└───────┬──────────────────┬──────────────────┬───────────┘
        │                  │                  │
        │                  │                  │
┌───────▼──────────┐  ┌────▼──────┐  ┌──────▼──────────┐
│   Supabase       │  │  Firestore│  │   Razorpay       │
│  (PostgreSQL)    │  │  (NoSQL)  │  │   Payment        │
│                  │  │           │  │   Gateway        │
│  - auth.users    │  │ - products│  │                  │
│  - profiles      │  │ - shops   │  │                  │
│                  │  │ - contacts│ │                  │
└──────────────────┘  └───────────┘  └──────────────────┘
```

### Key Components

1. **Frontend**: Next.js 16 with React 19
2. **Backend**: Next.js API Routes
3. **Database**: Supabase (PostgreSQL) + Firebase Firestore
4. **Authentication**: Supabase Auth
5. **Payments**: Razorpay
6. **Email**: SMTP (Hostinger)

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.3 | React framework with SSR |
| React | 19.2.0 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Styling |
| Framer Motion | ^12.23.24 | Animations |
| Lucide React | ^0.554.0 | Icons |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.0.3 | Serverless API endpoints |
| Supabase JS | ^2.84.0 | Database & Auth client |
| Firebase Admin | ^13.6.0 | Firestore admin operations |
| Razorpay | ^2.9.2 | Payment gateway |
| Nodemailer | ^7.0.10 | Email sending |

### Database

| Service | Type | Purpose |
|---------|------|---------|
| Supabase | PostgreSQL | User authentication & profiles |
| Firebase Firestore | NoSQL | Products, shops, contacts |

---

## Application Structure

### Directory Structure

```
rorusermvp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── email/
│   │   │   └── razorpay/
│   │   ├── login/              # Auth pages
│   │   ├── register/
│   │   ├── profile/            # User profile
│   │   └── vendor/              # Vendor portal
│   ├── components/             # React components
│   │   ├── auth/               # Auth components
│   │   ├── ui/                 # UI components
│   │   └── vendor/              # Vendor components
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx     # Auth state management
│   ├── lib/                    # Utility functions
│   │   ├── supabaseClient.ts   # Supabase client
│   │   ├── firebase.ts         # Firebase client
│   │   ├── supabase-profiles.ts # Profile helpers
│   │   └── subscriptions.ts   # Subscription helpers
│   └── types/                  # TypeScript types
│       └── index.ts            # Type definitions
├── docs/                       # Documentation
├── scripts/                    # Utility scripts
└── public/                     # Static assets
```

### File Organization Principles

1. **Feature-based**: Group related files together
2. **Separation of concerns**: UI, logic, and data separated
3. **Reusability**: Shared components in `components/ui/`
4. **Type safety**: Types defined in `types/` directory

---

## Component Architecture

### Component Hierarchy

```
App (layout.tsx)
├── AuthProvider (AuthContext)
│   └── All Pages
│       ├── LoginPage
│       ├── RegisterPage
│       ├── ProfilePage
│       └── VendorPage
│           ├── VendorNavbar
│           ├── VendorHero
│           ├── PricingSection
│           └── SubscriptionPlans
```

### Component Types

1. **Page Components** (`src/app/*/page.tsx`)
   - Top-level route components
   - Handle data fetching
   - Compose other components

2. **Feature Components** (`src/components/vendor/*`)
   - Domain-specific components
   - Business logic included
   - Examples: `SubscriptionPlans`, `PaymentModal`

3. **UI Components** (`src/components/ui/*`)
   - Reusable, generic components
   - No business logic
   - Examples: `Button`, `Badge`, `Price`

4. **Layout Components** (`src/components/auth/AuthLayout.tsx`)
   - Wrapper components
   - Provide consistent structure

### State Management

**Pattern**: React Context + Local State

```typescript
// Global state (Auth)
AuthContext → useAuth() → All components

// Local state (Component-specific)
useState() → Component internal state
```

**Why this approach**:
- ✅ Simple for MVP
- ✅ No external dependencies
- ✅ Easy to understand
- ⚠️ Can migrate to Zustand/Redux if needed

---

## Data Layer

### Data Flow Pattern

```
Component → Hook/Function → API Client → Database
    ↑                                           │
    └───────────────────────────────────────────┘
              (Data returned)
```

### Data Access Layers

1. **Supabase Client** (`src/lib/supabaseClient.ts`)
   - Single instance
   - Handles authentication
   - Provides database access

2. **Helper Functions** (`src/lib/supabase-profiles.ts`)
   - Wraps Supabase calls
   - Provides type-safe interfaces
   - Handles errors

3. **Firebase Client** (`src/lib/firebase.ts`)
   - Firestore access
   - Product/shop queries

### Example Data Flow

```typescript
// 1. Component calls helper
const profile = await getCurrentUserProfile();

// 2. Helper uses Supabase client
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// 3. Data returned to component
return data;
```

---

## API Architecture

### API Route Structure

```
src/app/api/
├── email/
│   └── send/
│       └── route.ts          # POST /api/email/send
└── razorpay/
    ├── create-order/
    │   └── route.ts          # POST /api/razorpay/create-order
    ├── verify-payment/
    │   └── route.ts          # POST /api/razorpay/verify-payment
    └── webhook/
        └── route.ts          # POST /api/razorpay/webhook
```

### API Design Principles

1. **RESTful**: Use HTTP methods correctly
2. **Type-safe**: TypeScript for request/response
3. **Error handling**: Consistent error responses
4. **Security**: Validate all inputs
5. **Logging**: Log important operations

### API Endpoint Pattern

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request
    const body = await request.json();
    
    // 2. Validate input
    if (!body.requiredField) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      );
    }
    
    // 3. Process request
    const result = await processRequest(body);
    
    // 4. Return response
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    // 5. Handle errors
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Security Architecture

### Authentication Flow

```
User → Login → Supabase Auth → JWT Token → Stored in Browser
                                              │
                                              ▼
                                    All API calls include token
```

### Security Layers

1. **Authentication** (Supabase Auth)
   - Email + PIN authentication
   - JWT tokens
   - Session management

2. **Authorization** (RLS + Firestore Rules)
   - Row Level Security (Supabase)
   - Firestore security rules
   - User can only access own data

3. **API Security**
   - Environment variables for secrets
   - Signature verification (Razorpay)
   - Input validation

4. **Frontend Security**
   - XSS prevention (React)
   - CSRF protection (Next.js)
   - Secure cookie handling

### Security Best Practices

✅ **Implemented**:
- RLS enabled on all tables
- Environment variables for secrets
- Signature verification for webhooks
- Input validation on forms
- TypeScript for type safety

⚠️ **Future Improvements**:
- Rate limiting on API routes
- CORS configuration
- Security headers
- Audit logging

---

## Deployment Architecture

### Current Setup

```
GitHub Repository
       │
       ▼
   Vercel (Hosting)
       │
       ├── Next.js Build
       ├── Environment Variables
       └── Serverless Functions
```

### Deployment Flow

1. **Code Push**: Push to GitHub
2. **CI/CD**: Vercel detects changes
3. **Build**: Next.js builds application
4. **Deploy**: Deployed to Vercel edge network
5. **DNS**: Custom domain (if configured)

### Environment Configuration

**Development**:
- Local `.env.local` file
- Development database
- Test payment keys

**Production**:
- Vercel environment variables
- Production database
- Live payment keys

### Database Deployment

**Supabase**:
- Managed service (no deployment needed)
- Schema changes via SQL Editor

**Firestore**:
- Deploy rules: `firebase deploy --only firestore:rules`
- Deploy indexes: `firebase deploy --only firestore:indexes`

---

## Design Patterns

### 1. Provider Pattern

```typescript
// Context provider wraps app
<AuthProvider>
  <App />
</AuthProvider>

// Components consume context
const { user } = useAuth();
```

### 2. Repository Pattern

```typescript
// Helper functions abstract database access
export async function getCurrentUserProfile() {
  // Implementation details hidden
}
```

### 3. Component Composition

```typescript
// Small, reusable components
<Button variant="primary" size="lg">
  Click Me
</Button>
```

### 4. Error Boundary Pattern

```typescript
// Catch errors gracefully
try {
  await riskyOperation();
} catch (error) {
  // Handle error
  setError(error.message);
}
```

---

## Performance Optimizations

### Implemented

1. **Next.js Optimizations**
   - Static generation where possible
   - Image optimization
   - Code splitting

2. **React Optimizations**
   - `memo()` for expensive components
   - `useCallback()` for event handlers
   - `useMemo()` for computed values

3. **Database Optimizations**
   - Indexes on frequently queried fields
   - Cursor-based pagination
   - Query optimization

### Future Improvements

- [ ] Add caching layer (Redis)
- [ ] Implement CDN for static assets
- [ ] Add database connection pooling
- [ ] Optimize bundle size
- [ ] Add service worker for offline support

---

## Scalability Considerations

### Current Limitations

1. **Database**: Single Supabase instance
2. **Storage**: Firestore document limits
3. **API**: Serverless function timeouts

### Scaling Strategies

1. **Horizontal Scaling**: Add more API routes
2. **Database**: Use read replicas
3. **Caching**: Add Redis cache layer
4. **CDN**: Use Vercel edge network

---

## 🎓 For Beginners

### Understanding the Architecture

Think of the architecture like a **restaurant**:

- **Frontend (Kitchen)**: Where you see the menu and place orders
- **API Routes (Waiters)**: Take your order to the kitchen
- **Database (Kitchen)**: Where data is stored and retrieved
- **External Services (Suppliers)**: Razorpay, Email service

### Key Concepts

1. **Separation of Concerns**: Each part has a specific job
2. **Type Safety**: TypeScript prevents errors
3. **Security**: Multiple layers protect data
4. **Scalability**: Architecture can grow with needs

---

**Document Version**: 1.0  
**Last Updated**: 2024


# 🗄️ Database Schema Documentation

This document provides a comprehensive guide to the database schema used in the RentOrent MVP project. It covers both Supabase (PostgreSQL) and Firebase Firestore databases.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Supabase Database (PostgreSQL)](#supabase-database-postgresql)
3. [Firebase Firestore Collections](#firebase-firestore-collections)
4. [Data Relationships](#data-relationships)
5. [Security Rules & Policies](#security-rules--policies)
6. [Indexes & Performance](#indexes--performance)
7. [Common Queries](#common-queries)

---

## Overview

The RentOrent MVP uses a **hybrid database approach**:
- **Supabase (PostgreSQL)**: User authentication and profiles
- **Firebase Firestore**: Product listings, shops, and marketplace data

### Why Two Databases?

- **Supabase**: Better for relational data (user profiles, relationships)
- **Firestore**: Better for flexible, document-based data (products, shops)
- **Future**: Plan to migrate everything to Supabase for consistency

---

## Supabase Database (PostgreSQL)

### Table: `profiles`

The `profiles` table stores user profile information linked to Supabase authentication.

#### Schema Definition

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  gst_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Field Descriptions

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | UUID | ❌ | Primary key, references `auth.users.id` |
| `full_name` | TEXT | ✅ | User's full name |
| `phone` | TEXT | ✅ | User's phone number (10 digits) |
| `company_name` | TEXT | ✅ | Business/company name (for vendors) |
| `gst_number` | TEXT | ✅ | GST number (15 characters, format: `15ABCDE1234F1Z5`) |
| `address_line1` | TEXT | ✅ | Street address, building, house number |
| `address_line2` | TEXT | ✅ | Apartment, suite, unit, etc. |
| `city` | TEXT | ✅ | City name |
| `state` | TEXT | ✅ | State name |
| `postal_code` | TEXT | ✅ | PIN code (6 digits) |
| `country` | TEXT | ✅ | Country (default: 'India') |
| `created_at` | TIMESTAMPTZ | ❌ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | ❌ | Last update timestamp |

#### Relationships

```
auth.users (1) ──< (1) profiles
```

- **One-to-One**: Each user has exactly one profile
- **Cascade Delete**: Deleting a user automatically deletes their profile

#### Indexes

```sql
-- Index for GST number lookups (only non-null values)
CREATE INDEX idx_profiles_gst_number ON profiles(gst_number) 
WHERE gst_number IS NOT NULL;
```

#### Row Level Security (RLS)

RLS is **enabled** on the `profiles` table. Policies:

1. **Users can view own profile**
   ```sql
   CREATE POLICY "Users can view own profile"
     ON profiles FOR SELECT
     USING (auth.uid() = id);
   ```

2. **Users can update own profile**
   ```sql
   CREATE POLICY "Users can update own profile"
     ON profiles FOR UPDATE
     USING (auth.uid() = id);
   ```

3. **Users can insert own profile**
   ```sql
   CREATE POLICY "Users can insert own profile"
     ON profiles FOR INSERT
     WITH CHECK (auth.uid() = id);
   ```

**What this means**: Users can only read, update, or insert their own profile. They cannot access other users' profiles.

#### Triggers

1. **Automatic Profile Creation**
   ```sql
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```
   - **Purpose**: Automatically creates a profile when a new user signs up
   - **Function**: Extracts `name` and `phone` from `raw_user_meta_data`

2. **Automatic Timestamp Update**
   ```sql
   CREATE TRIGGER update_profiles_updated_at
     BEFORE UPDATE ON profiles
     FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
   ```
   - **Purpose**: Automatically updates `updated_at` timestamp on any update

#### Example Queries

**Get current user's profile**:
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

**Update user profile**:
```typescript
const { data, error } = await supabase
  .from('profiles')
  .upsert({
    id: user.id,
    full_name: 'John Doe',
    phone: '9876543210',
    updated_at: new Date().toISOString(),
  })
  .select()
  .single();
```

---

## Firebase Firestore Collections

### Collection: `products`

Stores rental product listings.

#### Document Structure

```typescript
interface Product {
  id: string;                    // Document ID
  shopId: string;                 // Reference to shop
  title: string;                   // Product name
  description?: string;          // Optional description
  category: string;                // Category (e.g., "Cameras", "Lenses")
  pricePerDay: number;             // Rental price per day (₹)
  city: string;                    // Location city
  condition: 'New' | 'Excellent' | 'Good' | 'Fair';
  imageUrls: string[];             // Array of image URLs
  tags: string[];                  // Search tags
  available: boolean;             // Availability status
  instantAvailability?: boolean;   // Quick availability flag
  featured?: boolean;              // Featured product flag
  views?: number;                  // View count
  contactClicks?: number;          // Contact button clicks
  createdAt: Date;                // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

#### Security Rules

```javascript
match /products/{productId} {
  allow read: if true;              // Anyone can read
  allow write: if false;             // Only admins via Firebase Functions
}
```

### Collection: `shops`

Stores rental shop information.

#### Document Structure

```typescript
interface Shop {
  id: string;                    // Document ID
  name: string;                   // Shop name
  email: string;                  // Contact email
  phone: string;                  // Contact phone
  city: string;                   // Location city
  address?: string;               // Optional address
  imageUrl?: string;              // Shop logo/image
  rating?: number;                // Average rating (0-5)
  totalRatings?: number;          // Number of ratings
  createdAt: Date;
  updatedAt: Date;
}
```

#### Security Rules

```javascript
match /shops/{shopId} {
  allow read: if true;              // Anyone can read
  allow write: if false;             // Only admins via Firebase Functions
}
```

### Collection: `contacts`

Stores customer contact/lead information.

#### Document Structure

```typescript
interface Contact {
  id: string;                    // Document ID
  productId: string;             // Reference to product
  shopId: string;                // Reference to shop
  name?: string;                  // Customer name
  phone: string;                  // Customer phone (required)
  message?: string;               // Optional message
  desiredDates?: {               // Optional rental dates
    start: Date;
    end: Date;
  };
  status: 'pending' | 'contacted' | 'booked' | 'cancelled';
  createdAt: Date;
}
```

#### Security Rules

```javascript
match /contacts/{contactId} {
  allow create: if isAuthenticated() 
               && request.resource.data.keys().hasAll(['productId', 'shopId', 'name', 'phone', 'status'])
               && request.resource.data.status == 'pending';
  allow read: if false;             // Only shop owners/admins via Firebase Functions
  allow update, delete: if false;    // Only admins via Firebase Functions
}
```

### Collection: `customers`

Stores customer account information.

#### Document Structure

```typescript
interface Customer {
  id: string;                    // Document ID (Firebase Auth UID)
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  favoriteShops?: string[];      // Array of shop IDs
  favoriteProducts?: string[];   // Array of product IDs
  createdBy?: 'vendor' | 'self'; // Account origin
}
```

#### Security Rules

```javascript
match /customers/{customerId} {
  allow read: if isAuthenticated() && request.auth.uid == customerId;
  allow create: if isAuthenticated() 
               && request.auth.uid == customerId
               && request.resource.data.keys().hasAll(['email', 'name', 'createdAt', 'updatedAt']);
  allow update: if isAuthenticated() && request.auth.uid == customerId;
  allow delete: if false;            // Prevent deletion (soft delete if needed)
}
```

### Collection: `subscription_plans`

Stores subscription plan definitions (currently mock, future: database).

#### Document Structure

```typescript
interface SubscriptionPlan {
  id: string;                    // 'monthly', 'six-month', 'yearly'
  name: string;
  description: string;
  amount: number;                // Price in ₹
  duration: number;               // Duration in days
  features: string[];            // Array of feature descriptions
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Collection: `vendor_subscriptions`

Stores vendor subscription records.

#### Document Structure

```typescript
interface VendorSubscription {
  id: string;                    // Document ID = vendorId
  vendorId: string;              // Firebase Auth UID
  shopId?: string;               // Optional shop reference
  planId: string;                // 'monthly', 'six-month', 'yearly'
  planName: string;
  amount: number;
  duration: number;               // Days
  status: 'active' | 'expired' | 'cancelled' | 'none';
  startDate: Date;
  endDate: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySubscriptionId?: string;
  autoRenew: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Security Rules

```javascript
match /vendor_subscriptions/{vendorId} {
  allow read: if isAuthenticated() && (
    request.auth.uid == vendorId || 
    isSuperAdmin()
  );
  allow create: if isAuthenticated() && request.auth.uid == vendorId;
  allow update: if isAuthenticated() && (
    request.auth.uid == vendorId || 
    isSuperAdmin()
  );
}
```

### Collection: `subscription_payments`

Stores payment transaction records.

#### Document Structure

```typescript
interface SubscriptionPayment {
  id: string;                    // Auto-generated payment ID
  vendorId: string;              // Firebase Auth UID
  subscriptionId: string;         // Links to vendor_subscriptions
  amount: number;
  planId: string;
  planName: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  completedAt?: Date;
  failedAt?: Date;
}
```

#### Security Rules

```javascript
match /subscription_payments/{paymentId} {
  allow read: if isAuthenticated() && (
    resource.data.vendorId == request.auth.uid || 
    isSuperAdmin()
  );
  allow create: if isAuthenticated();
  allow update: if isAuthenticated() && (
    resource.data.vendorId == request.auth.uid ||
    isSuperAdmin()
  );
}
```

---

## Data Relationships

### Visual Relationship Diagram

```
┌─────────────────┐
│   auth.users    │
│  (Supabase)     │
└────────┬────────┘
         │
         │ 1:1
         │
┌────────▼────────┐
│    profiles     │
│   (Supabase)    │
└─────────────────┘

┌─────────────────┐         ┌──────────────┐
│     shops       │ 1:N    │   products   │
│   (Firestore)   │◄───────│  (Firestore) │
└─────────────────┘         └──────┬───────┘
                                    │
                                    │ N:1
                                    │
                           ┌────────▼────────┐
                           │    contacts     │
                           │   (Firestore)   │
                           └─────────────────┘

┌─────────────────┐         ┌──────────────────────┐
│  customers      │         │ vendor_subscriptions │
│  (Firestore)    │         │     (Firestore)      │
└─────────────────┘         └──────────┬───────────┘
                                        │
                                        │ 1:N
                                        │
                           ┌────────────▼────────────┐
                           │  subscription_payments  │
                           │      (Firestore)        │
                           └─────────────────────────┘
```

### Key Relationships

1. **User → Profile** (Supabase)
   - One user = One profile
   - Linked via UUID foreign key

2. **Shop → Products** (Firestore)
   - One shop = Many products
   - Linked via `shopId` field

3. **Product → Contacts** (Firestore)
   - One product = Many contacts (leads)
   - Linked via `productId` field

4. **Vendor → Subscription** (Firestore)
   - One vendor = One subscription
   - Document ID = vendorId

5. **Subscription → Payments** (Firestore)
   - One subscription = Many payments
   - Linked via `subscriptionId` field

---

## Security Rules & Policies

### Supabase RLS (Row Level Security)

**Principle**: Users can only access their own data.

- ✅ Users can read their own profile
- ✅ Users can update their own profile
- ✅ Users can create their own profile
- ❌ Users cannot access other users' profiles

### Firestore Security Rules

**Principle**: Role-based access with authentication checks.

#### Helper Functions

```javascript
// Check if user is authenticated
function isAuthenticated() {
  return request.auth != null;
}

// Get user role (from rental_staff collection)
function getUserRole() {
  let staffDocPath = /databases/$(database)/documents/rental_staff/$(request.auth.uid);
  return exists(staffDocPath) ? get(staffDocPath).data.role : null;
}

// Check if user is super admin
function isSuperAdmin() {
  return isAuthenticated() && getUserRole() == 'superAdmin';
}
```

#### Access Patterns

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| `products` | ✅ Public | ❌ Admin only | ❌ Admin only | ❌ Admin only |
| `shops` | ✅ Public | ❌ Admin only | ❌ Admin only | ❌ Admin only |
| `contacts` | ❌ Admin only | ✅ Authenticated | ❌ Admin only | ❌ Admin only |
| `customers` | ✅ Own data | ✅ Own data | ✅ Own data | ❌ Disabled |
| `vendor_subscriptions` | ✅ Own data or Admin | ✅ Own data | ✅ Own data or Admin | ❌ Disabled |
| `subscription_payments` | ✅ Own data or Admin | ✅ Authenticated | ✅ Own data or Admin | ❌ Disabled |

---

## Indexes & Performance

### Supabase Indexes

```sql
-- GST number lookup (for vendor verification)
CREATE INDEX idx_profiles_gst_number ON profiles(gst_number) 
WHERE gst_number IS NOT NULL;
```

### Firestore Indexes

All indexes are defined in `firestore.indexes.json`. Common patterns:

1. **Shop-based queries**:
   ```json
   {
     "fieldPath": "shopId",
     "order": "ASCENDING"
   },
   {
     "fieldPath": "createdAt",
     "order": "DESCENDING"
   }
   ```

2. **Collections with indexes**:
   - `rental_brands`
   - `rental_categories`
   - `rental_customers`
   - `rental_orders`
   - `rental_products`
   - `rental_staff`

---

## Common Queries

### Supabase Queries

**Get user profile**:
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

**Update profile**:
```typescript
const { data, error } = await supabase
  .from('profiles')
  .upsert({
    id: userId,
    full_name: 'John Doe',
    phone: '9876543210',
    updated_at: new Date().toISOString(),
  })
  .select()
  .single();
```

### Firestore Queries

**Get products by shop**:
```typescript
const productsRef = collection(db, 'products');
const q = query(
  productsRef,
  where('shopId', '==', shopId),
  where('available', '==', true),
  orderBy('createdAt', 'desc'),
  limit(20)
);
const snapshot = await getDocs(q);
```

**Get vendor subscription**:
```typescript
const subscriptionRef = doc(db, 'vendor_subscriptions', vendorId);
const subscriptionSnap = await getDoc(subscriptionRef);
```

**Create contact (lead)**:
```typescript
const contactsRef = collection(db, 'contacts');
await addDoc(contactsRef, {
  productId: productId,
  shopId: shopId,
  name: name,
  phone: phone,
  message: message,
  status: 'pending',
  createdAt: new Date(),
});
```

---

## 🎓 For Beginners

### Understanding the Schema

1. **Supabase (PostgreSQL)**: Think of it like Excel with strict columns
   - Fixed structure
   - Relationships between tables
   - Good for user data

2. **Firestore**: Think of it like JSON files
   - Flexible structure
   - Documents (like rows)
   - Good for product data

### Common Mistakes to Avoid

1. ❌ **Don't store sensitive data in Firestore** (use Supabase)
2. ❌ **Don't disable RLS** (always enable security)
3. ❌ **Don't query without indexes** (will be slow)
4. ✅ **Always validate data** before saving
5. ✅ **Use TypeScript types** to match schema

### Migration Tips

If you need to add a new field:

1. **Supabase**: Use `ALTER TABLE`:
   ```sql
   ALTER TABLE profiles 
   ADD COLUMN new_field TEXT;
   ```

2. **Firestore**: Just add the field (no migration needed):
   ```typescript
   // Old documents won't have it, handle in code
   const value = doc.data().newField || 'default';
   ```

---

## 📝 Schema Changes Log

### Version 1.0 (Current)
- ✅ Initial `profiles` table with basic fields
- ✅ Added business fields (company_name, gst_number, address)
- ✅ RLS policies implemented
- ✅ Triggers for auto-profile creation and timestamps

### Future Changes Planned
- [ ] Add `subscription_plans` table in Supabase
- [ ] Add `vendor_subscriptions` table in Supabase
- [ ] Migrate Firestore data to Supabase
- [ ] Add audit logging tables

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: Development Team


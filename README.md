# Rentorent - Vendor Product Website

A vendor-focused subscription platform for rental businesses. Vendors can subscribe to plans and access a complete rental management dashboard to manage their products, orders, customers, and staff.

## 📚 Documentation

**Comprehensive documentation is available in the [`docs/`](./docs/) folder.**

- **[Documentation Index](./docs/README.md)** - Start here for complete documentation
- **[Project Journey](./docs/01-PROJECT-JOURNEY.md)** - Complete development journey with lessons learned
- **[Database Schema](./docs/02-DATABASE-SCHEMA.md)** - Detailed database documentation
- **[Data Flow](./docs/03-DATA-FLOW.md)** - How data flows through the system
- **[Step-by-Step Guide](./docs/04-STEP-BY-STEP-GUIDE.md)** - Implementation guide for beginners
- **[Architecture](./docs/05-ARCHITECTURE.md)** - System architecture overview
- **[API Endpoints](./docs/06-API-ENDPOINTS.md)** - API reference documentation

## 🎯 Project Overview

Rentorent is a vendor subscription platform that helps rental businesses manage their operations. Vendors can subscribe to monthly, 6-month, or yearly plans to access a comprehensive dashboard for managing products, orders, customers, and staff.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (React) with SSR + static rendering
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL) for authentication and user profiles
- **Payments**: Razorpay integration for subscription payments
- **Hosting**: Vercel
- **Email**: SMTP for notifications

## 📋 Features

### Features
- ✅ Vendor landing page with features, pricing, and testimonials
- ✅ Subscription plans (Monthly, 6-Month, Yearly) with Razorpay integration
- ✅ User authentication with Supabase
- ✅ Profile management for vendors
- ✅ Subscription management dashboard
- ✅ Mobile-first responsive design
- ✅ Secure payment processing
- ✅ Email notifications

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase project created
- Razorpay account (for payments)
- SMTP email configuration

### Installation

1. **Clone and install dependencies:**
   ```bash
   # Install pnpm if you haven't already
   npm install -g pnpm
   
   # Install project dependencies
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   
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
   
   # Site URL
   NEXT_PUBLIC_SITE_URL=https://rentorent.net
   ```

3. **Set up Supabase:**
   - Create a Supabase project at https://supabase.com
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Get your Project URL and anon key from Settings → API

5. **Run the development server:**
   ```bash
   pnpm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
rorusermvp/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx          # Root layout with GA
│   │   ├── page.tsx            # Homepage
│   │   └── products/
│   │       └── [id]/
│   │           └── page.tsx    # Product detail page
│   ├── components/             # React components
│   │   ├── Header.tsx          # Header with search & city selector
│   │   ├── ProductCard.tsx     # Product card component
│   │   ├── ProductCardSkeleton.tsx  # Loading skeleton
│   │   ├── ContactModal.tsx    # Contact form modal
│   │   └── Filters.tsx         # Filter & sort component
│   ├── lib/                    # Utilities & Firebase
│   │   ├── firebase.ts         # Firebase initialization
│   │   ├── firestore.ts        # Firestore helpers
│   │   └── seed.ts             # Database seed data
│   └── types/                  # TypeScript types
│       └── index.ts           # Type definitions
├── public/                     # Static assets
│   └── manifest.json          # PWA manifest
├── scripts/                   # Utility scripts
│   └── seed.ts               # Seed script runner
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore indexes
└── firebase.json             # Firebase config
```

## 🗄️ Data Model

### Collections

**shops**
- `id`: string
- `name`: string
- `email`: string
- `phone`: string
- `city`: string
- `address`: string (optional)
- `rating`: number (optional)
- `totalRatings`: number (optional)

**products**
- `id`: string
- `shopId`: string
- `title`: string
- `description`: string (optional)
- `category`: 'Cameras' | 'Lenses' | 'Lighting' | 'Accessories'
- `pricePerDay`: number
- `city`: string
- `condition`: 'New' | 'Excellent' | 'Good' | 'Fair'
- `imageUrls`: string[]
- `tags`: string[]
- `available`: boolean
- `instantAvailability`: boolean (optional)
- `featured`: boolean (optional)

**contacts**
- `id`: string
- `productId`: string
- `shopId`: string
- `name`: string
- `phone`: string
- `message`: string (optional)
- `desiredDates`: { start: Date, end: Date } (optional)
- `status`: 'pending' | 'contacted' | 'booked' | 'cancelled'
- `createdAt`: Date

## 🎨 UI/UX Features

- **Mobile-first design**: Responsive grid (1 col mobile, 2 tablet, 3-4 desktop)
- **Product cards**: Large images (4:3 aspect), badges, CTAs
- **Search**: Global search with debounced queries
- **Filters**: City, category, price range
- **Sorting**: Relevance, price (low/high), newest
- **Skeleton loaders**: For improved perceived performance
- **Contact modal**: Lead capture form with validation

## 📊 Analytics Events

The app tracks the following events (if GA4 is configured):

- `product_view`: When a product detail page is viewed
- `contact_click`: When the Contact button is clicked
- `contact_submit`: When a contact form is submitted

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Firebase Hosting

```bash
pnpm run build
firebase deploy --only hosting
```

## 🔒 Security

- Firestore security rules prevent unauthorized writes
- Contact form validates phone numbers
- All user inputs are sanitized

## 📈 Performance Optimizations

- Image lazy loading
- Skeleton loaders for perceived performance
- Cursor-based pagination (no offset)
- Optimized Firestore queries with indexes
- Static generation where possible

## 🧪 Testing Checklist

- [ ] Mobile responsiveness (iPhone/Android browsers)
- [ ] Desktop responsiveness
- [ ] Field validation on contact form
- [ ] Image lazy-load and low CLS
- [ ] Firestore security rule tests
- [ ] Search and filter functionality
- [ ] Contact form submission

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ Basic listing, search, filters
- ✅ Contact flow
- ✅ Product detail pages

### Phase 2: Shop Onboarding
- Shop dashboard
- Product CRUD
- Lead management

### Phase 3: Payments & Booking
- Payment integration
- Booking confirmation flow
- Calendar availability

### Phase 4: Advanced Features
- Geolocation radius search
- Dynamic availability
- Advanced search (Algolia integration)

## 📝 Notes

- Images currently use placeholder URLs (Unsplash). Replace with actual product images in production.
- Firebase Functions for email notifications need to be set up separately.
- For production, replace placeholder images with actual product photos stored in Firebase Storage.

## 🤝 Contributing

This is an MVP project. Follow the "Act without attachment" principle - build fast, iterate, and deliver value.

## 📄 License

Private project - All rights reserved.

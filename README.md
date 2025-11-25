# Rentorent - Camera Equipment Rental Marketplace MVP

A mobile-first, highly responsive rental marketplace for camera equipment and accessories that connects local rental shops to end users.

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

Rentorent enables users to browse visually-rich product cards, filter by category, city, price, and availability, and contact shops directly via a "Contact" CTA on every product card.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (React) with SSR + static rendering
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Firestore, Storage, Functions)
- **Hosting**: Vercel or Firebase Hosting
- **Analytics**: Google Analytics 4 (GA4)

## 📋 Features

### MVP Features
- ✅ Responsive homepage with search + city selector
- ✅ Product listing with cards using dummy camera/accessory data
- ✅ Working Contact modal that writes leads to Firestore
- ✅ Product detail page with image carousel and shop info
- ✅ Filters for city, category, price
- ✅ Basic analytics events for product view and contact click
- ✅ Mobile-first responsive design
- ✅ PWA support with manifest
- ✅ Skeleton loaders for improved perceived performance

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Firebase project created
- Firebase CLI installed (optional, for deployment)

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
   
   Edit `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Optional
   NEXT_PUBLIC_SITE_URL=https://rentorent.net  # Required for SEO (canonical URLs, sitemap, Open Graph)
   ```

3. **Set up Firestore:**
   - Create a Firestore database in Firebase Console
   - Deploy security rules:
     ```bash
     firebase deploy --only firestore:rules
     ```
   - Deploy indexes:
     ```bash
     firebase deploy --only firestore:indexes
     ```

4. **Seed the database:**
   ```bash
   # Run seed script (tsx is already in devDependencies)
   pnpm run seed
   ```

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

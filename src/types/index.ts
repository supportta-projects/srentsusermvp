export interface Shop {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  imageUrl?: string;
  rating?: number;
  totalRatings?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  shopId: string;
  title: string;
  description?: string;
  category: string; // Generic category - can be any string
  pricePerDay: number;
  city: string;
  condition: 'New' | 'Excellent' | 'Good' | 'Fair';
  imageUrls: string[];
  tags: string[];
  available: boolean;
  instantAvailability?: boolean;
  featured?: boolean;
  views?: number;
  contactClicks?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  productId: string;
  shopId: string;
  name?: string;
  phone: string;
  message?: string;
  desiredDates?: {
    start: Date;
    end: Date;
  };
  status: 'pending' | 'contacted' | 'booked' | 'cancelled';
  createdAt: Date;
}

export type FilterOptions = {
  shopId?: string; // Filter by shop ID for performance
  city?: string;
  category?: string; // Generic category
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  minRating?: number;
  brand?: string;
};

export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest';

export interface Customer {
  id: string; // Firebase Auth UID
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  favoriteShops?: string[];
  favoriteProducts?: string[];
  createdBy?: 'vendor' | 'self'; // Track account origin
}

// Subscription Types
export interface SubscriptionPlan {
  id: string; // 'monthly', 'quarterly', 'yearly'
  name: string;
  description: string;
  amount: number; // in rupees
  duration: number; // in days
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorSubscription {
  id: string; // Document ID = vendorId (Firebase Auth UID)
  vendorId: string; // Firebase Auth UID (same as document ID)
  shopId?: string; // Optional: link to rental_shops if needed
  
  // Subscription Details
  planId: string; // 'monthly', 'quarterly', 'yearly'
  planName: string;
  amount: number;
  duration: number; // in days
  
  // Status
  status: 'active' | 'expired' | 'cancelled' | 'none';
  
  // Dates
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Razorpay
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySubscriptionId?: string;
  
  // Auto-renewal
  autoRenew: boolean;
  
  // Notes
  notes?: string;
}

export interface SubscriptionPayment {
  id: string; // Auto-generated
  vendorId: string; // Firebase Auth UID
  subscriptionId: string; // Links to vendor_subscriptions document ID
  
  // Payment Details
  amount: number;
  planId: string;
  planName: string;
  
  // Razorpay
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Timestamps
  createdAt: Date;
  completedAt?: Date;
  failedAt?: Date;
}
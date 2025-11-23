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
// Mock implementation for UI development - Replace with Firebase when ready
import { Product, Contact, FilterOptions, SortOption } from '@/types';
import { mockProducts, mockShops } from './mockData';

// Mock QueryDocumentSnapshot type
export type QueryDocumentSnapshot = any;

export async function getProduct(id: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const product = mockProducts.find(p => p.id === id);
  return product || null;
}

export async function getProducts(
  filters: FilterOptions = {},
  sortBy: SortOption = 'relevance',
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ products: Product[]; lastDoc: QueryDocumentSnapshot | null }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredProducts = [...mockProducts];
  
  // Apply filters
  if (filters.city) {
    filteredProducts = filteredProducts.filter(p => p.city === filters.city);
  }
  
  if (filters.category) {
    filteredProducts = filteredProducts.filter(p => p.category === filters.category);
  }
  
  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.pricePerDay >= filters.minPrice!);
  }
  
  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.pricePerDay <= filters.maxPrice!);
  }
  
  // Apply sorting
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else {
    // Default: relevance (by createdAt desc)
    filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Client-side text search filtering
  if (filters.searchQuery) {
    const queryLower = filters.searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      return (
        product.title.toLowerCase().includes(queryLower) ||
        product.tags.some((tag) => tag.toLowerCase().includes(queryLower)) ||
        product.description?.toLowerCase().includes(queryLower)
      );
    });
  }
  
  // Brand filtering
  if (filters.brand) {
    filteredProducts = filteredProducts.filter((product) => {
      return product.title.includes(filters.brand!);
    });
  }
  
  // Pagination simulation
  const startIndex = lastDoc ? parseInt(lastDoc) || 0 : 0;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
  const hasMore = startIndex + pageSize < filteredProducts.length;
  
  return {
    products: paginatedProducts,
    lastDoc: hasMore ? (startIndex + pageSize).toString() : null,
  };
}

export async function createContact(contactData: Omit<Contact, 'id' | 'createdAt'>): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock: Just log and return a mock ID
  console.log('Contact created (mock):', contactData);
  return `contact_${Date.now()}`;
}

export async function getShop(id: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const shop = mockShops.find(s => s.id === id);
  return shop || null;
}

export async function getShops(city?: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let filteredShops = [...mockShops];
  
  if (city) {
    filteredShops = filteredShops.filter(s => s.city === city);
  }
  
  return filteredShops;
}

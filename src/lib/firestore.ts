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
  // Simulate network delay - reduced for better performance
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let filteredProducts = [...mockProducts];
  
  // Apply filters - shopId first for performance
  if (filters.shopId) {
    filteredProducts = filteredProducts.filter(p => p.shopId === filters.shopId);
  }
  
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
  
  // Send email notification via API route (server-side)
  try {
    // Get product and shop details for email
    const product = mockProducts.find(p => p.id === contactData.productId);
    const shop = mockShops.find(s => s.id === contactData.shopId);
    
    // Send email notification via API route
    const emailData = {
      name: contactData.name,
      phone: contactData.phone,
      message: contactData.message,
      productTitle: product?.title || 'Unknown Product',
      productId: contactData.productId,
      shopId: contactData.shopId,
      shopName: shop?.name,
      productPrice: product?.pricePerDay,
      productCity: product?.city,
    };
    
    // Call the email API route
    try {
      console.log('📧 Calling email API route with data:', emailData);
      const apiUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/api/email/send`
        : 'http://localhost:3000/api/email/send';
      
      console.log('📧 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          data: emailData,
        }),
      });
      
      console.log('📧 API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText };
        }
        console.error('❌ Failed to send contact email notification:', error);
        console.error('Response status:', response.status);
        console.error('Response text:', errorText);
      } else {
        const result = await response.json();
        console.log('✅ Contact email notification sent successfully:', result);
      }
    } catch (fetchError: any) {
      console.error('❌ Error calling email API route:', fetchError);
      console.error('Error details:', {
        message: fetchError.message,
        name: fetchError.name,
        stack: fetchError.stack,
      });
      // Re-throw to see the error in the UI
      throw new Error(`Failed to send email notification: ${fetchError.message}`);
    }
  } catch (error) {
    console.error('Error sending contact email notification:', error);
    // Don't throw - email failure shouldn't break contact creation
  }
  
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

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import { Shop, Product, FilterOptions, SortOption } from '@/types';

interface ShopClientProps {
  shop: Shop;
  products: Product[];
}

export default function ShopClient({ shop, products: initialProducts }: ShopClientProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories from products
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>();
    initialProducts.forEach(p => {
      if (p.category) categorySet.add(p.category);
    });
    return Array.from(categorySet).sort();
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...initialProducts];

    // Apply search
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      products = products.filter((product) => {
        return (
          product.title.toLowerCase().includes(queryLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(queryLower)) ||
          product.description?.toLowerCase().includes(queryLower)
        );
      });
    }

    // Apply category filter
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }

    // Apply brand filter
    if (filters.brand) {
      const brandLower = filters.brand.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(brandLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(brandLower))
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      products = products.filter(p => p.pricePerDay >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter(p => p.pricePerDay <= filters.maxPrice!);
    }

    // Apply sorting
    if (sortBy === 'price-low') {
      products.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === 'newest') {
      products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return products;
  }, [initialProducts, filters, sortBy, searchQuery]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm font-medium transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Shops
        </Link>

        {/* Shop Header */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {shop.name}
              </h1>
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{shop.city}</span>
                </div>
                {shop.rating && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="font-semibold text-white">{shop.rating.toFixed(1)}</span>
                    {shop.totalRatings && (
                      <span className="text-gray-500">({shop.totalRatings} reviews)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {shop.address && (
            <div className="pt-6 border-t border-white/10">
              <p className="text-gray-400 mb-4">{shop.address}</p>
              <div className="flex flex-wrap gap-4">
                <a href={`tel:${shop.phone}`} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                  📞 {shop.phone}
                </a>
                <a href={`mailto:${shop.email}`} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                  ✉️ {shop.email}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <ShopFilters
          filters={filters}
          sortBy={sortBy}
          searchQuery={searchQuery}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
          onReset={handleResetFilters}
          categories={availableCategories}
        />

        {/* Products */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              {searchQuery && ` matching "${searchQuery}"`}
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-[#1a1a1a] rounded-2xl border border-white/10">
              <p className="text-gray-500 mb-4">No products found</p>
              {(filters.category || filters.brand || filters.minPrice || filters.maxPrice || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-white text-black hover:bg-gray-100 rounded-xl transition-colors duration-200 text-sm font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Spacing for Mobile FAB */}
      <div className="h-24 md:hidden" />
    </div>
  );
}


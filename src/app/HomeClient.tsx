'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import Filters from '@/components/Filters';
import ProductCard from '@/components/ProductCard';
import ShopCard from '@/components/ShopCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { getProducts, QueryDocumentSnapshot, getShops } from '@/lib/firestore';
import { Product, FilterOptions, SortOption } from '@/types';

// Generic categories that cover all rental types
const CATEGORIES = [
  { id: 'Electronics', name: 'Electronics', icon: '📱' },
  { id: 'Cameras', name: 'Cameras', icon: '📷' },
  { id: 'Lenses', name: 'Lenses', icon: '🔍' },
  { id: 'Lighting', name: 'Lighting', icon: '💡' },
  { id: 'Accessories', name: 'Accessories', icon: '🎬' },
  { id: 'Power Tools', name: 'Power Tools', icon: '🔧' },
  { id: 'Jewellery', name: 'Jewellery', icon: '💎' },
  { id: 'Dresses', name: 'Dresses', icon: '👗' },
  { id: 'Vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'Furniture', name: 'Furniture', icon: '🪑' },
  { id: 'Equipment', name: 'Equipment', icon: '⚙️' },
];

export default function HomeClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [viewMode, setViewMode] = useState<'products' | 'shops'>('products');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories from products
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach(p => {
      if (p.category) categorySet.add(p.category);
    });
    return Array.from(categorySet).sort();
  }, [products]);

  const loadProducts = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true);
      setProducts([]);
      setLastDoc(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const currentFilters = { ...filters };
      if (selectedCity) {
        currentFilters.city = selectedCity;
      }
      if (searchQuery) {
        currentFilters.searchQuery = searchQuery;
      }

      const result = await getProducts(currentFilters, sortBy, 20, reset ? undefined : lastDoc || undefined);
      
      if (reset) {
        setProducts(result.products);
      } else {
        setProducts((prev) => [...prev, ...result.products]);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.lastDoc !== null);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, sortBy, selectedCity, searchQuery, lastDoc]);

  useEffect(() => {
    loadProducts(true);
    loadShops();
  }, [filters, sortBy, selectedCity, searchQuery]);

  const loadShops = async () => {
    try {
      const shopsData = await getShops(selectedCity);
      setShops(shopsData);
    } catch (error) {
      console.error('Error loading shops:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSelectedCity('');
    setSearchQuery('');
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadProducts(false);
    }
  };

  const handleContactClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'contact_click', {
        event_category: 'engagement',
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    if (filters.category === category) {
      setFilters((prev) => ({ ...prev, category: undefined }));
    } else {
      setFilters((prev) => ({ ...prev, category }));
    }
  };

  const productsByShop = products.reduce((acc, product) => {
    if (!acc[product.shopId]) {
      acc[product.shopId] = [];
    }
    acc[product.shopId].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onSearch={handleSearch}
        onCityChange={handleCityChange}
        selectedCity={selectedCity || 'All Cities'}
      />
      
      <Filters
        filters={filters}
        sortBy={sortBy}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onReset={handleResetFilters}
        categories={availableCategories}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 tracking-tight">
              <span className="text-white">Rent Anything, </span>
              <span className="gradient-red-text">Anywhere</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
              Discover rental shops near you. From cameras to dresses, power tools to jewellery.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6 md:mb-8 px-4 md:px-0">
            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-xl rounded-xl p-0.5 border border-white/10">
              <button
                onClick={() => setViewMode('products')}
                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'products'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setViewMode('shops')}
                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'shops'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Shops
              </button>
            </div>
            <div className="text-xs md:text-sm text-gray-500 font-medium">
              {viewMode === 'products' 
                ? `${products.length}${selectedCity ? ` in ${selectedCity}` : ''}`
                : `${shops.length}${selectedCity ? ` in ${selectedCity}` : ''}`
              }
            </div>
          </div>

          {/* Category Pills - Horizontal Scroll on Mobile */}
          <div className="mb-6 md:mb-10">
            <div className="flex gap-2 overflow-x-auto pb-2 px-4 md:px-0 md:flex-wrap md:justify-center scrollbar-hide">
              <button
                onClick={() => handleCategoryClick('')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
                  !filters.category
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/20'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
                    filters.category === category.id
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : viewMode === 'shops' ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-12">
          {shops.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No shops found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {shops.map((shop, index) => (
                <div key={shop.id} className="animate-fade-in">
                  <ShopCard shop={shop} products={productsByShop[shop.id] || []} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-12">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm md:text-lg mb-4">No products found</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-white text-black hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Mobile-first: Single column on mobile, then responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4 md:gap-6 lg:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onContactClick={handleContactClick}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 md:mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 md:px-8 py-2.5 md:py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-medium disabled:opacity-50 text-sm md:text-base"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="h-20 md:hidden" />
    </div>
  );
}


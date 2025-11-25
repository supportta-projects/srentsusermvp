'use client';

import { useState } from 'react';
import { FilterOptions, SortOption } from '@/types';

interface ShopFiltersProps {
  filters: FilterOptions;
  sortBy: SortOption;
  searchQuery: string;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (query: string) => void;
  onReset: () => void;
  categories?: string[];
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function ShopFilters({ filters, sortBy, searchQuery, onFiltersChange, onSortChange, onSearchChange, onReset, categories = [] }: ShopFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = 
    filters.category || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.brand ||
    searchQuery;

  return (
    <>
      {/* Mobile: Floating Filter Button */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="gradient-red text-white px-5 py-4 rounded-full shadow-lg shadow-[#DC2626]/30 hover:shadow-[#DC2626]/50 transition-all duration-300 flex items-center gap-2 font-semibold hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-white text-[#DC2626] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile: Filter Modal */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-md">
          <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl shadow-2xl border-t border-white/10 max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 px-5 py-4 flex items-center justify-between backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-white">Search & Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">Search Products</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by name, brand..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-base text-white placeholder-gray-500 backdrop-blur-xl min-h-[48px]"
                />
              </div>

              {/* Category */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-base text-white backdrop-blur-xl min-h-[48px]"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Brand */}
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">Brand (Optional)</label>
                <input
                  type="text"
                  value={filters.brand || ''}
                  onChange={(e) => onFiltersChange({ ...filters, brand: e.target.value || undefined })}
                  placeholder="Enter brand name..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-base text-white placeholder-gray-500 backdrop-blur-xl min-h-[48px]"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">Price Range (₹/day)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Min"
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-base text-white placeholder-gray-500 backdrop-blur-xl min-h-[48px]"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Max"
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-base text-white placeholder-gray-500 backdrop-blur-xl min-h-[48px]"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-base text-white backdrop-blur-xl min-h-[48px]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      onReset();
                      setIsOpen(false);
                    }}
                    className="flex-1 px-4 py-3 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 font-medium transition-all"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 gradient-red text-white rounded-lg hover:shadow-lg hover:shadow-[#DC2626]/30 font-semibold transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Filter Bar */}
      <div className="hidden md:block border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-base text-white placeholder-gray-500 backdrop-blur-xl min-h-[44px]"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <select
                value={filters.category || ''}
                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-base text-white backdrop-blur-xl min-h-[44px]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {/* Brand */}
            <input
              type="text"
              value={filters.brand || ''}
              onChange={(e) => onFiltersChange({ ...filters, brand: e.target.value || undefined })}
              placeholder="Brand..."
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-sm text-white placeholder-gray-500 backdrop-blur-xl w-32"
            />

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Min"
                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-sm text-white placeholder-gray-500 backdrop-blur-xl"
              />
              <span className="text-gray-600">-</span>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Max"
                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-sm text-white placeholder-gray-500 backdrop-blur-xl"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-sm text-white backdrop-blur-xl"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="px-4 py-2 text-sm text-[#DC2626] hover:text-[#EF4444] font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

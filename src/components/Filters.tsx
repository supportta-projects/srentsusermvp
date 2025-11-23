'use client';

import { useState } from 'react';
import { FilterOptions, SortOption } from '@/types';

interface FiltersProps {
  filters: FilterOptions;
  sortBy: SortOption;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  categories?: string[];
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function Filters({ filters, sortBy, onFiltersChange, onSortChange, onReset, categories = [] }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = 
    filters.category || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.brand;

  return (
    <>
      {/* Mobile: Floating Filter Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-5 py-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center gap-2 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {hasActiveFilters && (
            <span className="bg-white text-[#DC2626] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile: Filter Modal */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl shadow-2xl border-t border-white/10 max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 text-base text-white min-h-[48px]"
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

              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Price Range (₹/day)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Min"
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 text-base text-white placeholder-gray-500 min-h-[48px]"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Max"
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 text-base text-white placeholder-gray-500 min-h-[48px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 text-base text-white min-h-[48px]"
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
                    className="flex-1 px-4 py-3 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 font-medium transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-semibold transition-colors"
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
            {/* Category Filter */}
            {categories.length > 0 && (
              <>
                <span className="text-base font-medium text-gray-400">Category:</span>
                <select
                  value={filters.category || ''}
                  onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-base text-white backdrop-blur-xl transition-all min-h-[44px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </>
            )}

            <span className="text-base font-medium text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-base text-white backdrop-blur-xl transition-all min-h-[44px]"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-base font-medium text-gray-400">Price:</span>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Min"
                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-base text-white placeholder-gray-500 backdrop-blur-xl min-h-[44px]"
              />
              <span className="text-gray-600">-</span>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Max"
                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-base text-white placeholder-gray-500 backdrop-blur-xl min-h-[44px]"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="px-4 py-2 text-base text-gray-400 hover:text-white font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

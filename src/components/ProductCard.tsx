'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useState, useEffect } from 'react';
import ContactModal from './ContactModal';
import { getShop } from '@/lib/firestore';

interface ProductCardProps {
  product: Product;
  onContactClick?: () => void;
}

export default function ProductCard({ product, onContactClick }: ProductCardProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    getShop(product.shopId).then(setShop);
  }, [product.shopId]);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
    onContactClick?.();
  };

  const getBrand = (title: string): string => {
    const brands = ['Canon', 'Sony', 'Nikon', 'Fujifilm', 'Panasonic', 'Olympus', 'Pentax', 'Leica', 'Godox', 'Profoto', 'Manfrotto', 'DJI'];
    for (const brand of brands) {
      if (title.includes(brand)) return brand;
    }
    return '';
  };

  const brand = getBrand(product.title);

  return (
    <>
      <div className="group bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col h-full shadow-lg">
        {/* Image Container - Reduced Height */}
        <Link href={`/products/${product.id}`} className="relative aspect-[16/9] bg-[#0a0a0a] overflow-hidden">
          {!imageError && product.imageUrls[0] ? (
            <Image
              src={product.imageUrls[0]}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
              <span className="text-3xl opacity-20">📷</span>
            </div>
          )}
          
          {/* Badges - Minimal */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            {product.featured && (
              <span className="px-2 py-0.5 bg-yellow-500 text-yellow-900 text-[9px] font-bold rounded">
                Top
              </span>
            )}
            {product.instantAvailability && (
              <span className="px-2 py-0.5 bg-[#10b981] text-white text-[9px] font-bold rounded">
                ✓
              </span>
            )}
          </div>
        </Link>

        {/* Content - Better Visibility */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Brand - Minimal */}
          {brand && (
            <div className="mb-1">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                {brand}
              </span>
            </div>
          )}

          {/* Title - Large and Prominent */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-white mb-2 line-clamp-2 text-sm leading-snug min-h-[2.5rem] group-hover:text-gray-200 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Category - Minimal */}
          <div className="mb-2">
            <span className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded font-medium">
              {product.category}
            </span>
          </div>

          {/* Price Section - Large and Highlighted with Gradient */}
          <div className="mb-2.5 mt-auto bg-gradient-to-r from-[#10b981]/15 to-transparent rounded-lg p-2 border border-[#10b981]/30">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#10b981]">
                ₹{product.pricePerDay.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 font-medium">/day</span>
            </div>
          </div>

          {/* Location - Better Visibility */}
          <div className="flex items-center justify-between mb-2.5 text-[10px] text-gray-400">
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate font-medium">{product.city}</span>
            </div>
            {shop && (
              <span className="text-gray-500 truncate max-w-[70px] text-[9px] font-medium">
                {shop.name}
              </span>
            )}
          </div>

          {/* CTA Button - Better Visibility */}
          <button
            onClick={handleContactClick}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 text-xs active:scale-[0.98]"
          >
            Contact Shop
          </button>
        </div>
      </div>

      {isContactModalOpen && (
        <ContactModal
          product={product}
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </>
  );
}

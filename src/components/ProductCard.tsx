'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import ContactModal from './ContactModal';
import { getShop } from '@/lib/firestore';
import Price from './ui/Price';
import Badge from './ui/Badge';
import Button from './ui/Button';
import TrustSignals from './ui/TrustSignals';
import ScarcityBadge from './ui/ScarcityBadge';

interface ProductCardProps {
  product: Product;
  onContactClick?: () => void;
}

function ProductCard({ product, onContactClick }: ProductCardProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    getShop(product.shopId).then((shopData) => {
      if (!cancelled) {
        setShop(shopData);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [product.shopId]);

  const handleContactClick = useCallback(() => {
    setIsContactModalOpen(true);
    onContactClick?.();
  }, [onContactClick]);

  const brand = useMemo(() => {
    const brands = ['Canon', 'Sony', 'Nikon', 'Fujifilm', 'Panasonic', 'Olympus', 'Pentax', 'Leica', 'Godox', 'Profoto', 'Manfrotto', 'DJI'];
    for (const brand of brands) {
      if (product.title.includes(brand)) return brand;
    }
    return '';
  }, [product.title]);

  return (
    <>
      <div className="group bg-[#0F0F0F] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col h-full shadow-lg">
        {/* Image Container - 60% of card height */}
        <Link href={`/products/${product.id}`} className="relative aspect-[4/3] bg-[#000000] overflow-hidden">
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
            <div className="w-full h-full flex items-center justify-center bg-[#000000]">
              <span className="text-3xl opacity-20">📷</span>
            </div>
          )}
          
          {/* Badges - Top Right */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.featured && (
              <Badge variant="featured">Top</Badge>
            )}
            {product.instantAvailability && (
              <ScarcityBadge type="availability" />
            )}
          </div>
        </Link>

        {/* Content - New Hierarchy: Price → Title → Trust → Location → CTA */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Price - HERO ELEMENT (Largest, Red, Prominent) */}
          <div className="mb-3">
            <Price amount={product.pricePerDay} period="/day" size="lg" />
          </div>

          {/* Title - Larger, More Prominent */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-white mb-2 line-clamp-2 text-lg md:text-xl leading-tight group-hover:text-gray-200 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Trust Signals - Rating, Verified, etc. */}
          {shop && (
            <div className="mb-3">
              <TrustSignals
                rating={shop.rating}
                totalRatings={shop.totalRatings}
                verified={true}
                className="text-sm"
              />
            </div>
          )}

          {/* Category & Brand */}
          <div className="flex items-center gap-2 mb-3">
            {brand && (
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {brand}
              </span>
            )}
            <span className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded font-medium">
              {product.category}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-4 text-sm text-gray-400">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate font-medium">{product.city}</span>
          </div>

          {/* CTA Buttons - Primary + Secondary */}
          <div className="mt-auto flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleContactClick}
            >
              Rent Now
            </Button>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={handleContactClick}
            >
              Contact Shop
            </Button>
          </div>
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

export default memo(ProductCard);

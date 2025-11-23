'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import ContactModal from '@/components/ContactModal';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { Product, Shop } from '@/types';
import Price from '@/components/ui/Price';
import Button from '@/components/ui/Button';
import TrustSignals from '@/components/ui/TrustSignals';
import ScarcityBadge from '@/components/ui/ScarcityBadge';
import QuickActions from '@/components/ui/QuickActions';

interface ProductClientProps {
  product: Product;
  shop: Shop | null;
}

export default function ProductClient({ product, shop }: ProductClientProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'product_view', {
        product_id: product.id,
        product_title: product.title,
      });
    }
  }, [product]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const availableImages = product.imageUrls.filter((_, index) => !imageErrors.has(index));
  const hasImages = availableImages.length > 0;

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm font-medium transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>

        <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Image */}
            <div>
              <div className="relative aspect-[4/3] bg-[#000000] rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-inner">
                {hasImages ? (
                  <Image
                    src={availableImages[currentImageIndex]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                    onError={() => handleImageError(currentImageIndex)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-7xl opacity-30">📷</span>
                  </div>
                )}
              </div>
              
              {availableImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {availableImages.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index 
                          ? 'border-white/30 shadow-lg scale-105' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Image 
                        src={url} 
                        alt={`${product.title} ${index + 1}`} 
                        fill 
                        className="object-cover"
                        onError={() => handleImageError(index)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="text-sm px-3 py-1 bg-white/5 text-gray-300 rounded-lg font-medium border border-white/10">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Price - HERO ELEMENT */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <Price amount={product.pricePerDay} period="/day" size="hero" />
                {product.instantAvailability && (
                  <div className="mt-3">
                    <ScarcityBadge type="availability" />
                  </div>
                )}
              </div>

              {/* Trust Signals */}
              {shop && (
                <div className="mb-6">
                  <TrustSignals
                    rating={shop.rating}
                    totalRatings={shop.totalRatings}
                    verified={true}
                    responseTime="2 hours"
                    className="text-base"
                  />
                </div>
              )}

              {/* Shop Info */}
              {shop && (
                <div className="mb-6 p-5 bg-black/30 rounded-2xl border border-white/10 backdrop-blur-xl">
                  <Link href={`/shops/${shop.id}`} className="block mb-3">
                    <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">
                      {shop.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{product.city}</span>
                    </div>
                    {shop.address && (
                      <span className="text-gray-500">{shop.address}</span>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  <QuickActions
                    phone={shop.phone}
                    productTitle={product.title}
                    onQuickBook={handleContactClick}
                  />
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                  <p className="text-gray-400 leading-relaxed text-base">{product.description}</p>
                </div>
              )}

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/5 text-gray-300 rounded-lg text-sm border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Desktop CTA Buttons */}
              <div className="hidden md:flex flex-col gap-3 mt-auto">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleContactClick}
                >
                  Rent Now
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={handleContactClick}
                >
                  Contact Shop
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky CTA Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0F0F0F] border-t border-white/10 p-4 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">Price</div>
            <Price amount={product.pricePerDay} period="/day" size="md" />
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleContactClick}
            className="flex-1"
          >
            Rent Now
          </Button>
        </div>
      </div>

      {isContactModalOpen && (
        <ContactModal
          product={product}
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </div>
  );
}

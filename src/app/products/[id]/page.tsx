'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import ContactModal from '@/components/ContactModal';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { getProduct, getShop } from '@/lib/firestore';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProduct(productId);
      
      if (!productData) {
        router.push('/');
        return;
      }
      
      setProduct(productData);
      const shopData = await getShop(productData.shopId);
      setShop(shopData);

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'product_view', {
          product_id: productData.id,
          product_title: productData.title,
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductCardSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const availableImages = product.imageUrls.filter((_, index) => !imageErrors.has(index));
  const hasImages = availableImages.length > 0;

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
          Back to Products
        </Link>

        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Image */}
            <div>
              <div className="relative aspect-[4/3] bg-[#0a0a0a] rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-inner">
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
            <div>
              <div className="mb-4">
                <span className="text-sm px-3 py-1 bg-white/5 text-gray-300 rounded-lg font-medium border border-white/10">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {product.title}
              </h1>

              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold gradient-green-text">
                    ₹{product.pricePerDay.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400">/ day</span>
                </div>
              </div>

              {/* Shop Info */}
              {shop && (
                <div className="mb-6 p-5 bg-black/30 rounded-2xl border border-white/10 backdrop-blur-xl">
                  <Link href={`/shops/${shop.id}`} className="block mb-3">
                    <h3 className="font-semibold text-white hover:text-gray-300 transition-colors duration-200">
                      {shop.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{product.city}</span>
                    </div>
                    {shop.rating && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="font-medium text-white">{shop.rating.toFixed(1)}</span>
                        {shop.totalRatings && (
                          <span className="text-gray-500">({shop.totalRatings})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {product.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                  <p className="text-gray-400 leading-relaxed">{product.description}</p>
                </div>
              )}

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

              <button
                onClick={handleContactClick}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 text-base active:scale-95"
              >
                Contact Shop
              </button>
            </div>
          </div>
        </div>
      </main>

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

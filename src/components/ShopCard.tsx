'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shop, Product } from '@/types';

interface ShopCardProps {
  shop: Shop;
  products: Product[];
}

export default function ShopCard({ shop, products }: ShopCardProps) {
  return (
    <Link href={`/shops/${shop.id}`}>
      <div className="group bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
        {/* Shop Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-gray-300 transition-colors duration-200">
                {shop.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{shop.city}</span>
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
          </div>
          {shop.address && (
            <p className="text-sm text-gray-500">{shop.address}</p>
          )}
        </div>

        {/* Products Preview */}
        {products.length > 0 && (
          <div className="p-6 bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">
                {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
              </span>
              <span className="text-sm text-gray-400 font-medium group-hover:text-white transition-colors">View All →</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300">
                  {product.imageUrls[0] ? (
                    <div className="aspect-square relative bg-[#0a0a0a]">
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-[#0a0a0a] flex items-center justify-center">
                      <span className="text-2xl opacity-30">📷</span>
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium text-white line-clamp-1 mb-1">
                      {product.title}
                    </p>
                    <p className="text-xs font-semibold text-white">
                      ₹{product.pricePerDay}/day
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {products.length === 0 && (
          <div className="p-6 bg-[#0a0a0a] text-center">
            <p className="text-sm text-gray-500">No products available</p>
          </div>
        )}
      </div>
    </Link>
  );
}

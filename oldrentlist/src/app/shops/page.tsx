'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserShops, deleteShop, type Shop } from '@/lib/supabase-shops';
import { Store, Plus, Edit, Trash2, MapPin, Phone, FileText } from 'lucide-react';

export default function ShopsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadShops();
  }, [user, router]);

  const loadShops = async () => {
    try {
      const userShops = await getUserShops();
      setShops(userShops);
    } catch (err) {
      console.error('Error loading shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shopId: string, shopName: string) => {
    if (!confirm(`Are you sure you want to delete "${shopName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(shopId);
    try {
      const { error } = await deleteShop(shopId);
      if (error) {
        alert(`Error deleting shop: ${error.message}`);
        return;
      }
      await loadShops();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DC2626]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            ← Back to home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Shops</h1>
              <p className="text-gray-400">Add and manage the shops you use for rentals</p>
            </div>
            <Link
              href="/shops/new"
              className="flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add New Shop</span>
              <span className="sm:hidden">Add Shop</span>
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {shops.length === 0 && (
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Store className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No shops added yet</h2>
            <p className="text-gray-400 mb-6">Add your first shop to start renting</p>
            <Link
              href="/shops/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add a shop
            </Link>
          </div>
        )}

        {/* Shops Grid */}
        {shops.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-6">You can add all your shop locations here</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{shop.shop_name}</h3>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/shops/${shop.id}/edit`}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Edit shop"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(shop.id, shop.shop_name)}
                        disabled={deletingId === shop.id}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete shop"
                      >
                        {deletingId === shop.id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Rental Types */}
                  {shop.rental_types && shop.rental_types.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {shop.rental_types.map((type, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs font-medium bg-[#DC2626]/20 text-[#DC2626] rounded-md"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Location */}
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {shop.location_city}, {shop.location_state}
                      </span>
                    </div>
                    {shop.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{shop.phone}</span>
                      </div>
                    )}
                    {shop.gst_number && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>GST: {shop.gst_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


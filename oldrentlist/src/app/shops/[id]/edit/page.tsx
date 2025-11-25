'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getShopById, updateShop, RENTAL_TYPES, type RentalType } from '@/lib/supabase-shops';

export default function EditShopPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const shopId = params?.id as string;
  
  const [formData, setFormData] = useState({
    shop_name: '',
    gst_number: '',
    rental_types: [] as string[],
    phone: '',
    location_city: '',
    location_state: '',
    location_country: 'India',
    address_line1: '',
    address_line2: '',
    postal_code: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadShop();
  }, [user, router, shopId]);

  const loadShop = async () => {
    if (!shopId) return;

    try {
      const shop = await getShopById(shopId);
      if (!shop) {
        router.push('/shops');
        return;
      }

      setFormData({
        shop_name: shop.shop_name,
        gst_number: shop.gst_number || '',
        rental_types: shop.rental_types || [],
        phone: shop.phone,
        location_city: shop.location_city,
        location_state: shop.location_state,
        location_country: shop.location_country,
        address_line1: shop.address_line1,
        address_line2: shop.address_line2 || '',
        postal_code: shop.postal_code,
      });
    } catch (err) {
      console.error('Error loading shop:', err);
      router.push('/shops');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.shop_name.trim()) {
      errors.shop_name = 'Shop name is required';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.location_city.trim()) {
      errors.location_city = 'City is required';
    }
    
    if (!formData.location_state.trim()) {
      errors.location_state = 'State is required';
    }
    
    if (!formData.address_line1.trim()) {
      errors.address_line1 = 'Address is required';
    }
    
    if (!formData.postal_code.trim()) {
      errors.postal_code = 'Postal code is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const { data, error: updateError } = await updateShop(shopId, {
        shop_name: formData.shop_name.trim(),
        gst_number: formData.gst_number.trim() || null,
        rental_types: formData.rental_types,
        phone: formData.phone.trim(),
        location_city: formData.location_city.trim(),
        location_state: formData.location_state.trim(),
        location_country: formData.location_country.trim(),
        address_line1: formData.address_line1.trim(),
        address_line2: formData.address_line2.trim() || null,
        postal_code: formData.postal_code.trim(),
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.push('/shops');
    } catch (err: any) {
      setError(err.message || 'Failed to update shop');
    } finally {
      setSaving(false);
    }
  };

  const toggleRentalType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      rental_types: prev.rental_types.includes(type)
        ? prev.rental_types.filter(t => t !== type)
        : [...prev.rental_types, type],
    }));
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shops"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            ← Back to shops
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Edit Shop</h1>
          <p className="text-gray-400">Update your shop details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 md:p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="shop_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Shop Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="shop_name"
                  type="text"
                  value={formData.shop_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, shop_name: e.target.value }))}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    fieldErrors.shop_name ? 'border-red-500/50' : 'border-white/10'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500`}
                  placeholder="My Rental Shop"
                />
                {fieldErrors.shop_name && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.shop_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="gst_number" className="block text-sm font-medium text-gray-300 mb-2">
                  GST Number (Optional)
                </label>
                <input
                  id="gst_number"
                  type="text"
                  value={formData.gst_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, gst_number: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500"
                  placeholder="29ABCDE1234F1Z5"
                />
              </div>
            </div>
          </div>

          {/* Rental Types */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Rental Types</h2>
            <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {RENTAL_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleRentalType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.rental_types.includes(type)
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Contact & Location */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Contact & Location</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    fieldErrors.phone ? 'border-red-500/50' : 'border-white/10'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500`}
                  placeholder="+91 9876543210"
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="location_city" className="block text-sm font-medium text-gray-300 mb-2">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="location_city"
                    type="text"
                    value={formData.location_city}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_city: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      fieldErrors.location_city ? 'border-red-500/50' : 'border-white/10'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500`}
                    placeholder="Bengaluru"
                  />
                  {fieldErrors.location_city && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.location_city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location_state" className="block text-sm font-medium text-gray-300 mb-2">
                    State <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="location_state"
                    type="text"
                    value={formData.location_state}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_state: e.target.value }))}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      fieldErrors.location_state ? 'border-red-500/50' : 'border-white/10'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500`}
                    placeholder="Karnataka"
                  />
                  {fieldErrors.location_state && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.location_state}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location_country" className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    id="location_country"
                    type="text"
                    value={formData.location_country}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_country: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500"
                    placeholder="India"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address_line1" className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 1 <span className="text-red-400">*</span>
                </label>
                <input
                  id="address_line1"
                  type="text"
                  value={formData.address_line1}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_line1: e.target.value }))}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    fieldErrors.address_line1 ? 'border-red-500/50' : 'border-white/10'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500`}
                  placeholder="123 Main Street"
                />
                {fieldErrors.address_line1 && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.address_line1}</p>
                )}
              </div>

              <div>
                <label htmlFor="address_line2" className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  id="address_line2"
                  type="text"
                  value={formData.address_line2}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_line2: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500"
                  placeholder="Building, Floor, etc."
                />
              </div>

              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-300 mb-2">
                  Postal Code <span className="text-red-400">*</span>
                </label>
                <input
                  id="postal_code"
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    fieldErrors.postal_code ? 'border-red-500/50' : 'border-white/10'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500`}
                  placeholder="560001"
                />
                {fieldErrors.postal_code && (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.postal_code}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Update Shop'}
            </button>
            <Link
              href="/shops"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all duration-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}


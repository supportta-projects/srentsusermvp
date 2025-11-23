'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Product } from '@/types';
import { createContact, getShop } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import Button from './ui/Button';
import QuickActions from './ui/QuickActions';
import Price from './ui/Price';

interface ContactModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ product, isOpen, onClose }: ContactModalProps) {
  const { customer } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    if (isOpen && product.shopId) {
      getShop(product.shopId).then(setShop);
    }
  }, [isOpen, product.shopId]);

  // Pre-fill form with authenticated user data
  useEffect(() => {
    if (isOpen && customer) {
      setFormData(prev => ({
        name: prev.name || customer.name || '',
        phone: prev.phone || customer.phone || '',
        message: prev.message || '',
      }));
    }
  }, [isOpen, customer]);

  if (!isOpen) return null;

  const submitContact = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10 || !phoneRegex.test(cleanedPhone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      await createContact({
        productId: product.id,
        shopId: product.shopId,
        name: formData.name || undefined,
        phone: cleanedPhone,
        message: formData.message || undefined,
        status: 'pending',
      });

      setSubmitStatus('success');
      
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'contact_submit', {
          product_id: product.id,
          product_title: product.title,
          shop_id: product.shopId,
        });
      }

      setFormData({
        name: '',
        phone: '',
        message: '',
      });

      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error submitting contact:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickBook = () => {
    submitContact();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitContact();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0F0F0F] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-[#0F0F0F] border-b border-white/10 px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Contact Shop</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl transition-colors duration-200"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 bg-black/30 border-b border-white/10">
          <h3 className="font-semibold text-white mb-2 text-lg">{product.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Price amount={product.pricePerDay} period="/day" size="sm" />
            <span>•</span>
            <span>{product.city}</span>
          </div>
        </div>

        {/* Quick Actions */}
        {shop && shop.phone && (
          <div className="px-6 py-4 border-b border-white/10">
            <QuickActions
              phone={shop.phone}
              productTitle={product.title}
              onQuickBook={handleQuickBook}
            />
          </div>
        )}

        {/* Show customer info if authenticated */}
        {customer && (
          <div className="px-6 py-3 bg-[#DC2626]/10 border-b border-white/10">
            <p className="text-xs text-gray-400 mb-1">Signed in as</p>
            <p className="text-sm text-white font-medium">{customer.name}</p>
            <p className="text-xs text-gray-400">{customer.email}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-base text-white placeholder-gray-500 backdrop-blur-xl transition-all min-h-[48px]"
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">We'll share this with the shop</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
              Your Name <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-base text-white placeholder-gray-500 backdrop-blur-xl transition-all min-h-[48px]"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
              Message <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-base text-white placeholder-gray-500 resize-none backdrop-blur-xl transition-all"
              placeholder="Any specific requirements?"
            />
          </div>

          {submitStatus === 'success' && (
            <div className="bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] px-4 py-3 rounded-lg text-sm animate-scale-in">
              ✓ Contact request submitted! The shop will reach out to you soon.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm animate-scale-in">
              ✗ Something went wrong. Please try again.
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

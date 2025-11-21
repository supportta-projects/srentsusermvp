'use client';

import { useState, FormEvent } from 'react';
import { Product } from '@/types';
import { createContact } from '@/lib/firestore';

interface ContactModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ product, isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    startDate: '',
    endDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        name: formData.name,
        phone: cleanedPhone,
        message: formData.message || undefined,
        desiredDates: formData.startDate && formData.endDate ? {
          start: new Date(formData.startDate),
          end: new Date(formData.endDate),
        } : undefined,
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
        startDate: '',
        endDate: '',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 px-6 py-5 flex items-center justify-between">
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
          <h3 className="font-semibold text-white mb-1">{product.title}</h3>
          <p className="text-sm text-gray-400 font-medium">
            ₹{product.pricePerDay.toLocaleString()} / day • {product.city}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
              Your Name <span className="text-gray-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-sm text-white placeholder-gray-500 backdrop-blur-xl transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">
              Phone Number <span className="text-gray-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-sm text-white placeholder-gray-500 backdrop-blur-xl transition-all"
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">We'll share this with the shop</p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-sm text-white placeholder-gray-500 resize-none backdrop-blur-xl transition-all"
              placeholder="Any specific requirements?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-sm text-white backdrop-blur-xl"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-sm text-white backdrop-blur-xl"
              />
            </div>
          </div>

          {submitStatus === 'success' && (
            <div className="bg-[#10b981]/20 border border-[#10b981]/50 text-[#10b981] px-4 py-3 rounded-lg text-sm animate-scale-in">
              ✓ Contact request submitted! The shop will reach out to you soon.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm animate-scale-in">
              ✗ Something went wrong. Please try again.
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-semibold disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

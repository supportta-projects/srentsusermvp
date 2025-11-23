'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { SubscriptionPlan } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
}

export default function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    shopName: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10 || !phoneRegex.test(cleanedPhone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !plan) return;

    setIsSubmitting(true);
    setPaymentStatus('processing');

    try {
      // TODO: Integrate with payment API
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      setPaymentStatus('success');
      
      // TODO: Call payment API here
      // const response = await fetch('/api/razorpay/create-order', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     planId: plan.id,
      //     amount: plan.amount,
      //     vendorData: formData,
      //   }),
      // });
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (paymentStatus === 'success') {
      // Reset form and close
      setFormData({ name: '', phone: '', shopName: '', email: '' });
      setErrors({});
      setPaymentStatus('idle');
    }
    onClose();
  };

  if (!isOpen || !plan) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto gpu-accelerated"
          style={{
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {paymentStatus === 'success' ? (
            /* Success State */
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-gray-400 mb-6">
                Your subscription has been activated. You'll receive an email with your account credentials shortly.
              </p>
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </motion.button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Complete Your Subscription</h2>
                <p className="text-gray-400 text-sm">
                  {plan.name} Plan • ₹{plan.amount.toLocaleString()}
                  {plan.duration === 30 ? '/month' : plan.duration === 180 ? '/6 months' : '/year'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#0F0F0F] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#DC2626] focus:ring-[#DC2626]'
                    }`}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#0F0F0F] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#DC2626] focus:ring-[#DC2626]'
                    }`}
                    placeholder="+91 9876543210"
                    disabled={isSubmitting}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                </div>

                {/* Shop Name */}
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-300 mb-2">
                    Shop Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#0F0F0F] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.shopName ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#DC2626] focus:ring-[#DC2626]'
                    }`}
                    placeholder="Enter your shop name"
                    disabled={isSubmitting}
                  />
                  {errors.shopName && <p className="mt-1 text-sm text-red-400">{errors.shopName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#0F0F0F] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-[#DC2626] focus:ring-[#DC2626]'
                    }`}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                {/* Error Message */}
                {paymentStatus === 'error' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">
                      Payment failed. Please try again or contact support.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className={`w-full px-6 py-4 bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-[#B91C1C] hover:to-[#DC2626]'
                  }`}
                  style={{
                    boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ₹${plan.amount.toLocaleString()}`
                  )}
                </motion.button>

                {/* Info Text */}
                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy. 
                  Your account will be created after payment confirmation.
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


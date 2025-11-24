'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import VendorNavbar from '@/components/vendor/VendorNavbar';
import { SubscriptionPlan } from '@/types';
import { getSubscriptionPlans } from '@/lib/subscriptions';

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    shopName: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPlan();
  }, [planId]);

  const loadPlan = async () => {
    try {
      const plans = await getSubscriptionPlans();
      const selectedPlan = plans.find(p => p.id === planId) || plans[0];
      setPlan(selectedPlan);
    } catch (error) {
      console.error('Error loading plan:', error);
    } finally {
      setLoading(false);
    }
  };

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

    try {
      // Store form data in sessionStorage for payment page
      sessionStorage.setItem('vendorProfile', JSON.stringify({
        ...formData,
        planId: plan.id,
      }));

      // Redirect to payment page
      router.push(`/vendor/subscribe/payment?plan=${plan.id}`);
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
            <button
              onClick={() => router.push('/vendor#pricing')}
              className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-colors"
            >
              Back to Pricing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <VendorNavbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/vendor#pricing')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Pricing</span>
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-gray-400">
              {plan.name} Plan • ₹{plan.amount.toLocaleString()}
              {plan.duration === 30 ? '/month' : plan.duration === 180 ? '/6 months' : '/year'}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6"
          >
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
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-center">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
        </div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}


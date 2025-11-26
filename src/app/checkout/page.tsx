'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2, Tag, X, Check } from 'lucide-react';
import VendorNavbar from '@/components/vendor/VendorNavbar';
import { SubscriptionPlan } from '@/types';
import { getSubscriptionPlans } from '@/lib/subscriptions';
import { getCurrentUserProfile, Profile } from '@/lib/supabase-profiles';

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const planId = searchParams.get('plan');
  
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description: string;
    discount: number;
    discountType: string;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      if (planId) {
        router.push(`/register?plan=${planId}&redirect=checkout`);
      } else {
        router.push('/register?redirect=checkout');
      }
    }
  }, [user, authLoading, router, planId]);

  useEffect(() => {
    if (user && !authLoading) {
      loadData();
    }
  }, [user, authLoading, planId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load plan
      const plans = await getSubscriptionPlans();
      const selectedPlan = plans.find(p => p.id === planId) || plans[0];
      
      if (!selectedPlan && planId) {
        // Use mock plan if not found
        const mockPlans: SubscriptionPlan[] = [
          {
            id: 'monthly',
            name: 'Basic',
            description: 'A basic plan for startups and individual users',
            amount: 1499,
            duration: 30,
            features: [
              'Full access to vendor dashboard',
              'Unlimited product listings',
              'Unlimited orders management',
              'Customer management',
              'Staff management',
              'Analytics and reports',
              'Email support',
            ],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'six-month',
            name: 'Premium',
            description: 'A premium plan for growing businesses',
            amount: 6300,
            duration: 180,
            features: [
              'Full access to vendor dashboard',
              'Unlimited product listings',
              'Unlimited orders management',
              'Customer management',
              'Staff management',
              'Analytics and reports',
              'Priority email support',
              'Save ₹2694 compared to monthly',
            ],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'yearly',
            name: 'Enterprise',
            description: 'An enterprise plan with advanced features for large organizations',
            amount: 9999,
            duration: 365,
            features: [
              'Full access to vendor dashboard',
              'Unlimited product listings',
              'Unlimited orders management',
              'Customer management',
              'Staff management',
              'Analytics and reports',
              'Priority email support',
              'Phone support',
              'Save ₹4497 compared to monthly',
              'Best value - Only ₹35/day',
            ],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        const mockPlan = mockPlans.find(p => p.id === planId);
        if (mockPlan) {
          setPlan(mockPlan);
        }
      } else {
        setPlan(selectedPlan);
      }

      // Load user profile for billing details
      if (user) {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load checkout data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!plan || !user) return;

    setIsSubmitting(true);
    setPaymentStatus('processing');
    setError(null);

    try {
      // Create PhonePe payment using new API
      const response = await fetch('/api/payments/phonepe/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          planId: plan.id,
          amount: totalAmount, // Amount in rupees (will be converted to paise in backend)
          description: `Subscription: ${plan.name}`,
          metadata: {
            planId: plan.id,
            planName: plan.name,
            couponCode: appliedCoupon?.code || null,
            discount: appliedCoupon?.discount || 0,
          },
          vendorPhone: profile?.phone || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.error || errorData.message || 'Failed to create payment';
        console.error('Payment creation error:', errorData);
        throw new Error(errorMessage);
      }

      const paymentData = await response.json();

      // Redirect to PhonePe payment page
      if (paymentData.redirectUrl) {
        window.location.href = paymentData.redirectUrl;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setError(error.message || 'Failed to process payment');
      setIsSubmitting(false);
    }
  };

  // Validate coupon
  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    setCouponError(null);

    try {
      const response = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
          planAmount: plan?.amount || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
        return;
      }

      if (data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          description: data.coupon.description,
          discount: data.amounts.discount,
          discountType: data.coupon.discountType,
        });
        setCouponError(null);
      }
    } catch (error: any) {
      console.error('Error validating coupon:', error);
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Plan not found</h2>
            <button
              onClick={() => router.push('/#pricing')}
              className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-colors"
            >
              Back to Pricing
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate amounts with coupon
  const GST_RATE = 0.18;
  const baseAmount = plan.amount;
  const discountAmount = appliedCoupon?.discount || 0;
  const subtotalAfterDiscount = Math.max(0, baseAmount - discountAmount);
  const gstAmount = Math.round(subtotalAfterDiscount * GST_RATE);
  const totalAmount = subtotalAfterDiscount + gstAmount;
  const dailyPrice = Math.round(plan.amount / plan.duration);

  return (
    <div className="min-h-screen bg-black text-white">
      <VendorNavbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/#pricing')}
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Checkout</h1>
            <p className="text-gray-400">Review your billing details and complete payment</p>
          </motion.div>

          <div className="space-y-6">
              {/* Billing Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Billing Details</h2>
                
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                      <p className="text-white">{profile?.full_name || user.displayName || user.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                      <p className="text-white">{user.email || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {profile?.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                      <p className="text-white">{profile.phone}</p>
                    </div>
                  )}
                  
                  {profile?.company_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                      <p className="text-white">{profile.company_name}</p>
                    </div>
                  )}
                  
                  {(profile?.address_line1 || profile?.city || profile?.state) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                      <p className="text-white">
                        {[profile.address_line1, profile.address_line2, profile.city, profile.state, profile.postal_code]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {profile?.gst_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">GST Number</label>
                      <p className="text-white">{profile.gst_number}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={() => router.push('/profile')}
                      className="text-sm text-[#DC2626] hover:text-[#B91C1C] transition-colors"
                    >
                      Update billing details
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Coupon Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8"
              >
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#DC2626]" />
                  Discount Coupon
                </h2>
                
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleValidateCoupon();
                          }
                        }}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500 transition-all"
                      />
                      <button
                        onClick={handleValidateCoupon}
                        disabled={validatingCoupon || !couponCode.trim()}
                        className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {validatingCoupon ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-400">{couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          Coupon Applied: {appliedCoupon.code}
                        </p>
                        <p className="text-xs text-gray-400">{appliedCoupon.description}</p>
                        <p className="text-sm text-green-400 mt-1">
                          You saved ₹{appliedCoupon.discount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{plan.name} Plan</h3>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">₹{baseAmount.toLocaleString()}</span>
                      <span className="text-gray-400">
                        {plan.duration === 30 ? '/month' : plan.duration === 180 ? '/6 months' : '/year'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">₹{dailyPrice}/day</p>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-gray-300">₹{baseAmount.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Discount ({appliedCoupon.code}):</span>
                        <span className="text-green-400">-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Subtotal after discount:</span>
                      <span className="text-gray-300">₹{subtotalAfterDiscount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">GST (18%):</span>
                      <span className="text-gray-300">₹{gstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg pt-2 border-t border-white/10">
                      <span className="text-gray-300 font-semibold">Total Amount</span>
                      <span className="text-white font-bold text-2xl">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Status */}
              {paymentStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-2xl p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                  <p className="text-gray-400">Redirecting to success page...</p>
                </motion.div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Payment Button */}
                  <motion.button
                    onClick={handlePayment}
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
                      `Pay ₹${totalAmount.toLocaleString()}`
                    )}
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    🔒 Secure payment powered by PhonePe
                  </p>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
        </div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}


'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import VendorNavbar from '@/components/vendor/VendorNavbar';
import { SubscriptionPlan } from '@/types';
import { getSubscriptionPlans } from '@/lib/subscriptions';

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const planId = searchParams.get('plan');

  // Redirect to register if not logged in
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
    loadPlan();
  }, [planId]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const plans = await getSubscriptionPlans();
      const selectedPlan = plans.find(p => p.id === planId) || plans[0];
      
      // If no plan found, use mock plan
      if (!selectedPlan && planId) {
        const mockPlans: SubscriptionPlan[] = [
          {
            id: 'monthly',
            name: 'Basic',
            description: 'A basic plan for startups and individual users',
            amount: 1799,
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
            amount: 9000,
            duration: 180,
            features: [
              'Full access to vendor dashboard',
              'Unlimited product listings',
              'Unlimited orders management',
              'Customer management',
              'Staff management',
              'Analytics and reports',
              'Priority email support',
              'Save ₹1,794 compared to monthly',
            ],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'yearly',
            name: 'Enterprise',
            description: 'An enterprise plan with advanced features for large organizations',
            amount: 14999,
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
              'Save ₹6,589 compared to monthly',
              'Best value - Only ₹41/day',
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
    } catch (error) {
      console.error('Error loading plan:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate prices with 18% GST
  const calculatePrices = () => {
    if (!plan) return { baseAmount: 0, gstAmount: 0, totalAmount: 0 };
    
    const baseAmount = plan.amount;
    const gstAmount = Math.round(baseAmount * 0.18);
    const totalAmount = baseAmount + gstAmount;
    
    return { baseAmount, gstAmount, totalAmount };
  };

  const { baseAmount, gstAmount, totalAmount } = calculatePrices();

  const handlePayment = async () => {
    if (!plan || !user) return;
    
    setProcessing(true);
    
    try {
      // TODO: Integrate PhonePe payment gateway here
      // For now, just show a message
      alert(`Payment integration coming soon!\n\nPlan: ${plan.name}\nAmount: ₹${totalAmount.toLocaleString()}\n\nPhonePe gateway will be integrated here.`);
      
      // After payment success, redirect to success page
      // router.push(`/vendor/checkout/success?plan=${plan.id}`);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Checkout</h1>
            <p className="text-gray-400">
              Complete your subscription payment
            </p>
          </motion.div>

          {/* Plan Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Subscription Plan</h2>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold">₹{baseAmount.toLocaleString()}</span>
                <span className="text-gray-400">
                  {plan.duration === 30 ? '/ month' : plan.duration === 180 ? '/ 6 months' : '/ year'}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">What's included:</h4>
              <div className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Price Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Price Breakdown</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Plan Amount</span>
                <span className="text-white font-medium">₹{baseAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">GST (18%)</span>
                <span className="text-white font-medium">₹{gstAmount.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-white/10 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-[#DC2626]">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handlePayment}
            disabled={processing}
            whileHover={!processing ? { scale: 1.02 } : {}}
            whileTap={!processing ? { scale: 0.98 } : {}}
            className={`w-full px-6 py-4 bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              processing ? 'opacity-70 cursor-not-allowed' : 'hover:from-[#B91C1C] hover:to-[#DC2626]'
            }`}
            style={{
              boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment
              </>
            )}
          </motion.button>

          {/* Info Text */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            <br />
            Your payment is secure and encrypted.
          </p>
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


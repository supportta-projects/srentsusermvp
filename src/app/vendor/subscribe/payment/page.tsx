'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import VendorNavbar from '@/components/vendor/VendorNavbar';
import { SubscriptionPlan } from '@/types';
import { getSubscriptionPlans } from '@/lib/subscriptions';

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadData();
  }, [planId]);

  const loadData = async () => {
    try {
      // Load plan
      const plans = await getSubscriptionPlans();
      const selectedPlan = plans.find(p => p.id === planId) || plans[0];
      setPlan(selectedPlan);

      // Load profile data from sessionStorage
      const storedProfile = sessionStorage.getItem('vendorProfile');
      if (storedProfile) {
        setProfileData(JSON.parse(storedProfile));
      } else {
        // No profile data, redirect back to profile page
        router.push(`/vendor/subscribe/profile?plan=${planId}`);
        return;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!plan || !profileData) return;

    setIsSubmitting(true);
    setPaymentStatus('processing');

    try {
      // Generate a vendor ID (use email as ID for now, or generate UUID)
      const vendorId = `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('📧 [Payment] Creating Razorpay order...');
      console.log('📧 [Payment] Vendor data:', {
        vendorId,
        vendorEmail: profileData.email,
        vendorName: profileData.name,
        vendorPhone: profileData.phone,
        planId: plan.id,
      });
      
      // Create Razorpay order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          vendorId: vendorId,
          vendorEmail: profileData.email,
          vendorName: profileData.name,
          vendorPhone: profileData.phone,
          amount: totalAmount, // Send total amount with GST
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderData = await response.json();
      console.log('✅ [Payment] Order created:', orderData);

      // Check if test mode
      const isTestMode = orderData.testMode || orderData.key?.includes('dummy') || orderData.key?.includes('test');

      // In test mode with dummy credentials, simulate payment
      if (isTestMode && orderData.key?.includes('dummy')) {
        console.log('🧪 [Payment] TEST MODE: Simulating payment...');
        
        // Simulate payment after 2 seconds
        setTimeout(async () => {
          try {
            const mockResponse = {
              razorpay_order_id: orderData.orderId,
              razorpay_payment_id: `pay_test_${Date.now()}`,
              razorpay_signature: 'test_signature_dummy',
            };

            console.log('📧 [Payment] Verifying test payment...');
            // Verify payment (will skip signature check in test mode)
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: mockResponse.razorpay_order_id,
                paymentId: mockResponse.razorpay_payment_id,
                signature: mockResponse.razorpay_signature,
                vendorId: vendorId,
                planId: plan.id,
                vendorEmail: profileData.email,
                vendorName: profileData.name,
                vendorPhone: profileData.phone,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyResult = await verifyResponse.json();
            console.log('✅ [Payment] Payment verified:', verifyResult);
            
            setPaymentStatus('success');
            sessionStorage.removeItem('vendorProfile');
            
            // Redirect to success page after 2 seconds
            setTimeout(() => {
              router.push(`/vendor/subscribe/success?plan=${plan.id}`);
            }, 2000);
          } catch (error: any) {
            console.error('❌ [Payment] Payment verification error:', error);
            setPaymentStatus('error');
            setIsSubmitting(false);
          }
        }, 2000);
      } else {
        // Real Razorpay integration (if you have real Razorpay keys)
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options: any = {
            key: orderData.key,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'Rentorent',
            description: `Subscription: ${plan.name}`,
            order_id: orderData.orderId,
            handler: async function (response: any) {
              try {
                console.log('📧 [Payment] Verifying payment...');
                const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    vendorId: vendorId,
                    planId: plan.id,
                    vendorEmail: profileData.email,
                    vendorName: profileData.name,
                    vendorPhone: profileData.phone,
                  }),
                });

                if (!verifyResponse.ok) {
                  throw new Error('Payment verification failed');
                }

                const verifyResult = await verifyResponse.json();
                console.log('✅ [Payment] Payment verified:', verifyResult);
                
                setPaymentStatus('success');
                sessionStorage.removeItem('vendorProfile');
                
                setTimeout(() => {
                  router.push(`/vendor/subscribe/success?plan=${plan.id}`);
                }, 2000);
              } catch (error: any) {
                console.error('❌ [Payment] Payment verification error:', error);
                setPaymentStatus('error');
                setIsSubmitting(false);
              }
            },
            prefill: {
              email: profileData.email,
              name: profileData.name,
              contact: profileData.phone,
            },
            theme: {
              color: '#DC2626',
            },
            modal: {
              ondismiss: function() {
                setIsSubmitting(false);
                setPaymentStatus('idle');
              },
            },
          };

          const razorpay = (window as any).Razorpay(options);
          razorpay.open();
        };
        document.body.appendChild(script);
      }
      
    } catch (error: any) {
      console.error('❌ [Payment] Payment error:', error);
      setPaymentStatus('error');
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

  if (!plan || !profileData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Missing Information</h2>
            <button
              onClick={() => router.push(`/vendor/subscribe/profile?plan=${planId}`)}
              className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-colors"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dailyPrice = Math.round(plan.amount / plan.duration);
  const GST_RATE = 0.18; // 18% GST
  const baseAmount = plan.amount;
  const gstAmount = Math.round(baseAmount * GST_RATE);
  const totalAmount = baseAmount + gstAmount;

  return (
    <div className="min-h-screen bg-black text-white">
      <VendorNavbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push(`/vendor/subscribe/profile?plan=${planId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Complete Payment</h1>
            <p className="text-gray-400">Review your details and proceed with payment</p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 space-y-6"
          >
            {/* Profile Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Profile Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{profileData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white">{profileData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shop Name:</span>
                  <span className="text-white">{profileData.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{profileData.email}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Subscription Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{plan.name} Plan</span>
                  <span className="text-white font-semibold">
                    ₹{plan.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    {plan.duration === 30 ? 'Monthly' : plan.duration === 180 ? '6 Months' : 'Yearly'} subscription
                  </span>
                  <span className="text-gray-400">₹{dailyPrice}/day</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-gray-300">₹{baseAmount.toLocaleString()}</span>
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
              <p className="text-gray-400">
                Redirecting to success page...
              </p>
            </motion.div>
          ) : (
            <>
              {/* Error Message */}
              {paymentStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">
                    Payment failed. Please try again or contact support.
                  </p>
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

              {/* Security Badge */}
              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure payment powered by Razorpay
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}


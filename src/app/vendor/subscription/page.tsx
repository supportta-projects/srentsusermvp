'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SubscriptionPlan, VendorSubscription } from '@/types';
import { getSubscriptionPlans, getVendorSubscription } from '@/lib/subscriptions';
import SubscriptionPlans from '@/components/subscriptions/SubscriptionPlans';
import SubscriptionStatus from '@/components/subscriptions/SubscriptionStatus';
import Button from '@/components/ui/Button';
import VendorNavbar from '@/components/vendor/VendorNavbar';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function VendorSubscriptionPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<VendorSubscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to register if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      const urlParams = new URLSearchParams(window.location.search);
      const planId = urlParams.get('plan');
      if (planId) {
        router.push(`/register?plan=${planId}&redirect=payment`);
      } else {
        router.push('/register?redirect=payment');
      }
    }
  }, [user, authLoading, router]);

  // Get plan ID from URL and set selected plan
  useEffect(() => {
    if (user && !authLoading && plans.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const planId = urlParams.get('plan');
      if (planId) {
        const plan = plans.find(p => p.id === planId);
        if (plan) {
          setSelectedPlan(plan);
        }
      }
    }
  }, [user, authLoading, plans]);

  // Mock plans for UI testing when Firestore is not available
  const getMockPlans = (): SubscriptionPlan[] => [
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

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Set timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const dataPromise = Promise.all([
        getSubscriptionPlans(),
        user ? getVendorSubscription(user.uid) : Promise.resolve(null),
      ]);

      try {
        const [plansData, subscriptionData] = await Promise.race([
          dataPromise,
          timeoutPromise,
        ]) as [SubscriptionPlan[], VendorSubscription | null];

        // If no plans from Firestore, use mock plans for UI testing
        if (plansData.length === 0) {
          console.log('No plans found in Firestore, using mock plans for UI');
          setPlans(getMockPlans());
        } else {
          setPlans(plansData);
        }
        
        setSubscription(subscriptionData);
      } catch (timeoutError) {
        // Timeout or Firestore error - use mock plans
        console.log('Firestore timeout or error, using mock plans');
        setPlans(getMockPlans());
        setError('Using demo plans. Database connection may be needed for production.');
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
      // Use mock plans if Firestore fails
      setPlans(getMockPlans());
      setError('Using demo plans. Database connection may be needed for production.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Allow viewing plans without login, but require login for payment
    if (!authLoading) {
      loadData();
    }
  }, [user, authLoading]);

  // Redirect to login if trying to pay without being logged in
  const handlePaymentClick = async () => {
    if (!user) {
      router.push('/vendor/login');
      return;
    }
    await handlePayment();
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setError(null);
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    if (!user) {
      setError('Please log in to proceed with payment');
      // Optionally redirect to login
      // router.push('/login');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Create Razorpay order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          vendorId: user.uid,
          vendorEmail: user.email || undefined,
          vendorName: user.displayName || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderData = await response.json();

      // Check if test mode
      const isTestMode = orderData.testMode || orderData.key?.includes('dummy') || orderData.key?.includes('test');

      // Initialize Razorpay
      const options: any = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Rentorent',
        description: `Subscription: ${selectedPlan.name}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                vendorId: user.uid,
                planId: selectedPlan.id,
                vendorEmail: user.email || undefined,
                vendorName: user.displayName || undefined,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            // Reload subscription data
            await loadData();
            setSelectedPlan(null);
            
            // Show success message
            alert('Subscription activated successfully!');
          } catch (error: any) {
            console.error('Payment verification error:', error);
            setError(error.message || 'Payment verification failed');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          email: user.email || '',
          name: user.displayName || '',
        },
        theme: {
          color: '#DC2626',
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          },
        },
      };

      // In test mode with dummy credentials, simulate payment
      if (isTestMode && orderData.key?.includes('dummy')) {
        console.log('🧪 TEST MODE: Simulating payment...');
        
        // Simulate payment after 2 seconds
        setTimeout(async () => {
          try {
            const mockResponse = {
              razorpay_order_id: orderData.orderId,
              razorpay_payment_id: `pay_test_${Date.now()}`,
              razorpay_signature: 'test_signature_dummy',
            };

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
                vendorId: user.uid,
                planId: selectedPlan.id,
                vendorEmail: user.email || undefined,
                vendorName: user.displayName || undefined,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            // Reload subscription data
            await loadData();
            setSelectedPlan(null);
            
            // Show success message
            alert('✅ Test Payment Successful! Subscription activated. (This was a test payment)');
          } catch (error: any) {
            console.error('Test payment error:', error);
            setError(error.message || 'Test payment failed');
          } finally {
            setProcessing(false);
          }
        }, 2000);

        // Show test mode message
        alert('🧪 TEST MODE: Payment will be simulated. No real payment will be processed.');
        return;
      }

      // Use real Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment');
      setProcessing(false);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  if (authLoading) {
    return (
      <div className="min-h-screen bg-black">
        <VendorNavbar />
        <div className="max-w-7xl mx-auto px-4 py-12 pt-32">
          <div className="text-center text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <VendorNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Pricing</h1>
          <p className="text-xl text-gray-400">
            Simple pricing for everyone.
          </p>
          <p className="text-gray-500 mt-4">
            Choose an <span className="font-semibold text-white">affordable plan</span> that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}


        {/* Subscription Plans */}
        <div id="plans-section" className="mb-8">
          {subscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <SubscriptionStatus 
                subscription={subscription} 
                onRenew={() => {
                  setSelectedPlan(null);
                  document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl font-semibold text-white mb-6 text-center"
          >
            {subscription ? 'Upgrade or Change Plan' : 'Select a Plan'}
          </motion.h2>
          {loading && plans.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 animate-pulse">
                  <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-800 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6 mb-6"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gray-800 rounded"></div>
                    <div className="h-3 bg-gray-800 rounded"></div>
                    <div className="h-3 bg-gray-800 rounded w-4/5"></div>
                  </div>
                  <div className="h-12 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <SubscriptionPlans
              plans={plans}
              onSelectPlan={handleSelectPlan}
              currentPlanId={subscription?.planId}
              loading={processing}
            />
          )}
        </div>

        {/* Payment Button */}
        {selectedPlan && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#0F0F0F] border-t border-white/10 p-6 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Selected Plan</p>
                <p className="text-white font-semibold">{selectedPlan.name} - ₹{selectedPlan.amount}</p>
                {!user && (
                  <p className="text-yellow-400 text-xs mt-1">Please log in to proceed</p>
                )}
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handlePaymentClick}
                disabled={processing}
              >
                {processing ? 'Processing...' : !user ? 'Login to Pay' : `Pay ₹${selectedPlan.amount}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


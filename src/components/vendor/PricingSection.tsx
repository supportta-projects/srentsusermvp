'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSubscriptionPlans } from '@/lib/subscriptions';
import { SubscriptionPlan } from '@/types';

interface PricingSectionProps {}

export default function PricingSection({}: PricingSectionProps) {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const plansData = await getSubscriptionPlans();
      setPlans(plansData.length > 0 ? plansData : getMockPlans());
    } catch (error) {
      console.error('Error loading plans:', error);
      setPlans(getMockPlans());
    } finally {
      setLoading(false);
    }
  };

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
      amount: 6300, // ₹35/day * 180 days
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

  const getDailyPrice = (plan: SubscriptionPlan) => {
    return Math.round(plan.amount / plan.duration);
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pricing</h2>
          <p className="text-xl text-gray-400 mb-8">
            Simple pricing for everyone.
          </p>
          <p className="text-gray-500 mb-6">
            Choose an <span className="font-semibold text-white">affordable plan</span> that fits your business needs. All plans include full access to all features.
          </p>
          
          {/* Price Highlight Badge - Magic UI Premium Design */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.01, y: -4 }}
            className="relative group inline-block mb-12"
          >
            {/* Subtle gradient glow */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-[#DC2626]/15 via-[#EF4444]/10 to-[#DC2626]/15 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-700"
            />
            
            {/* Main container - Magic UI glassmorphism */}
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-white/[0.01] backdrop-blur-sm md:backdrop-blur-xl px-8 py-6 sm:px-10 sm:py-8"
              style={{
                boxShadow: `
                  0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                  0 8px 32px rgba(0, 0, 0, 0.4),
                  0 2px 8px rgba(220, 38, 38, 0.1),
                  inset 0 1px 1px rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-6">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-full w-fit mx-auto sm:mx-0"
                >
                  <span className="text-[#DC2626] text-xs font-semibold">✨ BEST VALUE</span>
                </motion.div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 50%, #e5e7eb 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.2))',
                    }}
                  >
                    ₹27
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-400"
                  >
                    /day
                  </motion.span>
                </div>
                
                {/* Divider */}
                <div className="hidden sm:block w-px h-10 bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
                
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center sm:text-left"
                >
                  <p className="text-sm sm:text-base text-gray-300 font-medium">
                    Complete rental software
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    1 year plan • All features included
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <span className="text-sm text-gray-400">✓ 30-day money-back guarantee</span>
            <span className="text-sm text-gray-400">✓ Cancel anytime, no questions asked</span>
            <span className="text-sm text-gray-400">✓ No setup fees</span>
          </div>
        </motion.div>

        {/* Pricing Cards - Premium & Smooth Design */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 animate-pulse gpu-accelerated">
                <div className="h-6 bg-white/10 rounded w-1/2 mb-4" />
                <div className="h-8 bg-white/10 rounded w-3/4 mb-8" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded" />
                  <div className="h-4 bg-white/10 rounded" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => {
              const dailyPrice = getDailyPrice(plan);
              const isBestValue = plan.duration === 365;
              const isPopular = plan.duration === 180;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.7, 
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.03,
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                  }}
                  className={`relative bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border rounded-3xl p-8 lg:p-10 transition-all duration-500 hover:shadow-2xl gpu-accelerated ${
                    isBestValue 
                      ? 'border-[#DC2626]/60 shadow-2xl shadow-[#DC2626]/20 scale-105 md:scale-100' 
                      : isPopular
                      ? 'border-[#DC2626]/40 hover:border-[#DC2626]/60 hover:shadow-xl hover:shadow-[#DC2626]/10'
                      : 'border-white/10 hover:border-white/20 hover:shadow-xl'
                  }`}
                  style={{
                    boxShadow: isBestValue 
                      ? '0 25px 60px rgba(220, 38, 38, 0.25), 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {/* Badge */}
                  {isPopular && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      <span className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </motion.div>
                  )}
                  {isBestValue && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      <span className="bg-gradient-to-r from-[#10B981] to-[#34D399] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                        Best Value ✨
                      </span>
                    </motion.div>
                  )}
                  
                  {/* Glow effect for best value */}
                  {isBestValue && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/5 to-transparent rounded-3xl pointer-events-none" />
                  )}
                  
                  <div className="relative z-10">
                    <div className="mb-6">
                      <h3 className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                      
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white via-white to-gray-200 bg-clip-text text-transparent">
                            ₹{plan.amount.toLocaleString()}
                          </span>
                          <span className="text-gray-400 text-lg">
                            {plan.duration === 30 ? '/ month' : plan.duration === 180 ? '/ 6 months' : '/ year'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Only</span>
                            <span className={`text-lg font-bold ${dailyPrice <= 27 ? 'text-[#DC2626]' : dailyPrice <= 35 ? 'text-[#F59E0B]' : 'text-gray-300'}`}>
                              ₹{dailyPrice}/day
                            </span>
                            {isBestValue && (
                              <span className="text-[#10B981] text-xs font-semibold bg-[#10B981]/10 px-2 py-0.5 rounded-full">
                                Best Deal
                              </span>
                            )}
                          </div>
                          {plan.duration === 30 && (
                            <div className="text-xs text-gray-500">
                              Save ₹2,694 with 6-month plan
                            </div>
                          )}
                          {plan.duration === 180 && (
                            <div className="text-xs text-gray-500">
                              Save ₹3,699 with yearly plan
                            </div>
                          )}
                          {plan.duration === 365 && (
                            <div className="text-xs text-[#10B981] font-medium">
                              Save ₹7,989 vs monthly • Best value
                            </div>
                          )}
                        </div>
                      </div>

                      <motion.button
                        onClick={() => {
                          // Redirect to profile page
                          router.push(`/vendor/subscribe/profile?plan=${plan.id}`);
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-6 py-4 text-white font-semibold rounded-xl transition-all duration-300 gpu-accelerated ${
                          isBestValue
                            ? 'bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] shadow-lg shadow-[#DC2626]/30'
                            : isPopular
                            ? 'bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] shadow-md shadow-[#DC2626]/20'
                            : 'bg-[#DC2626] hover:bg-[#B91C1C]'
                        }`}
                        style={{
                          boxShadow: isBestValue 
                            ? '0 10px 30px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                            : '0 4px 16px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        Subscribe Now
                      </motion.button>
                    </div>

                    <div className="border-t border-white/10 pt-6 space-y-4">
                      {plan.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.5 + idx * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className="mt-0.5">
                            <Check className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


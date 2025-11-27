'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Monitor, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface TrainingSectionProps {}

type TrainingMode = 'online' | 'onsite';

interface TrainingPlan {
  id: string;
  duration: string;
  amount: number;
  description: string;
  features: string[];
  sessions: string;
  isPopular?: boolean;
  isBestValue?: boolean;
}

export default function TrainingSection({}: TrainingSectionProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeMode, setActiveMode] = useState<TrainingMode>('online');

  const onlinePlans: TrainingPlan[] = [
    {
      id: 'online-1day',
      duration: '1 Day',
      amount: 2999,
      description: 'Quick introduction to master the basics',
      sessions: 'Full day session',
      features: [
        'Live interactive online session',
        'Recorded video access (30 days)',
        'Training materials included',
        'Certificate of completion',
        'Email support during training',
        'Basic hands-on practice',
      ],
    },
    {
      id: 'online-2days',
      duration: '2 Days',
      amount: 5999,
      description: 'Comprehensive training over 2 days',
      sessions: '2 full day sessions',
      features: [
        'Live interactive sessions (2 days)',
        'Recorded video lessons',
        'All training materials',
        'Certificate of completion',
        '30-day access to recordings',
        'Email & chat support',
        'Practical assignments',
        'Dedicated trainer support',
      ],
      isPopular: true,
    },
    {
      id: 'online-3days',
      duration: '3 Days',
      amount: 7999,
      description: 'Complete mastery program with advanced topics',
      sessions: '3 full day sessions',
      features: [
        'Live interactive sessions (3 days)',
        'Complete recorded video library',
        'All training materials & resources',
        'Certificate of completion',
        '60-day access to recordings',
        'Priority email & chat support',
        'Advanced assignments & projects',
        '1-on-1 trainer consultation',
        'Post-training support (30 days)',
      ],
      isBestValue: true,
    },
  ];

  const onsitePlans: TrainingPlan[] = [
    {
      id: 'onsite-halfday',
      duration: 'Half Day',
      amount: 5999,
      description: 'Quick onsite session at your location',
      sessions: 'Half day session',
      features: [
        'In-person half-day training',
        'Hands-on practical sessions',
        'Personalized guidance',
        'Certificate of completion',
        'Training materials included',
        'Immediate Q&A support',
      ],
    },
    {
      id: 'onsite-1day',
      duration: '1 Day',
      amount: 8999,
      description: 'Full day intensive training onsite',
      sessions: 'Full day session',
      features: [
        'In-person full day training',
        'Hands-on practical sessions',
        'Personalized guidance & support',
        'Certificate of completion',
        'Training materials included',
        'Networking opportunities',
        'Post-training support (15 days)',
        'Real-world project training',
      ],
      isPopular: true,
    },
    {
      id: 'onsite-3days',
      duration: '3 Days',
      amount: 12999,
      description: 'Complete 3-day comprehensive onsite program',
      sessions: '3 full day sessions',
      features: [
        'In-person classroom training (3 days)',
        'Extensive hands-on practical sessions',
        'Personalized guidance & mentorship',
        'Certificate of completion',
        'Complete training materials package',
        'Networking opportunities',
        'Post-training support (30 days)',
        'Real-world project training',
        'Team collaboration exercises',
        'Custom training tailored to your needs',
      ],
      isBestValue: true,
    },
  ];

  const activePlans = activeMode === 'online' ? onlinePlans : onsitePlans;

  const handleEnroll = (planId: string) => {
    if (!user && !authLoading) {
      router.push(`/register?plan=${planId}&redirect=training`);
    } else if (user) {
      router.push(`/training/enroll?type=${planId}`);
    }
  };

  return (
    <section 
      id="training" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F] scroll-mt-20"
      style={{
        scrollMarginTop: '80px',
        WebkitScrollMarginTop: '80px',
      } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Training Programs</h2>
          <p className="text-xl text-gray-400 mb-8">
            Master the rental management software with our comprehensive training programs
          </p>
          <p className="text-gray-500 mb-6">
            Choose between <span className="font-semibold text-white">online</span> or <span className="font-semibold text-white">onsite</span> training with flexible duration options to suit your learning style and schedule.
          </p>
        </motion.div>

        {/* Mode Toggle Switch - Professional Design */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl">
            {/* Animated Background Slider */}
            <motion.div
              className="absolute inset-y-1 bg-[#DC2626] rounded-xl"
              initial={false}
              animate={{
                left: activeMode === 'online' ? '4px' : '50%',
                width: 'calc(50% - 4px)',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              style={{
                right: 'auto',
              }}
            />
            
            {/* Online Button */}
            <button
              type="button"
              onClick={() => setActiveMode('online')}
              className={`relative z-10 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                activeMode === 'online'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              aria-pressed={activeMode === 'online'}
            >
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                <span>Online</span>
              </span>
            </button>
            
            {/* Onsite Button */}
            <button
              type="button"
              onClick={() => setActiveMode('onsite')}
              className={`relative z-10 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                activeMode === 'onsite'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              aria-pressed={activeMode === 'onsite'}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Onsite</span>
              </span>
            </button>
          </div>
        </div>

        {/* Training Plans Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid md:grid-cols-3 gap-6 lg:gap-8"
          >
            {activePlans.map((plan, index) => {
              const isBestValue = plan.isBestValue;
              const isPopular = plan.isPopular;
              
              return (
                <motion.div
                  key={`${activeMode}-${plan.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.03,
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                  }}
                  className={`relative bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border rounded-3xl p-8 lg:p-10 transition-all duration-500 hover:shadow-2xl gpu-accelerated flex flex-col ${
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
                    WebkitFontSmoothing: 'antialiased',
                    WebkitTextSizeAdjust: '100%',
                  }}
                >
                  {/* Glow effect for best value */}
                  {isBestValue && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/5 to-transparent rounded-3xl pointer-events-none" />
                  )}
                  
                  <div className="relative z-10 flex flex-col flex-1 min-h-0">
                    {/* Badge - Safari-safe rendering */}
                    {isBestValue && (
                      <div className="mb-4 min-h-[28px]">
                        <span className="inline-block bg-gradient-to-r from-[#10B981] to-[#34D399] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                          Best Value ✨
                        </span>
                      </div>
                    )}
                    {isPopular && !isBestValue && (
                      <div className="mb-4 min-h-[28px]">
                        <span className="inline-block bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}
                    {/* Header Section */}
                    <div className="mb-6">
                      <h3 className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {plan.duration}
                      </h3>
                      <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                      
                      {/* Price Section */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white via-white to-gray-200 bg-clip-text text-transparent">
                            ₹{plan.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {plan.sessions}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={() => handleEnroll(plan.id)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-6 py-4 text-white font-semibold rounded-xl transition-all duration-300 gpu-accelerated mb-6 ${
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
                        Enroll Now
                      </motion.button>
                    </div>

                    {/* Features List */}
                    <div className="border-t border-white/10 pt-6 space-y-4 flex-1">
                      {plan.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3"
                        >
                          <div className="mt-0.5">
                            <Check className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <span className="text-sm text-gray-400">✓ Certificate included</span>
            <span className="text-sm text-gray-400">✓ Money-back guarantee</span>
            <span className="text-sm text-gray-400">✓ Lifetime material access</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


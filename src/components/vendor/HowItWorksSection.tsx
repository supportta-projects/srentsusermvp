'use client';

import { motion } from 'framer-motion';
import { UserPlus, CheckCircle, CreditCard, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your account in 2 minutes. Just provide your basic details like name, email, phone, and shop information.',
    time: '2 minutes',
    color: 'from-[#DC2626]/20 to-[#B91C1C]/10',
  },
  {
    icon: CheckCircle,
    title: 'Get Approved',
    description: 'Admin reviews your details and documents. Usually approved within 24 hours. You\'ll receive an email notification once approved.',
    time: 'Usually 24 hours',
    color: 'from-[#10B981]/20 to-[#059669]/10',
  },
  {
    icon: CreditCard,
    title: 'Subscribe',
    description: 'Choose a plan that fits your needs. Monthly, 6-month, or yearly options available. Secure payment via Razorpay.',
    time: '5 minutes',
    color: 'from-[#3B82F6]/20 to-[#2563EB]/10',
  },
  {
    icon: Rocket,
    title: 'Start Managing',
    description: 'Add products, track orders, manage customers, and grow your rental business. Everything you need is at your fingertips.',
    time: 'Immediate',
    color: 'from-[#8B5CF6]/20 to-[#7C3AED]/10',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get started with RentOrent in just 4 simple steps. From registration to managing your business, we've made it easy.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[#DC2626]/20 via-[#10B981]/20 via-[#3B82F6]/20 to-[#8B5CF6]/20" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="relative"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {index + 1}
                  </div>

                  {/* Card */}
                  <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 pt-10 hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} border border-white/10 flex items-center justify-center mb-4 mx-auto`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 text-center">
                      {step.description}
                    </p>
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                        <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                        {step.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            Ready to get started? It only takes a few minutes.
          </p>
          <motion.a
            href="/vendor/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/50 gpu-accelerated"
          >
            Start Your Free Trial
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}


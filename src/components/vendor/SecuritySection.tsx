'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Database, CheckCircle } from 'lucide-react';

const securityFeatures = [
  {
    icon: Shield,
    title: 'SSL Encrypted',
    description: 'All data is encrypted in transit using industry-standard SSL/TLS encryption. Your information is always secure.',
    color: 'from-[#DC2626]/20 to-[#B91C1C]/10',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Powered by Razorpay, one of India\'s most trusted payment gateways. PCI DSS compliant and secure.',
    color: 'from-[#3B82F6]/20 to-[#2563EB]/10',
  },
  {
    icon: Database,
    title: 'Data Backup',
    description: 'Daily automated backups ensure your data is never lost. All backups are encrypted and stored securely.',
    color: 'from-[#10B981]/20 to-[#059669]/10',
  },
  {
    icon: CheckCircle,
    title: 'GDPR Compliant',
    description: 'Your data is protected according to GDPR standards. We respect your privacy and data ownership rights.',
    color: 'from-[#8B5CF6]/20 to-[#7C3AED]/10',
  },
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
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
            Your Data is Safe with Us
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We take security seriously. Your business data and customer information are protected with enterprise-grade security.
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} border border-white/10 flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
            SSL Encrypted
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
            PCI Compliant
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
            GDPR Ready
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
            Daily Backups
          </div>
        </motion.div>
      </div>
    </section>
  );
}


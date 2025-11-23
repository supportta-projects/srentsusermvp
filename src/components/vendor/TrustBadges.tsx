'use client';

import { motion } from 'framer-motion';
import { Users, Shield, CreditCard, Clock, CheckCircle } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: Users,
      text: 'Join 8+ Active Vendors',
      description: 'Growing community',
      color: '#DC2626',
    },
    {
      icon: Shield,
      text: '99.9% Uptime',
      description: 'Reliable & secure',
      color: '#10B981',
    },
    {
      icon: CreditCard,
      text: 'Secure Payment',
      description: 'Razorpay powered',
      color: '#3B82F6',
    },
    {
      icon: Clock,
      text: '24/7 Support',
      description: 'Always available',
      color: '#F59E0B',
    },
    {
      icon: CheckCircle,
      text: '30-Day Money-Back',
      description: 'Full refund guarantee',
      color: '#8B5CF6',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="w-full mt-8"
    >
      {/* Desktop: Horizontal Layout - Icon Left, Text Right */}
      <div className="hidden lg:flex items-center gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: 0.7 + index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                y: -2,
                transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
              }}
              className="group relative flex-1"
            >
              <div 
                className="relative rounded-xl px-4 py-3.5 flex items-center gap-4 transition-all duration-300 gpu-accelerated"
                style={{
                  background: 'rgba(26, 26, 26, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(31, 31, 31, 0.7)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(26, 26, 26, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04)';
                }}
              >
                {/* Icon - Left Side, Consistent Size */}
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundColor: `${badge.color}12`,
                    border: `1px solid ${badge.color}25`,
                  }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: badge.color }}
                  />
                </div>

                {/* Text Content - Right Side, Horizontal Layout */}
                <div className="flex flex-col items-start justify-center gap-0.5 flex-1 min-w-0">
                  <span className="text-sm font-medium text-white leading-tight whitespace-nowrap">
                    {badge.text}
                  </span>
                  <span className="text-xs text-gray-400 leading-tight whitespace-nowrap">
                    {badge.description}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tablet: 2x2 Grid - Vertical Layout */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-3 w-full px-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.4, 
                delay: 0.7 + index * 0.05,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="group relative"
            >
              <div 
                className="relative bg-[#1A1A1A] border rounded-lg px-4 py-3.5 flex flex-col items-center gap-2.5 transition-all duration-300 gpu-accelerated"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Icon */}
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${badge.color}15`,
                    border: `1px solid ${badge.color}30`,
                  }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: badge.color }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center gap-0.5 w-full text-center">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {badge.text}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: 1x1 Grid - Vertical Layout */}
      <div className="grid md:hidden grid-cols-2 sm:grid-cols-3 gap-3 px-4">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.4, 
                delay: 0.7 + index * 0.05,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="group relative"
            >
              <div 
                className="relative bg-[#1A1A1A] border rounded-lg px-4 py-3.5 flex flex-col items-center gap-2.5 transition-all duration-300 gpu-accelerated"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Icon */}
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${badge.color}15`,
                    border: `1px solid ${badge.color}30`,
                  }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: badge.color }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center gap-0.5 w-full text-center">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {badge.text}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}


'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import TrustBadges from './TrustBadges';

interface VendorHeroProps {
  onGetStarted?: () => void;
}

export default function VendorHero({ onGetStarted }: VendorHeroProps) {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden gpu-accelerated">
      {/* Background Gradient - Safari optimized */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#DC2626]/10 via-transparent to-transparent gpu-accelerated" />
      
      {/* Floating gradient orbs - CSS optimized (disabled on mobile) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#DC2626]/20 to-[#B91C1C]/10 rounded-full blur-3xl animate-float-orb" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-bl from-[#EF4444]/15 to-[#DC2626]/20 rounded-full blur-3xl animate-float-orb" style={{ animationDelay: '10s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 gpu-accelerated animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="text-[#DC2626]">✨</span>
              <span>Complete Rental Management Software</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <span className="text-white">Manage Your Rental Business</span>
              <br />
              <span className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Complete inventory, order, and customer management software built specifically for rental shops. 
              <br className="hidden sm:block" />
              Track everything in one place and grow your business effortlessly.
            </p>

            {/* Price Highlight - Magic UI Premium Design */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.01, y: -4 }}
              className="relative group"
            >
              {/* Subtle gradient glow */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-[#DC2626]/15 via-[#EF4444]/10 to-[#DC2626]/15 rounded-3xl blur-xl opacity-40 group-hover:opacity-50 transition-opacity duration-700"
              />
              
              {/* Main container - Magic UI glassmorphism */}
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-white/[0.01] backdrop-blur-sm md:backdrop-blur-2xl p-8 sm:p-10"
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
                <div className="relative z-10">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-full"
                  >
                    <span className="text-[#DC2626] text-xs font-semibold">✨ BEST VALUE</span>
                  </motion.div>

                  {/* Price Display */}
                  <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 mb-6">
                    <div className="flex items-baseline gap-2 mb-2 sm:mb-0">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.65 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
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
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-400"
                      >
                        /day
                      </motion.span>
                    </div>
                    
                    {/* Divider */}
                    <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-white/20 via-white/10 to-transparent self-center" />
                    
                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.75 }}
                      className="flex flex-col justify-end"
                    >
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                        Complete rental management software
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        1 year plan • All features included
                      </p>
                    </motion.div>
                  </div>

                  {/* Features Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/[0.08]"
                  >
                    {[
                      { icon: '✓', text: 'All features' },
                      { icon: '✓', text: 'No hidden costs' },
                      { icon: '✓', text: '30-day guarantee' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.85 + idx * 0.1 }}
                        className="flex items-center gap-2 text-xs sm:text-sm text-gray-400"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#10B981] text-[10px] font-bold">{item.icon}</span>
                        </span>
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons - Premium Material Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <motion.button
                onClick={() => {
                  const scrollToPricing = () => {
                    const pricingSection = document.getElementById('pricing');
                    if (!pricingSection) {
                      setTimeout(scrollToPricing, 100);
                      return;
                    }
                    
                    // Simple, reliable method that works on all devices
                    const offset = 80;
                    const rect = pricingSection.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
                    const targetPosition = scrollTop + rect.top - offset;
                    
                    window.scrollTo({
                      top: Math.max(0, targetPosition),
                      behavior: 'smooth',
                    });
                  };
                  
                  scrollToPricing();
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-[#DC2626] to-[#EF4444] text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 gpu-accelerated"
                style={{
                  boxShadow: '0 10px 40px rgba(220, 38, 38, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative text-base sm:text-lg font-semibold tracking-wide">
                  Get Started
                </span>
                <motion.div
                  className="relative"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
              </motion.button>

              {/* Pricing Button */}
              <motion.button
                onClick={() => {
                  const scrollToPricing = () => {
                    const pricingSection = document.getElementById('pricing');
                    if (!pricingSection) {
                      setTimeout(scrollToPricing, 100);
                      return;
                    }
                    
                    // Wait a bit for all lazy-loaded sections to render
                    setTimeout(() => {
                      const navbarHeight = 80;
                      // Use offsetTop which is relative to offsetParent (usually body)
                      const elementTop = pricingSection.offsetTop;
                      const targetScroll = elementTop - navbarHeight;
                      
                      window.scrollTo({
                        top: Math.max(0, targetScroll),
                        behavior: 'smooth',
                      });
                    }, 150);
                  };
                  
                  scrollToPricing();
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 sm:px-10 sm:py-5 bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 gpu-accelerated backdrop-blur-sm"
                style={{
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative text-base sm:text-lg font-semibold tracking-wide">
                  View Pricing
                </span>
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <TrustBadges />
          </div>

          {/* Right Hero Image - Business Dashboard */}
          <div className="relative gpu-accelerated animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Rental Dashboard SVG */}
              <img
                src="/svg/rentalDashboard.svg"
                alt="Rental Business Dashboard"
                className="w-full h-full object-contain rounded-3xl border border-white/10 shadow-2xl"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


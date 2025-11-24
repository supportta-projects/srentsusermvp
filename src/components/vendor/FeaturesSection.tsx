'use client';

import { useEffect, useRef } from 'react';
import { Package, ShoppingCart, Users, UserCog, BarChart3, Smartphone } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track all your rental items in one place. Add products, set availability, manage stock levels, and never lose track of your equipment.',
    image: '/svg/InventoryOverview.svg',
    mobileImage: '/png/InventoryOverview.png',
    color: 'from-[#DC2626]/20 to-[#B91C1C]/10',
    iconColor: 'bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]',
    isSvg: true,
  },
  {
    icon: ShoppingCart,
    title: 'Order Management',
    description: 'Handle bookings, returns, and payments seamlessly. Track order status, manage rental periods, and process payments all in one dashboard.',
    image: '/svg/OrdersManagement.svg',
    mobileImage: '/png/OrdersManagement.png',
    color: 'from-[#3B82F6]/20 to-[#2563EB]/10',
    iconColor: 'bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6]',
    isSvg: true,
  },
  {
    icon: Users,
    title: 'Customer Database',
    description: 'Store customer details and rental history. Build lasting relationships with your customers by tracking their preferences and rental patterns.',
    image: '/svg/InventoryOverview.svg',
    mobileImage: '/png/RentalDashboard.png',
    color: 'from-[#10B981]/20 to-[#059669]/10',
    iconColor: 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]',
    isSvg: true,
  },
  {
    icon: UserCog,
    title: 'Staff Management',
    description: 'Manage multiple staff members and branches. Assign roles, track permissions, and ensure your team has the right access to manage operations.',
    image: '/svg/OrdersManagement.svg',
    mobileImage: '/png/InventoryOverview.png',
    color: 'from-[#8B5CF6]/20 to-[#7C3AED]/10',
    iconColor: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]',
    isSvg: true,
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Real-time insights into your business performance. Track revenue, popular products, customer trends, and make data-driven decisions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80',
    color: 'from-[#F59E0B]/20 to-[#D97706]/10',
    iconColor: 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]',
    isSvg: false,
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Access your dashboard from any device. Manage your rental business on the go with our fully responsive design that works on phones, tablets, and desktops.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&q=80',
    color: 'from-[#EC4899]/20 to-[#DB2777]/10',
    iconColor: 'bg-[#EC4899]/10 border-[#EC4899]/30 text-[#EC4899]',
    isSvg: false,
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => observer.observe(card));

    return () => {
      cards?.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-10 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 bg-black" data-variant="single">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2.5 sm:mb-4 leading-tight px-1">
            Everything You Need to Manage Your Rental Business
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-400 max-w-2xl mx-auto px-3 leading-relaxed">
            Powerful features designed specifically for rental shops. All included in every plan.
          </p>
        </div>

        {/* Features Grid - Modern Mobile Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8" data-debug="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card animate-on-scroll group relative overflow-hidden transition-all duration-300 gpu-accelerated touch-manipulation border border-white/8 rounded-2xl sm:rounded-2xl lg:rounded-3xl active:scale-[0.98] sm:hover:shadow-2xl sm:hover:shadow-black/50 sm:hover:-translate-y-1 sm:hover:scale-[1.02] bg-[#0F0F0F]"
                data-card-index={index}
                data-card-title={feature.title}
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Subtle inner glow on mobile for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none sm:hidden rounded-2xl" />
                
                {/* Gradient Overlay on Hover - Desktop Only */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 rounded-2xl sm:rounded-2xl lg:rounded-3xl`} />
                
                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Image Section - Clean Modern Design */}
                  <div className="relative w-full h-[200px] sm:h-[220px] md:h-[240px] lg:h-[280px] overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#000000] sm:from-[#0F0F0F] sm:via-[#0F0F0F] sm:to-[#000000]">
                    {/* Mobile Image - Centered and clean */}
                    {feature.mobileImage && (
                      <div className="w-full h-full flex items-center justify-center p-5 md:hidden">
                        <img
                          src={feature.mobileImage}
                          alt={feature.title}
                          className="w-full h-full object-contain object-center max-h-full transition-transform duration-500 ease-out"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}
                    {/* Desktop Image - SVG/Unsplash */}
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className={`w-full h-full ${
                        feature.isSvg 
                          ? 'hidden md:block object-contain object-center p-4 sm:p-5 md:p-6 lg:p-8' 
                          : 'hidden md:block object-cover'
                      } sm:group-hover:scale-110 transition-transform duration-700 ease-out`}
                      loading="lazy"
                      decoding="async"
                    />
                    
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Content Section - Clean Minimal Layout */}
                  <div className="flex-1 flex flex-col p-5 sm:p-6 lg:p-7">
                    {/* Icon - Modern Minimal Style */}
                    <div className="mb-4 sm:mb-5">
                      <div className={`inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${feature.iconColor.replace('border-2', 'border')} border shadow-md sm:shadow-lg transition-all duration-300`}>
                        <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                    </div>
                    
                    {/* Title - Clean Professional Typography */}
                    <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 leading-tight group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    {/* Description - Modern Readable Spacing */}
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-1">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Modern Accent Line - Subtle bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Note - Mobile Optimized */}
        <div className="mt-10 sm:mt-12 lg:mt-16 text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-xs sm:text-sm lg:text-base text-gray-400 px-3 leading-relaxed">
            All features are included in every plan. No hidden costs, no feature restrictions.
          </p>
        </div>
      </div>
    </section>
  );
}


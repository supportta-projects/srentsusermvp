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
    isSvg: true,
  },
  {
    icon: ShoppingCart,
    title: 'Order Management',
    description: 'Handle bookings, returns, and payments seamlessly. Track order status, manage rental periods, and process payments all in one dashboard.',
    image: '/svg/OrdersManagement.svg',
    mobileImage: '/png/OrdersManagement.png',
    color: 'from-[#3B82F6]/20 to-[#2563EB]/10',
    isSvg: true,
  },
  {
    icon: Users,
    title: 'Customer Database',
    description: 'Store customer details and rental history. Build lasting relationships with your customers by tracking their preferences and rental patterns.',
    image: '/svg/InventoryOverview.svg',
    mobileImage: '/png/RentalDashboard.png',
    color: 'from-[#10B981]/20 to-[#059669]/10',
    isSvg: true,
  },
  {
    icon: UserCog,
    title: 'Staff Management',
    description: 'Manage multiple staff members and branches. Assign roles, track permissions, and ensure your team has the right access to manage operations.',
    image: '/svg/OrdersManagement.svg',
    mobileImage: '/png/InventoryOverview.png',
    color: 'from-[#8B5CF6]/20 to-[#7C3AED]/10',
    isSvg: true,
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Real-time insights into your business performance. Track revenue, popular products, customer trends, and make data-driven decisions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80',
    color: 'from-[#F59E0B]/20 to-[#D97706]/10',
    isSvg: false,
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Access your dashboard from any device. Manage your rental business on the go with our fully responsive design that works on phones, tablets, and desktops.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&q=80',
    color: 'from-[#EC4899]/20 to-[#DB2777]/10',
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
    <section ref={sectionRef} id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to Manage Your Rental Business
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful features designed specifically for rental shops. All included in every plan.
          </p>
        </div>

        {/* Features Grid - Responsive */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card animate-on-scroll group bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated hover:-translate-y-2 hover:scale-[1.02]"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Image - PNG for mobile only, SVG/others for desktop - Full visibility on mobile */}
                <div className="relative min-h-[240px] h-[240px] sm:h-[260px] md:h-56 lg:h-64 overflow-hidden bg-[#0F0F0F]">
                  {/* Mobile Image - PNG with object-contain for full visibility */}
                  {feature.mobileImage && (
                    <img
                      src={feature.mobileImage}
                      alt={feature.title}
                      className="w-full h-full object-contain md:hidden group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  {/* Desktop Image - SVG/Unsplash */}
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className={`w-full h-full ${
                      feature.isSvg 
                        ? 'hidden md:block object-contain p-2 sm:p-3 md:p-4 lg:p-5' 
                        : 'hidden md:block object-cover'
                    } group-hover:scale-110 transition-transform duration-500`}
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                </div>

                {/* Content - Responsive */}
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-2.5 md:p-3 rounded-lg bg-gradient-to-br ${feature.color} border border-white/10 flex-shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight">{feature.title}</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Note */}
        <div className="mt-16 text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-gray-400 text-sm">
            All features are included in every plan. No hidden costs, no feature restrictions.
          </p>
        </div>
      </div>
    </section>
  );
}


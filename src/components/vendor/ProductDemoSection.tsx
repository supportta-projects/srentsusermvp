'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const demoScreens = [
  {
    title: 'Dashboard Overview',
    description: 'Get a complete view of your business at a glance. See active orders, revenue, popular products, and key metrics all in one place.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80',
  },
  {
    title: 'Inventory Management',
    description: 'Manage all your rental products efficiently. Add new items, update availability, set prices, and track stock levels with ease.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&q=80',
  },
  {
    title: 'Order Management',
    description: 'Handle bookings and returns seamlessly. Track order status, manage rental periods, process payments, and keep customers informed.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&q=80',
  },
  {
    title: 'Analytics & Reports',
    description: 'Make data-driven decisions with comprehensive analytics. Track revenue trends, popular products, customer behavior, and business growth.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80',
  },
];

export default function ProductDemoSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % demoScreens.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + demoScreens.length) % demoScreens.length);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See RentOrent in Action
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Take a look at how our dashboard helps you manage your rental business efficiently.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="relative h-[500px] sm:h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-[#1A1A1A]">
            {/* Image */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={demoScreens[currentIndex].image}
                alt={demoScreens[currentIndex].title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </motion.div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 z-10">
              <motion.div
                key={`content-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {demoScreens[currentIndex].title}
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl">
                  {demoScreens[currentIndex].description}
                </p>
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 border border-white/20 rounded-full text-white transition-all z-20 gpu-accelerated"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 border border-white/20 rounded-full text-white transition-all z-20 gpu-accelerated"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {demoScreens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[#DC2626] w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-6 flex gap-4 justify-center overflow-x-auto pb-2">
            {demoScreens.map((screen, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-[#DC2626] scale-110'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <img
                  src={screen.image}
                  alt={screen.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


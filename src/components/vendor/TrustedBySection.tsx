'use client';

import { motion } from 'framer-motion';

const companies = [
  'Camera Scan Kottayam',
  'Camerascan Pala',
  'Camerahub',
  'Rentalsworld',
  'ABC Camera Rentals',
  'Delhi Equipment',
  'TechGear Rentals',
  'Hyderabad Hub',
  'Mumbai Rentals',
  'Bangalore Gear',
];

// Duplicate for seamless loop
const duplicatedCompanies = [...companies, ...companies];

export default function TrustedBySection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black border-y border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            TRUSTED BY RENTAL SHOPS ACROSS INDIA
          </h2>
          <p className="text-gray-500 text-sm">
            Join 8+ rental shops already using RentOrent to manage their business
          </p>
        </motion.div>

        {/* Marquee Animation - Premium Style */}
        <div className="relative py-8 sm:py-12">
          {/* Gradient Overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-black via-black/95 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-black via-black/95 to-transparent z-10 pointer-events-none" />
          
          {/* Marquee Container */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-12 sm:gap-16 md:gap-20 lg:gap-24 items-center"
              animate={{
                x: ['0%', '-50%'], // Move by exactly half (since we duplicated)
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 80, // Slower marquee
                  ease: 'linear',
                },
              }}
            >
              {duplicatedCompanies.map((company, index) => (
                <motion.div
                  key={`${company}-${index}`}
                  className="flex-shrink-0 whitespace-nowrap"
                  whileHover={{
                    scale: 1.05,
                  }}
                >
                  <span
                    className="text-gray-300 font-bold italic text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                    style={{
                      textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '0.03em',
                      fontStyle: 'italic',
                      fontWeight: 800,
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      opacity: 0.85,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.textShadow = '0 4px 30px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.85';
                      e.currentTarget.style.textShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    {company}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface VendorCTAProps {
  onGetStarted: () => void;
}

export default function VendorCTA({ onGetStarted }: VendorCTAProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black gpu-accelerated">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] // Magic UI easing
          }}
          className="space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Ready to Transform Your Rental Business?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400">
            Join 8+ rental shops already using RentOrent to manage their business efficiently.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500 mt-4"
          >
            <span>No credit card required for registration</span>
            <span>•</span>
            <span>30-day money-back guarantee</span>
            <span>•</span>
            <span className="text-[#DC2626] font-semibold text-base">Starting at ₹35/day</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/50 gpu-accelerated"
            >
              Get Started
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


'use client';

import { motion } from 'framer-motion';
import { Mail, Clock, BookOpen, MessageCircle } from 'lucide-react';

export default function SupportSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F]">
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
            We're Here to Help
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get the support you need, when you need it. Our team is dedicated to helping you succeed.
          </p>
        </motion.div>

        {/* Support Channels */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated"
          >
            <div className="w-12 h-12 rounded-xl bg-[#DC2626]/20 border border-[#DC2626]/30 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-[#DC2626]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get help via email
            </p>
            <a
              href="mailto:support@rentorent.com"
              className="text-[#DC2626] hover:text-[#B91C1C] text-sm font-semibold transition-colors"
            >
              support@rentorent.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated"
          >
            <div className="w-12 h-12 rounded-xl bg-[#DC2626]/20 border border-[#DC2626]/30 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-[#DC2626]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Response Time</h3>
            <p className="text-gray-400 text-sm mb-4">
              We aim to respond quickly
            </p>
            <p className="text-[#10B981] text-sm font-semibold">
              Usually within 24 hours
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated"
          >
            <div className="w-12 h-12 rounded-xl bg-[#DC2626]/20 border border-[#DC2626]/30 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[#DC2626]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Documentation</h3>
            <p className="text-gray-400 text-sm mb-4">
              Comprehensive guides
            </p>
            <a
              href="#"
              className="text-[#DC2626] hover:text-[#B91C1C] text-sm font-semibold transition-colors"
            >
              Coming Soon
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated"
          >
            <div className="w-12 h-12 rounded-xl bg-[#DC2626]/20 border border-[#DC2626]/30 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-[#DC2626]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Community</h3>
            <p className="text-gray-400 text-sm mb-4">
              Connect with other vendors
            </p>
            <a
              href="#"
              className="text-[#DC2626] hover:text-[#B91C1C] text-sm font-semibold transition-colors"
            >
              Coming Soon
            </a>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <motion.a
            href="mailto:support@rentorent.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/50 gpu-accelerated"
          >
            Need Help? Contact Support
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}


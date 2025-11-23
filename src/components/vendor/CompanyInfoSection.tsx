'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Mail, Phone, Users } from 'lucide-react';

export default function CompanyInfoSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F]">
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
            About RentOrent
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Building the future of rental business management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Company Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                At RentOrent, we're dedicated to helping rental businesses thrive in the digital age. 
                We understand the challenges of managing inventory, orders, and customers, and we've 
                built a comprehensive solution that makes it easy.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Why Choose Us</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-[#DC2626] mt-1">✓</span>
                  <span>Built specifically for rental businesses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DC2626] mt-1">✓</span>
                  <span>Affordable pricing starting at ₹35/day</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DC2626] mt-1">✓</span>
                  <span>24/7 support and regular updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DC2626] mt-1">✓</span>
                  <span>Secure, reliable, and easy to use</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#DC2626]/20 border border-[#DC2626]/30">
                  <Calendar className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Founded</p>
                  <p className="text-white font-semibold">2024</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#DC2626]/20 border border-[#DC2626]/30">
                  <MapPin className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Location</p>
                  <p className="text-white font-semibold">India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#DC2626]/20 border border-[#DC2626]/30">
                  <Mail className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <a
                    href="mailto:info@supporttasolutions.com"
                    className="text-white font-semibold hover:text-[#DC2626] transition-colors"
                  >
                    info@supporttasolutions.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#DC2626]/20 border border-[#DC2626]/30">
                  <Phone className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <a
                    href="tel:+918590377418"
                    className="text-white font-semibold hover:text-[#DC2626] transition-colors"
                  >
                    +91 8590377418
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-[#DC2626]/20 border border-[#DC2626]/30">
                  <Users className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Team</p>
                  <p className="text-white font-semibold">Dedicated Support Team</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import RentOrentLogo from './RentOrentLogo';

export default function VendorFooter() {
  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'FAQ', href: '#faq' },
    ],
    support: [
      { label: 'Contact Support', href: 'mailto:info@supporttasolutions.com' },
      { label: 'Documentation', href: '#' },
      { label: 'Help Center', href: '#' },
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Security', href: '#security' },
      { label: 'Contact', href: 'mailto:info@supporttasolutions.com' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  };

  return (
    <footer className="bg-[#0F0F0F] border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 gpu-accelerated">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <RentOrentLogo size="md" />
              <p className="text-gray-400 text-sm mb-4 mt-2">
                Complete rental business management software. Manage inventory, orders, customers, and staff all in one place.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-gray-500">Email:</span>{' '}
                  <a href="mailto:info@supporttasolutions.com" className="text-[#DC2626] hover:text-[#B91C1C] transition-colors">
                    info@supporttasolutions.com
                  </a>
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Phone:</span>{' '}
                  <a href="tel:+918590377418" className="text-[#DC2626] hover:text-[#B91C1C] transition-colors">
                    +91 8590377418
                  </a>
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Address:</span>{' '}
                  <span className="text-gray-300">3rd Floor CSI Commercial Center, Kottayam near Baker Hill Junction</span>
                </p>
                <p className="text-gray-400 mt-3">
                  <span className="text-gray-500">Website:</span>{' '}
                  <a href="https://supportta.com" target="_blank" rel="noopener noreferrer" className="text-[#DC2626] hover:text-[#B91C1C] transition-colors">
                    supportta.com
                  </a>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={`product-${link.label}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={`support-${link.label}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={`company-${link.label}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-white/10 pt-8 mb-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
              SSL Encrypted
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
              PCI Compliant
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
              GDPR Ready
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
              Secure Payments
            </div>
          </div>
        </motion.div>

        {/* Legal Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-1">
                A product of <span className="text-white font-semibold">SupportTASolutions Private Limited</span>
              </p>
              <p className="text-gray-400 text-sm">
                Copyright © {new Date().getFullYear()} RentOrent. All Rights Reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}


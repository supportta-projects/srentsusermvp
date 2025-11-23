'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What happens if I cancel?',
    answer: 'You can cancel your subscription at any time. Your access will continue until the end of your current billing period. No questions asked, no penalties.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes, absolutely! You can upgrade or downgrade your plan at any time. Changes will be prorated, so you only pay the difference for the remaining period.',
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No, there are no setup fees or hidden costs. The price you see is the price you pay. All features are included in every plan.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with RentOrent for any reason, contact us within 30 days of your subscription for a full refund.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods through Razorpay, including credit cards, debit cards, UPI, net banking, and digital wallets. All payments are secure and encrypted.',
  },
  {
    question: 'Are there any transaction fees?',
    answer: 'No, there are no transaction fees. The subscription price is all-inclusive. We don\'t charge any commission on your bookings or rentals.',
  },
];

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pricing FAQ
          </h2>
          <p className="text-xl text-gray-400">
            Common questions about our pricing and subscriptions
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-semibold text-white group-hover:text-[#DC2626] transition-colors pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#DC2626] transition-colors" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@rentorent.com"
            className="inline-flex items-center gap-2 text-[#DC2626] hover:text-[#B91C1C] font-semibold transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}


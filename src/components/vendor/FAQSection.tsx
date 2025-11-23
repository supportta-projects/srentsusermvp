'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    category: 'Registration',
    questions: [
      {
        question: 'How long does the approval process take?',
        answer: 'The approval process usually takes 24 hours. Our admin team reviews your registration details and documents. You\'ll receive an email notification once your account is approved.',
      },
      {
        question: 'What documents do I need to register?',
        answer: 'You\'ll need: GST Certificate (if applicable), Shop License, ID Proof (Aadhar/Voter ID), Bank Account Details, and UPI ID. All documents are securely stored and only used for verification purposes.',
      },
      {
        question: 'Can I register multiple shops?',
        answer: 'Yes, you can manage multiple shops from a single account. Each shop will have its own inventory, orders, and customer database. Contact support to set up additional shops.',
      },
    ],
  },
  {
    category: 'Subscription',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major payment methods through Razorpay, including credit cards, debit cards, UPI, net banking, and digital wallets. All payments are secure and encrypted.',
      },
      {
        question: 'Can I change my subscription plan?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated, so you only pay the difference for the remaining period. No penalties or fees.',
      },
      {
        question: 'What happens if my subscription expires?',
        answer: 'Your account will be temporarily suspended, but your data will be preserved for 30 days. Simply renew your subscription to regain access to all features and data.',
      },
    ],
  },
  {
    category: 'Features',
    questions: [
      {
        question: 'Can I manage inventory offline?',
        answer: 'Currently, RentOrent requires an internet connection. However, we\'re working on offline capabilities. Your data syncs automatically when you reconnect.',
      },
      {
        question: 'Is there a mobile app?',
        answer: 'RentOrent is fully responsive and works great on mobile browsers. We\'re developing native mobile apps for iOS and Android, coming soon.',
      },
      {
        question: 'How many products can I add?',
        answer: 'There\'s no limit! You can add unlimited products, orders, customers, and staff members. All plans include unlimited usage.',
      },
    ],
  },
  {
    category: 'Support',
    questions: [
      {
        question: 'How do I get technical support?',
        answer: 'You can reach our support team via email at support@rentorent.com. We typically respond within 24 hours. Documentation and video tutorials are coming soon.',
      },
      {
        question: 'Do you offer training or onboarding?',
        answer: 'Yes! We provide onboarding assistance to help you get started. Contact support to schedule a training session. We also have documentation and tutorials available.',
      },
      {
        question: 'What if I need help migrating my data?',
        answer: 'Our support team can help you migrate data from other systems. Contact support@rentorent.com with your requirements, and we\'ll assist you with the migration process.',
      },
    ],
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<{ category: number; question: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (categoryIndex: number, questionIndex: number) => {
    const key = { category: categoryIndex, question: questionIndex };
    if (
      openIndex?.category === categoryIndex &&
      openIndex?.question === questionIndex
    ) {
      setOpenIndex(null);
    } else {
      setOpenIndex(key);
    }
  };

  const filteredFAQs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Find answers to common questions about RentOrent
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => (
                  <motion.div
                    key={questionIndex}
                    className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden hover:border-[#DC2626]/50 transition-all duration-300 gpu-accelerated"
                  >
                    <button
                      onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    >
                      <span className="text-base font-semibold text-white group-hover:text-[#DC2626] transition-colors pr-4">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{
                          rotate:
                            openIndex?.category === categoryIndex &&
                            openIndex?.question === questionIndex
                              ? 180
                              : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#DC2626] transition-colors" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openIndex?.category === categoryIndex &&
                        openIndex?.question === questionIndex && (
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


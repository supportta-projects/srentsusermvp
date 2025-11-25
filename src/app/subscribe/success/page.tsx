'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import VendorNavbar from '@/components/vendor/VendorNavbar';
import Link from 'next/link';

function SuccessPageContent() {

  return (
    <div className="min-h-screen bg-black text-white">
      <VendorNavbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-400 mb-2">
              Your subscription has been activated successfully.
            </p>
            <p className="text-gray-500">
              You'll receive an email with your account credentials shortly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 space-y-4"
          >
            <h2 className="text-xl font-semibold text-white mb-4">What's Next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="text-[#10B981] mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Check your email</p>
                  <p className="text-gray-400 text-sm">Account credentials will be sent to your email address</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#10B981] mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Account approval</p>
                  <p className="text-gray-400 text-sm">Your account will be reviewed and approved within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#10B981] mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Access your dashboard</p>
                  <p className="text-gray-400 text-sm">Once approved, you can log in and start managing your rental business</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-colors"
            >
              Go to Login
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}


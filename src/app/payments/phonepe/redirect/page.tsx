'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import VendorNavbar from '@/components/vendor/VendorNavbar';
import Link from 'next/link';

function RedirectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('txnId');
  const isDummyMode = searchParams.get('dummy') === 'true';

  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'pending' | 'error'>('checking');
  const [orderData, setOrderData] = useState<{
    orderId?: string;
    amount?: number;
    transactionId?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!transactionId) {
      setStatus('error');
      setError('Transaction ID is missing');
      return;
    }

    // In dummy mode, simulate a brief delay then check status
    if (isDummyMode) {
      setTimeout(() => {
        checkPaymentStatus();
      }, 2000); // 2 second delay to simulate payment processing
    } else {
      checkPaymentStatus();
    }
  }, [transactionId, isDummyMode]);

  const checkPaymentStatus = async () => {
    try {
      setStatus('checking');
      setError(null);

      const response = await fetch(`/api/payments/phonepe/status?txnId=${transactionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check payment status');
      }

      setOrderData({
        orderId: data.orderId,
        amount: data.amountRupees,
        transactionId: data.transactionId,
        ...(data.dummyMode && { dummyMode: true }),
      });

      // Map status
      if (data.status === 'success') {
        setStatus('success');
      } else if (data.status === 'failed' || data.status === 'cancelled') {
        setStatus('failed');
      } else if (data.status === 'pending') {
        setStatus('pending');
        // Retry after 3 seconds if still pending
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            checkPaymentStatus();
          }, 3000);
        }
      } else {
        setStatus('error');
        setError('Unknown payment status');
      }
    } catch (err: any) {
      console.error('Error checking payment status:', err);
      setStatus('error');
      setError(err.message || 'Failed to check payment status');
    }
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader2 className="w-16 h-16 animate-spin text-[#DC2626] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {isDummyMode ? '🧪 Dummy Mode: Processing payment...' : 'Processing your payment...'}
            </h2>
            <p className="text-gray-400">
              {isDummyMode 
                ? 'Simulating payment processing (no API calls, no real payment)'
                : 'Please wait while we confirm your payment'}
            </p>
            {isDummyMode && (
              <p className="text-yellow-400 text-sm mt-2">
                This is a dummy payment simulation. No API calls or real money involved.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Pending</h2>
            <p className="text-gray-400 mb-6">
              We're still confirming your payment. This usually takes a few moments.
            </p>
            <div className="space-y-3">
              <button
                onClick={checkPaymentStatus}
                className="w-full px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-colors"
              >
                Check Status Again
              </button>
              <Link
                href="/profile"
                className="block w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
              >
                Go to My Bookings
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">
              {orderData && 'dummyMode' in orderData ? '🧪 Dummy Payment Successful!' : 'Payment Successful!'}
            </h1>
            <p className="text-gray-400 mb-6">
              {orderData && 'dummyMode' in orderData 
                ? 'Dummy payment completed successfully. Your subscription is now active. (No real payment was made)'
                : 'Your payment has been confirmed. Your subscription is now active.'}
            </p>
            {orderData && 'dummyMode' in orderData && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  ⚠️ This was a dummy payment simulation. No API calls or real money involved.
                </p>
              </div>
            )}
            
            {orderData && (
              <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  {orderData.orderId && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order ID:</span>
                      <span className="text-white font-mono">{orderData.orderId.substring(0, 8)}...</span>
                    </div>
                  )}
                  {orderData.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transaction ID:</span>
                      <span className="text-white font-mono">{orderData.transactionId.substring(0, 12)}...</span>
                    </div>
                  )}
                  {orderData.amount && (
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="text-gray-400">Amount Paid:</span>
                      <span className="text-white font-bold">₹{orderData.amount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link
                href="/profile"
                className="block w-full px-6 py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-colors"
              >
                View My Bookings
              </Link>
              <Link
                href="/"
                className="block w-full px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Failed or error state
  return (
    <div className="min-h-screen bg-black text-white">
      <VendorNavbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="w-12 h-12 text-red-400" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-gray-400 mb-6">
            {error || 'Your payment could not be processed. Please try again.'}
          </p>

          <div className="space-y-3">
            <Link
              href="/checkout"
              className="block w-full px-6 py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white">
        <VendorNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
        </div>
      </div>
    }>
      <RedirectPageContent />
    </Suspense>
  );
}


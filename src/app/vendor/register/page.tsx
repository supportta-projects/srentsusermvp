'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import VendorNavbar from '@/components/vendor/VendorNavbar';
import Button from '@/components/ui/Button';

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    shopName: '',
    address: '',
    gst: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create Firebase Auth account
      await signUp(formData.email, formData.password, formData.name, formData.phone);
      
      // Note: Vendor document creation should be handled by admin approval process
      // For now, we'll just create the auth account
      // The vendor document in rental_shops will be created by admin after approval
      
      // Redirect to subscription page
      router.push('/vendor/subscription');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <VendorNavbar />
      <div className="max-w-2xl mx-auto px-4 py-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Vendor Registration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 mb-6"
          >
            Create your vendor account to start managing your rental business
          </motion.p>

          {/* Approval Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] px-4 py-3 rounded-lg text-sm mb-6"
          >
            <p className="font-semibold mb-1">✓ Approval Timeline:</p>
            <p>Your account will usually be approved within 24 hours. You'll receive an email notification once approved.</p>
          </motion.div>

          {/* Required Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] px-4 py-3 rounded-lg text-sm mb-6"
          >
            <p className="font-semibold mb-2">📋 Required Documents (for approval):</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>GST Certificate (if applicable)</li>
              <li>Shop License</li>
              <li>ID Proof (Aadhar/Voter ID)</li>
              <li>Bank Account Details</li>
              <li>UPI ID</li>
            </ul>
            <p className="text-xs mt-2 opacity-80">Note: You can provide these documents after registration. Admin will contact you for verification.</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Owner Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-300 mb-2">
                  Shop Name *
                </label>
                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors"
                  placeholder="ABC Rental Shop"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors"
                placeholder="vendor@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label htmlFor="gst" className="block text-sm font-medium text-gray-300 mb-2">
                  GST Number
                </label>
                <input
                  id="gst"
                  name="gst"
                  type="text"
                  value={formData.gst}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors"
                  placeholder="29ABCDE1234F1Z5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                Shop Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors"
                placeholder="123 Main Street, City, State, PIN"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#DC2626] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>


            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <a
                href="/vendor/login"
                className="text-[#DC2626] hover:text-[#B91C1C] font-medium"
              >
                Sign in here
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}


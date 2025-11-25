'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { supabase } from '@/lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});

  const validateForm = () => {
    const errors: { email?: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Get the base URL for redirect
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectTo = `${baseUrl}/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (resetError) {
        setError(resetError.message || 'An error occurred. Please try again.');
        setLoading(false);
        return;
      }

      // Always show success message (don't reveal if email exists)
      setSuccess(true);
      setError('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a password reset link."
      >
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">
              If an account exists for <strong className="text-white">{email}</strong>, 
              we've sent a password reset link. Please check your inbox and follow the instructions.
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-400">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => {
                  setSuccess(false);
                  setError('');
                }}
                className="text-[#DC2626] hover:text-[#B91C1C] font-medium"
              >
                try again
              </button>
            </p>
            
            <Link
              href="/login"
              className="inline-block text-sm text-[#DC2626] hover:text-[#B91C1C] font-medium"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email address and we'll send you a reset link"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
            className={`w-full px-4 py-3 bg-white/5 border ${
              fieldErrors.email ? 'border-red-500/50' : 'border-white/10'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500`}
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending reset link...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}


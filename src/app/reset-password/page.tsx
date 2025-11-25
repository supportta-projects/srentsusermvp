'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { supabase } from '@/lib/supabaseClient';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid session/token from the reset link
    const checkSession = async () => {
      // First, check if there's a hash in the URL (from the reset link)
      // Supabase with detectSessionInUrl: true will automatically process it
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          // Wait for Supabase to process the token
          // Listen for auth state change
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY' || session) {
              setIsValidToken(true);
            }
          });
          
          // Also check after a short delay
          setTimeout(async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsValidToken(!!session);
          }, 1000);
          
          return () => {
            subscription.unsubscribe();
          };
        }
      }
      
      // If no hash, check existing session
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidToken(!!session);
    };

    checkSession();
  }, []);

  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        if (updateError.message.includes('session')) {
          setError('This reset link has expired or is invalid. Please request a new one.');
        } else {
          setError(updateError.message || 'An error occurred. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success - redirect to login with email pre-filled if available
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email || '';
      
      router.push(`/login?email=${encodeURIComponent(email)}&message=Password reset successful`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <AuthLayout
        title="Loading..."
        subtitle="Verifying reset link"
      >
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#DC2626]"></div>
        </div>
      </AuthLayout>
    );
  }

  if (isValidToken === false) {
    return (
      <AuthLayout
        title="Invalid Reset Link"
        subtitle="This password reset link has expired or is invalid"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <Link
              href="/forgot-password"
              className="inline-block w-full py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-lg transition-all duration-300 text-center"
            >
              Request New Reset Link
            </Link>
            
            <Link
              href="/login"
              className="inline-block text-sm text-gray-400 hover:text-white transition-colors"
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
      subtitle="Enter your new password"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="new-password"
            className={`w-full px-4 py-3 bg-white/5 border ${
              fieldErrors.password ? 'border-red-500/50' : 'border-white/10'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500`}
            placeholder="••••••••"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className={`w-full px-4 py-3 bg-white/5 border ${
              fieldErrors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-[#DC2626]/30 text-white placeholder-gray-500`}
            placeholder="••••••••"
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating password...' : 'Update Password'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Reset Password" subtitle="Enter your new password">
        <div className="flex items-center justify-center py-8">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        </div>
      </AuthLayout>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}


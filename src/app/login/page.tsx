'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const planId = searchParams?.get('plan');
      const redirect = searchParams?.get('redirect');
      if (redirect === 'checkout' && planId) {
        router.push(`/subscribe/profile?plan=${planId}`);
      } else if (redirect === 'checkout') {
        router.push('/subscribe/profile');
      } else {
        router.push('/');
      }
    }
  }, [user, router, searchParams]);
  // Removed refreshUser - not needed, auth context updates automatically
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Pre-fill email and show success message if provided in query params
  useEffect(() => {
    const emailParam = searchParams?.get('email');
    const messageParam = searchParams?.get('message');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (messageParam) {
      setSuccess(messageParam);
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        // Map Supabase errors to user-friendly messages
        if (signInError.message.includes('Invalid login credentials') || 
            signInError.message.includes('email') || 
            signInError.message.includes('password')) {
          setError('Invalid email or password');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please check your email and verify your account before signing in.');
        } else {
          setError(signInError.message || 'An error occurred during sign in');
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Auth context will update automatically via onAuthStateChange
        // No need to call refreshUser() - Supabase already returned the user
        
        // Check for redirect parameters
        const planId = searchParams?.get('plan');
        const redirect = searchParams?.get('redirect');
        
        if (redirect === 'checkout' && planId) {
          // Redirect to subscribe profile page with plan ID
          router.push(`/subscribe/profile?plan=${planId}`);
        } else if (redirect === 'checkout') {
          // Redirect to subscribe profile page
          router.push('/subscribe/profile');
        } else if (redirect === 'payment' && planId) {
          // Redirect to subscription page with plan ID
          router.push(`/subscription?plan=${planId}`);
        } else if (redirect === 'payment') {
          // Redirect to subscription page
          router.push('/subscription');
        } else {
          // Default redirect to home page
          router.push('/');
        }
        // Removed router.refresh() - not needed, causes unnecessary full page reload
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Sign in to continue."
    >
      {success && (
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm sm:text-base backdrop-blur-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm sm:text-base backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
            className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base bg-white/5 border transition-all duration-200 ${
              fieldErrors.email 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                : 'border-white/10 hover:border-white/20 focus:border-[#DC2626]/50 focus:ring-2 focus:ring-[#DC2626]/20'
            } rounded-xl focus:outline-none text-white placeholder-gray-500 backdrop-blur-sm`}
            style={{
              boxShadow: fieldErrors.email 
                ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
                : '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            }}
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-300">
              PIN (6 digits)
            </label>
            <Link
              href="/forgot-password"
              className="text-xs sm:text-sm text-[#DC2626] hover:text-[#B91C1C] transition-colors font-medium"
            >
              Forgot PIN?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                // Only allow digits and limit to 6 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPassword(value);
              }}
              autoComplete="current-password"
              maxLength={6}
              inputMode="numeric"
              className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 pr-12 sm:pr-14 bg-white/5 border transition-all duration-200 ${
                fieldErrors.password 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                  : 'border-white/10 hover:border-white/20 focus:border-[#DC2626]/50 focus:ring-2 focus:ring-[#DC2626]/20'
              } rounded-xl focus:outline-none text-white placeholder-gray-500 text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] sm:tracking-[0.3em]`}
              style={{
                boxShadow: fieldErrors.password 
                  ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
              }}
              placeholder="000000"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-white/10 active:scale-95"
              aria-label={showPassword ? 'Hide PIN' : 'Show PIN'}
            >
              {showPassword ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] text-white font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-[#DC2626]/20 hover:shadow-[#DC2626]/30"
          style={{
            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-5 sm:mt-6 text-center">
        <p className="text-sm sm:text-base text-gray-400">
          Don't have an account?{' '}
          <Link
            href={`/register${searchParams?.get('plan') ? `?plan=${searchParams.get('plan')}&redirect=checkout` : searchParams?.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`}
            className="text-[#DC2626] hover:text-[#B91C1C] font-semibold transition-colors underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Sign In" subtitle="Welcome back! Sign in to continue.">
        <div className="flex items-center justify-center py-8">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        </div>
      </AuthLayout>
    }>
      <LoginForm />
    </Suspense>
  );
}


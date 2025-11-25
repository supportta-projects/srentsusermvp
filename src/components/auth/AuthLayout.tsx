import { ReactNode } from 'react';
import Link from 'next/link';
import RentOrentLogo from '../vendor/RentOrentLogo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Background gradients - Enhanced */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[10%] w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-[#DC2626]/20 to-[#B91C1C]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-[15%] w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-bl from-[#EF4444]/15 to-[#DC2626]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-[20%] w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#B91C1C]/15 to-[#EF4444]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <Link href="/vendor" className="inline-flex items-center justify-center group">
            <RentOrentLogo size="lg" className="group-hover:scale-105 transition-transform duration-300" />
          </Link>
        </div>

        {/* Auth Card - Enhanced Glassmorphism */}
        <div 
          className="relative bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0f0f0f] rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-6 md:p-8 backdrop-blur-xl overflow-hidden"
          style={{
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.05) inset,
              0 20px 60px rgba(0, 0, 0, 0.5),
              0 8px 32px rgba(220, 38, 38, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {/* Subtle shine effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-center bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 text-center">
              {subtitle}
            </p>
          )}
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
          <Link href="/vendor" className="hover:text-white transition-colors inline-flex items-center gap-1">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}


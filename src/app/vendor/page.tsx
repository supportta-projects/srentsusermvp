'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VendorHero from '@/components/vendor/VendorHero';
import StatsSection from '@/components/vendor/StatsSection';
import FeaturesSection from '@/components/vendor/FeaturesSection';
import ProductDemoSection from '@/components/vendor/ProductDemoSection';
import HowItWorksSection from '@/components/vendor/HowItWorksSection';
import TestimonialsSection from '@/components/vendor/TestimonialsSection';
import TrustedBySection from '@/components/vendor/TrustedBySection';
import PricingSection from '@/components/vendor/PricingSection';
import PricingFAQ from '@/components/vendor/PricingFAQ';
import SecuritySection from '@/components/vendor/SecuritySection';
import SupportSection from '@/components/vendor/SupportSection';
import FAQSection from '@/components/vendor/FAQSection';
import CompanyInfoSection from '@/components/vendor/CompanyInfoSection';
import VendorCTA from '@/components/vendor/VendorCTA';
import VendorFooter from '@/components/vendor/VendorFooter';
import VendorNavbar from '@/components/vendor/VendorNavbar';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function VendorLandingPage() {
  const router = useRouter();

  // Scroll to top on mount - especially important for mobile
  useEffect(() => {
    // Scroll to top immediately on mount
    window.scrollTo(0, 0);
    
    // Also ensure scroll position is reset after a short delay (for mobile browsers)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      // Force scroll on mobile browsers
      if (typeof window !== 'undefined' && window.history.scrollRestoration) {
        window.history.scrollRestoration = 'manual';
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <VendorNavbar />
      <VendorHero />
      <StatsSection />
      <FeaturesSection />
      <ProductDemoSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <TrustedBySection />
      <PricingSection />
      <PricingFAQ />
      <SecuritySection />
      <SupportSection />
      <FAQSection />
      <CompanyInfoSection />
      <VendorCTA />
      <VendorFooter />
      <WhatsAppButton />
    </div>
  );
}


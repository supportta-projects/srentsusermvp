'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import VendorHero from '@/components/vendor/VendorHero';
import VendorNavbar from '@/components/vendor/VendorNavbar';
import StatsSection from '@/components/vendor/StatsSection';
import TrustedBySection from '@/components/vendor/TrustedBySection';
import PricingSection from '@/components/vendor/PricingSection';
// WhatsAppButton is rendered in root layout as direct child of <body>

// Lazy load below-the-fold components for better initial load performance
// TEMPORARILY DISABLED DYNAMIC IMPORT TO TEST CACHING ISSUE
// const FeaturesSection = dynamic(() => import('@/components/vendor/FeaturesSection'), {
//   loading: () => <div className="h-96 bg-black" />,
// });
import FeaturesSection from '@/components/vendor/FeaturesSection';

const ProductDemoSection = dynamic(() => import('@/components/vendor/ProductDemoSection'), {
  loading: () => <div className="h-96 bg-black" />,
});

const HowItWorksSection = dynamic(() => import('@/components/vendor/HowItWorksSection'), {
  loading: () => <div className="h-96 bg-black" />,
});

const TestimonialsSection = dynamic(() => import('@/components/vendor/TestimonialsSection'), {
  loading: () => <div className="h-96 bg-black" />,
});

const PricingFAQ = dynamic(() => import('@/components/vendor/PricingFAQ'), {
  loading: () => <div className="h-96 bg-black" />,
});

const SecuritySection = dynamic(() => import('@/components/vendor/SecuritySection'), {
  loading: () => <div className="h-96 bg-black" />,
});

const SupportSection = dynamic(() => import('@/components/vendor/SupportSection'), {
  loading: () => <div className="h-96 bg-black" />,
});

const FAQSection = dynamic(() => import('@/components/vendor/FAQSection'), {
  loading: () => <div className="h-96 bg-black" />,
});

const CompanyInfoSection = dynamic(() => import('@/components/vendor/CompanyInfoSection'), {
  loading: () => <div className="h-96 bg-black" />,
});

const VendorCTA = dynamic(() => import('@/components/vendor/VendorCTA'), {
  loading: () => <div className="h-96 bg-black" />,
});

const VendorFooter = dynamic(() => import('@/components/vendor/VendorFooter'), {
  loading: () => <div className="h-96 bg-black" />,
});

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
      {/* WhatsAppButton is added directly to body via JavaScript - not rendered here */}
    </div>
  );
}


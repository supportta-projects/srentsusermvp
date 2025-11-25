'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // useEffect only runs on client, so window is always available
    // Disable scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Additional scroll to top for mobile browsers (they sometimes restore scroll after initial render)
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto', // Instant scroll, not smooth
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}


'use client';

import { useState, useEffect } from 'react';
import { MobileStoryAd } from '@/components/ui/MobileStoryAd';

export default function HomeClient() {
  const [showStoryAd, setShowStoryAd] = useState(false);

  // Show story ad on mobile after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        setShowStoryAd(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileStoryAd 
      isOpen={showStoryAd}
      onClose={() => setShowStoryAd(false)}
      title="Welcome Offer"
      subtitle="Get 15% off your first order"
      cta="Claim Offer"
      href="/sale"
    />
  );
}
'use client';

import { ReactNode } from 'react';
import MobileStickyAd from '@/components/ads/MobileStickyAd';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <MobileStickyAd />
    </>
  );
}

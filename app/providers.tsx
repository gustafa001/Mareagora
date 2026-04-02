'use client';

import MobileStickyAd from "@/components/ads/MobileStickyAd";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MobileStickyAd />
    </>
  );
}

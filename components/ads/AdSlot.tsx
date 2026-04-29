"use client";

import React, { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT_ID } from '@/lib/adConfig';

interface AdSlotProps {
  slotId: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  fullWidthResponsive?: boolean;
}

export default function AdSlot({
  slotId,
  format = "auto",
  style,
  fullWidthResponsive = true,
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      // @ts-ignore
      if (window.adsbygoogle) {
        // @ts-ignore
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div ref={adRef} className="ad-container" style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...(fullWidthResponsive && { width: "100%" }),
          ...style,
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

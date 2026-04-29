'use client';

import { useState } from 'react';
import AdSlot from './AdSlot';
import { AD_SLOTS } from '@/lib/adConfig';

export default function MobileStickyAd() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-[60] bg-slate-900 border-t border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] empty:hidden [&:has(ins[data-ad-status='unfilled'])]:hidden">
      <button
        onClick={() => setDismissed(true)}
        className="absolute -top-6 right-2 bg-slate-800 text-slate-400 hover:text-white rounded-t-lg px-3 py-1 text-xs z-10 border border-b-0 border-slate-700 transition-colors"
        aria-label="Fechar anúncio"
      >
        Fechar
      </button>
      <div className="flex justify-center items-center min-h-[50px] w-full">
        <AdSlot 
          slotId={AD_SLOTS.MOBILE_STICKY} 
          format="horizontal" 
          fullWidthResponsive={false} 
          style={{ width: '320px', height: '50px' }} 
        />
      </div>
    </div>
  );
}

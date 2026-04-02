'use client';

import { useEffect } from 'react';

export default function MobileStickyAd() {
  useEffect(() => {
    // Push do AdSense quando o componente monta
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log('AdSense error:', err);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full h-[90px] flex items-center justify-center bg-gray-50">
          {/* Ad Unit Mobile Sticky Banner */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2920008879492175"
            data-ad-slot="7494638408"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}

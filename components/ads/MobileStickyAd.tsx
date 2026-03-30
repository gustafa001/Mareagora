'use client'

import { useEffect, useRef, useState } from 'react'
import { AD_SLOTS, ADSENSE_PUB_ID } from '../lib/adConfig'

export default function MobileStickyAd() {
  const initialized = useRef(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    try {
      const w = window as typeof window & { adsbygoogle: unknown[] }
      w.adsbygoogle = w.adsbygoogle || []
      w.adsbygoogle.push({})
    } catch (e) {
      console.error('AdSense mobile sticky error:', e)
    }
  }, [])

  if (dismissed) return null

  return (
    <>
      {/* Espaço reservado para evitar que o conteúdo fique atrás do sticky */}
      <div className="h-[60px] md:hidden" aria-hidden="true" />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center
                   bg-[rgba(10,22,40,0.97)] border-t border-[rgba(0,200,255,0.15)]
                   md:hidden"
        style={{ minHeight: '60px' }}
      >
        {/* Botão fechar */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-1 right-2 text-[10px] text-gray-500 hover:text-gray-300
                     leading-none z-10"
          aria-label="Fechar anúncio"
        >
          ✕
        </button>

        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '320px', height: '50px' }}
          data-ad-client={ADSENSE_PUB_ID}
          data-ad-slot={AD_SLOTS.MOBILE_STICKY}
        />
      </div>
    </>
  )
}

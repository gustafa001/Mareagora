'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slotId: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
  fullWidthResponsive?: boolean
}

const PUB_ID = 'ca-pub-2920008879492175'

export default function AdSlot({
  slotId,
  format = 'auto',
  className = '',
  style = {},
  fullWidthResponsive = true,
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    try {
      const w = window as typeof window & { adsbygoogle: unknown[] }
      w.adsbygoogle = w.adsbygoogle || []
      w.adsbygoogle.push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client={PUB_ID}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  )
}

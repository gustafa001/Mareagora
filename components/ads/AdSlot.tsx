"use client";

import React, { useEffect, useRef, useState } from 'react';
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
  // Só renderiza o <ins> do AdSense depois que o componente já montou no
  // cliente (pós-hidratação). O servidor nunca envia esse elemento, então
  // não há árvore DOM para o React comparar/quebrar caso um bloqueador de
  // anúncios (ou o próprio AdSense) mexa nele antes da hidratação —
  // evita os erros de hydration mismatch #418/#423/#425.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !adRef.current || !mounted) return;

    // Evita o erro "No slot size for availableWidth=0": só chama o
    // push() quando o container já tem largura real renderizada.
    // Em navegação client-side / conexões lentas o layout pode não
    // estar pronto no primeiro paint, então tentamos por alguns frames.
    let cancelled = false;
    let attempts = 0;

    const tryPush = () => {
      if (cancelled) return;
      const width = adRef.current?.offsetWidth ?? 0;

      if (width > 0) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error('AdSense error:', e);
        }
        return;
      }

      attempts += 1;
      if (attempts < 10) {
        requestAnimationFrame(tryPush);
      }
    };

    requestAnimationFrame(tryPush);

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  return (
    <div
      ref={adRef}
      className="ad-container"
      style={{ width: "100%", minHeight: 1, ...style }}
    >
      {mounted && (
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
      )}
    </div>
  );
}

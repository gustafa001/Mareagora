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
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'true') return null;

  const adRef = useRef<HTMLDivElement>(null);
  // Só renderiza o <ins> do AdSense depois que o componente já montou no
  // cliente (pós-hidratação). O servidor nunca envia esse elemento, então
  // não há árvore DOM para o React comparar/quebrar caso um bloqueador de
  // anúncios (ou o próprio AdSense) mexa nele antes da hidratação —
  // evita os erros de hydration mismatch #418/#423/#425.
  const [mounted, setMounted] = useState(false);
  const hasPushed = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !adRef.current || !mounted) return;

    const el = adRef.current;
    let ro: ResizeObserver | undefined;
    let raf = 0;
    let cancelled = false;

    // Evita o erro "No slot size for availableWidth=0": nunca chama o push()
    // enquanto o container estiver oculto (display:none / dentro de aba
    // fechada) ou sem largura real. Assim que ele ficar visível com largura,
    // o ResizeObserver dispara o push única vez.
    const tryPush = () => {
      if (cancelled || hasPushed.current) return;
      const visible = el.getClientRects().length > 0 && el.offsetWidth > 0 && el.offsetParent !== null;
      if (!visible) return;

      hasPushed.current = true;
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
      ro?.disconnect();
    };

    // Primeira tentativa logo após o layout do primeiro frame.
    raf = requestAnimationFrame(tryPush);

    // Observa o container: quando ganhar largura visível (ex.: aba aberta
    // depois, layout lento), faz o push automaticamente em vez de desistir.
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => tryPush());
      ro.observe(el);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
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

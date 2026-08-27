"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_KEY } from "@/components/CookieConsent";

/**
 * Carrega o AdSense sempre (não espera consentimento), pedindo anúncios
 * NÃO personalizados por padrão. O Google permite servir anúncios sem
 * cookies de personalização mesmo sem consentimento — só a personalização
 * (CPM mais alto) depende do usuário aceitar.
 *
 * Quando o usuário aceita ("granted"), a flag requestNonPersonalizedAds
 * vira 0 e as próximas requisições de anúncio (nesta carga de página ou na
 * próxima navegação) passam a ser personalizadas.
 */
export default function AdsScripts() {
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'true') return null;

  const [npa, setNpa] = useState(1);

  useEffect(() => {
    const readConsent = () => {
      try {
        const v = localStorage.getItem(CONSENT_KEY);
        setNpa(v === "granted" ? 0 : 1);
      } catch {
        setNpa(1);
      }
    };
    readConsent();
    window.addEventListener("ma-consent", readConsent);
    return () => window.removeEventListener("ma-consent", readConsent);
  }, []);

  return (
    <>
      {/* Precisa rodar ANTES do adsbygoogle.js carregar/pedir o primeiro anúncio */}
      <Script id="adsense-npa-flag" strategy="afterInteractive">
        {`(window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = ${npa};`}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2920008879492175"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}

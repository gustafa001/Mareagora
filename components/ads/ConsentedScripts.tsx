"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_KEY } from "@/components/CookieConsent";

/**
 * GA4 e Clarity SÓ carregam com consentimento explícito ("granted").
 * O AdSense foi movido para <AdsScripts /> (components/ads/AdsScripts.tsx),
 * que carrega sempre e usa anúncios não-personalizados até o usuário aceitar
 * — assim a monetização não fica zerada enquanto o usuário não decide.
 */
export default function ConsentedScripts() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(CONSENT_KEY) === "granted") setGranted(true);
    } catch {
      /* storage indisponivel */
    }
    const onConsent = () => setGranted(true);
    window.addEventListener("ma-consent", onConsent);
    return () => window.removeEventListener("ma-consent", onConsent);
  }, []);

  if (!granted) return null;

  return (
    <>
      {/* Google Analytics GA4 — G-LP14YCN9MZ */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-LP14YCN9MZ"
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LP14YCN9MZ');
        `}
      </Script>
      {/* Microsoft Clarity — y4hkx0np5z */}
      <Script id="ms-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "y4hkx0np5z");
        `}
      </Script>
    </>
  );
}

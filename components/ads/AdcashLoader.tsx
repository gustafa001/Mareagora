"use client";

import Script from "next/script";

declare global {
  interface Window {
    aclib?: {
      runAutoTag?: (opts: { zoneId: string }) => void;
    };
  }
}

/**
 * Carrega o AdCash nas páginas /tide. Componente Client porque o next/script
 * exige que os handlers (onReady) venham de um Client Component — do contrário
 * o Next falha ao serializar a página estática.
 */
export default function AdcashLoader() {
  return (
    <Script
      id="aclib"
      strategy="afterInteractive"
      src="//acscdn.com/script/aclib.js"
      onReady={() => {
        window.aclib?.runAutoTag?.({ zoneId: "zeprbiznxb" });
      }}
    />
  );
}
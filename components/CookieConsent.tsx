"use client";

import { useEffect, useState } from "react";

export const CONSENT_KEY = "ma_cookie_consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setShow(true);
    } catch {
      /* storage indisponivel */
    }
  }, []);

  const decide = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* storage indisponivel */
    }
    window.dispatchEvent(new Event("ma-consent"));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[200] border-t border-white/10 bg-slate-900/95 p-4 text-sm text-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,.35)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 leading-relaxed">
          Usamos cookies para personalizar anúncios e melhorar sua experiência.
          Você pode aceitar tudo ou continuar apenas com o essencial.{" "}
          <a href="/cookies" className="underline decoration-cyan-400 underline-offset-2 hover:text-cyan-300">
            Saiba mais
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide("denied")}
            className="rounded-lg border border-white/20 px-4 py-2 font-medium transition-colors hover:bg-white/10"
          >
            Só o essencial
          </button>
          <button
            onClick={() => decide("granted")}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900 transition-colors hover:bg-cyan-400"
          >
            Aceitar tudo
          </button>
        </div>
      </div>
    </div>
  );
}

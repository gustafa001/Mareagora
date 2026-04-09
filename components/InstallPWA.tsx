'use client';

import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Mostrar banner após 3 segundos para não ser intrusivo logo de cara
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[100] md:left-auto md:right-8 md:bottom-8 md:w-80 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-1 rounded-3xl shadow-2xl shadow-blue-500/40">
        <div className="bg-slate-900 rounded-[22px] p-5 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-2xl shadow-lg">
              🌊
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm leading-tight">Instalar MaréAgora</h3>
              <p className="text-slate-400 text-xs mt-1 leading-snug">
                Acesse as marés offline e receba alertas direto no seu celular.
              </p>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleInstall}
            className="w-full py-3 rounded-xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-lg active:scale-95"
          >
            Instalar App ⚓
          </button>
        </div>
      </div>
    </div>
  );
}

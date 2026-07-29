'use client';

import { useState } from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export default function InstallPWA() {
  const { canInstall, isStandalone, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (isStandalone || dismissed || !canInstall) return null;

  const handleInstall = async () => {
    const outcome = await install();
    if (outcome === 'accepted') setDismissed(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:bottom-8 md:right-8 md:left-auto md:w-96">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-1 rounded-t-3xl md:rounded-3xl shadow-2xl shadow-blue-500/40">
        <div className="bg-slate-900 rounded-t-[22px] md:rounded-[22px] p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
              🌊
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black text-base leading-tight">Instalar MaréAgora</h3>
              <p className="text-slate-300 text-sm mt-2 leading-snug">
                Acesse as marés offline e receba alertas direto no seu dispositivo.
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/50 transition-all active:scale-95"
            >
              Instalar ⚓
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-200 font-bold text-sm uppercase tracking-widest hover:bg-slate-600 transition-all"
            >
              Depois
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

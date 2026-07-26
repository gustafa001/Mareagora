'use client';

import { useState } from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

interface InstallButtonProps {
  variant?: 'desktop' | 'mobile';
}

export default function InstallButton({ variant = 'desktop' }: InstallButtonProps) {
  const { canInstall, isIOS, isStandalone, install } = useInstallPrompt();
  const [showIOSHint, setShowIOSHint] = useState(false);

  // já instalado, ou (não é iOS e o navegador não liberou o prompt): não mostra nada
  if (isStandalone || (!isIOS && !canInstall)) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSHint(true);
      return;
    }
    await install();
  };

  const desktopClasses =
    'px-3 py-2 rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 flex-shrink-0';
  const mobileClasses =
    'px-4 py-3 rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-3';

  return (
    <>
      <button type="button" onClick={handleClick} className={variant === 'desktop' ? desktopClasses : mobileClasses} title="Instalar app">
        {variant === 'desktop' ? (
          <>
            <span className="text-lg leading-none">📲</span>
            <span className="text-xs font-semibold uppercase tracking-wide leading-tight text-center whitespace-nowrap">
              Instalar
            </span>
          </>
        ) : (
          <>
            <span className="text-lg leading-none">📲</span>
            <span className="text-sm font-semibold uppercase tracking-wide">Instalar app</span>
          </>
        )}
      </button>

      {showIOSHint && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[200]"
          onClick={() => setShowIOSHint(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl p-5 max-w-sm w-full text-sm text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold mb-2">Instalar o MaréAgora no iPhone</p>
            <p className="mt-1">
              1. Toque no ícone de <strong>Compartilhar</strong> (□↑) na barra do Safari.
            </p>
            <p className="mt-1">
              2. Escolha <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
            </p>
            <button
              className="mt-4 w-full bg-gray-100 rounded-lg py-2 font-semibold"
              onClick={() => setShowIOSHint(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

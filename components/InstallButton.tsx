'use client';

import { useState } from 'react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

interface InstallButtonProps {
  variant?: 'desktop' | 'mobile';
}

export default function InstallButton({ variant = 'desktop' }: InstallButtonProps) {
  const { canInstall, isIOS, isStandalone, install } = useInstallPrompt();
  const [showHint, setShowHint] = useState(false);
  const [hintType, setHintType] = useState<'ios' | 'generic'>('generic');

  // só esconde se já estiver instalado — fora isso, o botão fica sempre visível
  if (isStandalone) return null;

  const handleClick = async () => {
    if (canInstall) {
      // navegador liberou o prompt nativo (Chrome/Edge/Android)
      await install();
      return;
    }
    if (isIOS) {
      setHintType('ios');
      setShowHint(true);
      return;
    }
    // Firefox, Safari desktop, ou Chrome que ainda não disparou o evento
    setHintType('generic');
    setShowHint(true);
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

      {showHint && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[200]"
          onClick={() => setShowHint(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl p-5 max-w-sm w-full text-sm text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {hintType === 'ios' ? (
              <>
                <p className="font-semibold mb-2">Instalar o MaréAgora no iPhone</p>
                <p className="mt-1">
                  1. Toque no ícone de <strong>Compartilhar</strong> (□↑) na barra do Safari.
                </p>
                <p className="mt-1">
                  2. Escolha <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold mb-2">Instalar o MaréAgora</p>
                <p className="mt-1">
                  <strong>No Chrome/Edge:</strong> clique no ícone de instalação (⊕ ou tela com seta) na barra de endereço, ou abra o menu (⋮) e escolha <strong>&quot;Instalar MaréAgora&quot;</strong>.
                </p>
                <p className="mt-2">
                  <strong>No Firefox/Safari (desktop):</strong> esses navegadores não suportam instalação de apps no computador. Acesse pelo celular pra instalar.
                </p>
                <p className="mt-2">
                  <strong>No Android:</strong> abra o menu (⋮) do Chrome e toque em <strong>&quot;Instalar app&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
                </p>
              </>
            )}
            <button
              className="mt-4 w-full bg-gray-100 rounded-lg py-2 font-semibold"
              onClick={() => setShowHint(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

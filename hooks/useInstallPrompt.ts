'use client';

import { useEffect, useState, useCallback } from 'react';

// Guarda o evento fora do React state também, em um módulo compartilhado,
// para que qualquer componente montado depois do evento disparar (ex: o
// botão da navbar, se o banner já foi fechado) ainda consiga usá-lo.
let sharedDeferredPrompt: any = null;
const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: any) => {
    e.preventDefault();
    sharedDeferredPrompt = e;
    listeners.forEach((cb) => cb());
  });

  window.addEventListener('appinstalled', () => {
    sharedDeferredPrompt = null;
    listeners.forEach((cb) => cb());
  });
}

export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(ios);

    setCanInstall(!!sharedDeferredPrompt);

    const update = () => setCanInstall(!!sharedDeferredPrompt);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  const install = useCallback(async () => {
    if (!sharedDeferredPrompt) return 'unavailable' as const;
    sharedDeferredPrompt.prompt();
    const { outcome } = await sharedDeferredPrompt.userChoice;
    sharedDeferredPrompt = null;
    listeners.forEach((cb) => cb());
    return outcome as 'accepted' | 'dismissed';
  }, []);

  return {
    canInstall, // true quando o Chrome/Edge/Android liberou o prompt nativo
    isIOS, // Safari não dispara beforeinstallprompt — precisa de instrução manual
    isStandalone, // já instalado, não mostrar nada
    install,
  };
}

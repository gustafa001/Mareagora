// Detecção do ambiente de Web Push (roda só no cliente).
//
// Um site não consegue abrir as configurações do celular. O que dá para fazer é
// descobrir EM QUAL situação o usuário está e mostrar o passo certo:
//   ok          → pode pedir a permissão nativa agora
//   ios-install → iPhone/iPad no Safari comum: push só funciona com o site
//                 instalado na Tela de Início (iOS 16.4+)
//   denied      → permissão bloqueada: o navegador não pergunta de novo,
//                 o usuário precisa liberar manualmente nas configurações
//   unsupported → navegador sem suporte a push

export type PushEnv = 'ok' | 'ios-install' | 'denied' | 'unsupported';
export type PushOS = 'ios' | 'android' | 'desktop';

export function getOS(): PushOS {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  // iPadOS 13+ se identifica como Mac, mas tem tela touch
  const isIPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || isIPadOS) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // Safari iOS antigo
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function getPushEnv(): PushEnv {
  if (typeof window === 'undefined') return 'unsupported';

  // No iOS, fora do app instalado, PushManager nem existe — por isso a checagem
  // do iOS vem ANTES da checagem de suporte.
  if (getOS() === 'ios' && !isStandalone()) return 'ios-install';

  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    return 'unsupported';
  }

  if (Notification.permission === 'denied') return 'denied';
  return 'ok';
}

// O localStorage sozinho engana: se o usuário revogou a permissão nas
// configurações do celular, o site continuaria mostrando "alerta ativo".
// Só consideramos ativo se a permissão ainda está concedida E existe inscrição.
export async function hasActiveSubscription(): Promise<boolean> {
  try {
    if (Notification.permission !== 'granted') return false;
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    return !!sub;
  } catch {
    return false;
  }
}

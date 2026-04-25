'use client';

import { useEffect, useState } from 'react';
import { VAPID_PUBLIC_KEY } from '@/lib/vapid';

interface Props {
  portSlug: string;
  portName?: string;
  variant?: 'pill' | 'inline';
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  try {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (e) {
    console.error('Failed to convert base64 to Uint8Array', e);
    return new Uint8Array();
  }
}

/** Resolve com timeout — evita travar se SW nunca ativar */
async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Timeout: ${label} (${ms}ms)`)), ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/** Obtém o SW registration sem depender de .ready (que pode travar) */
async function getSWRegistration(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported');
  }

  // Tenta primeiro via getRegistration
  try {
    const existing = await withTimeout(
      navigator.serviceWorker.getRegistration('/'),
      3000,
      'getRegistration'
    );
    if (existing) return existing;
  } catch (e) {
    console.warn('getRegistration failed, trying register', e);
  }

  // Força um novo registro se não existir
  const reg = await withTimeout(
    navigator.serviceWorker.register('/sw.js'),
    10000,
    'register'
  );
  
  // Aguarda ficar ativo (max 10s)
  await withTimeout(
    new Promise<void>((resolve) => {
      if (reg.active) { resolve(); return; }
      const sw = reg.installing ?? reg.waiting;
      if (!sw) { resolve(); return; }
      
      const checkState = () => {
        if (sw.state === 'activated') {
          sw.removeEventListener('statechange', checkState);
          resolve();
        }
      };
      sw.addEventListener('statechange', checkState);
    }),
    10000,
    'activate'
  );
  return reg;
}

type Status = 'idle' | 'subscribed' | 'denied' | 'unsupported' | 'error';

export default function BotaoAlertas({ portSlug, portName, variant = 'pill' }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setStatus('unsupported');
      return;
    }
    
    // Check permission safely
    try {
      if (Notification.permission === 'denied') {
        setStatus('denied');
        return;
      }
    } catch (e) {
      console.error('Notification permission check failed', e);
    }

    const saved = localStorage.getItem(`push_subscribed_${portSlug}`);
    if (saved === '1') setStatus('subscribed');
  }, [portSlug]);

  if (!mounted) return null;

  const handleActivate = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    try {
      if (!('Notification' in window)) {
        throw new Error('Notifications not supported');
      }

      // 1. Permissão de notificação
      const permission = await withTimeout(
        Notification.requestPermission(),
        20000, 
        'requestPermission'
      );
      
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }

      // 2. Obtém SW registration sem travar
      const registration = await getSWRegistration();

      // 3. Cria subscription Push
      const subscription = await withTimeout(
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        }),
        15000,
        'pushManager.subscribe'
      );

      // 4. Envia ao servidor
      const subJson = subscription.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      const res = await withTimeout(
        fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: subJson, portSlug }),
        }),
        10000,
        'fetch /api/push/subscribe'
      );

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      localStorage.setItem(`push_subscribed_${portSlug}`, '1');
      setStatus('subscribed');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[BotaoAlertas]', msg);
      setErrorMsg(msg);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const registration = await getSWRegistration();
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      localStorage.removeItem(`push_subscribed_${portSlug}`);
      setStatus('idle');
    } catch (err) {
      console.error('[BotaoAlertas deactivate]', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'unsupported') return null;

  if (status === 'denied') {
    return (
      <span
        title="Ative notificações nas configurações do seu navegador"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          fontSize: '0.75rem', color: '#ef4444', fontWeight: 700,
          padding: '0.4rem 0.9rem', border: '1.5px solid #ef4444',
          borderRadius: '100px', opacity: 0.8, background: 'rgba(0,0,0,0.2)',
        }}
      >
        🔕 Bloqueado — ative no browser
      </span>
    );
  }

  const config: Record<Status, { label: string; emoji: string; color: string; action?: () => void }> = {
    idle:        { label: 'Ativar alertas',       emoji: '🔔', color: '#0ea5e9', action: handleActivate },
    subscribed:  { label: 'Alertas ativos',        emoji: '✅', color: '#10b981', action: handleDeactivate },
    denied:      { label: 'Bloqueado',             emoji: '🔕', color: '#ef4444' },
    unsupported: { label: 'Incompatível',          emoji: '⚠️', color: '#64748b' },
    error:       { label: 'Tentar de novo',         emoji: '❌', color: '#f59e0b', action: handleActivate },
  };

  const currentConfig = config[status] || config.idle;
  const { label, emoji, color, action } = currentConfig;
  const isPill = variant === 'pill';

  return (
    <button
      id={`btn-alertas-${portSlug}`}
      onClick={action}
      disabled={loading || !action}
      title={
        errorMsg
          ? `Erro: ${errorMsg}`
          : portName
          ? `Alertas de maré para ${portName}`
          : 'Alertas de maré'
      }
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: isPill ? '0.55rem 1.25rem' : '0.4rem 0.9rem',
        borderRadius: isPill ? '100px' : '8px',
        border: `1.5px solid ${color}`,
        background: status === 'subscribed' ? `${color}22` : 'rgba(0,0,0,0.3)',
        color,
        fontSize: isPill ? '0.82rem' : '0.75rem',
        fontWeight: 700,
        cursor: loading || !action ? 'default' : 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        opacity: loading ? 0.6 : 1,
        letterSpacing: '0.02em',
        backdropFilter: 'blur(4px)',
      }}
    >
      {loading ? (
        <>
          <span style={{ fontSize: '0.9rem' }}>⏳</span>
          Processando...
        </>
      ) : (
        <>
          <span style={{ fontSize: '1rem' }}>{emoji}</span>
          {label}
        </>
      )}
    </button>
  );
}

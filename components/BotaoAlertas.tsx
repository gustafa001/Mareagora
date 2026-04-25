'use client';

import { useEffect, useState } from 'react';
import { VAPID_PUBLIC_KEY } from '@/lib/vapid';

interface Props {
  portSlug: string;
  portName?: string;
  variant?: 'pill' | 'inline';
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/** Resolve com timeout — evita travar se SW nunca ativar */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${label} (${ms}ms)`)), ms)
    ),
  ]);
}

/** Obtém o SW registration sem depender de .ready (que pode travar) */
async function getSWRegistration(): Promise<ServiceWorkerRegistration> {
  // Tenta primeiro via getRegistration
  const existing = await withTimeout(
    navigator.serviceWorker.getRegistration('/'),
    3000,
    'getRegistration'
  );
  if (existing) return existing;

  // Força um novo registro se não existir
  const reg = await withTimeout(
    navigator.serviceWorker.register('/sw.js'),
    5000,
    'register'
  );
  // Aguarda ficar ativo (max 5s)
  await withTimeout(
    new Promise<void>((resolve) => {
      if (reg.active) { resolve(); return; }
      const sw = reg.installing ?? reg.waiting;
      if (!sw) { resolve(); return; }
      sw.addEventListener('statechange', () => {
        if (sw.state === 'activated') resolve();
      });
    }),
    5000,
    'activate'
  );
  return reg;
}

type Status = 'idle' | 'subscribed' | 'denied' | 'unsupported' | 'error';

export default function BotaoAlertas({ portSlug, portName, variant = 'pill' }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setStatus('denied');
      return;
    }
    const saved = localStorage.getItem(`push_subscribed_${portSlug}`);
    if (saved === '1') setStatus('subscribed');
  }, [portSlug]);

  const handleActivate = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Permissão de notificação
      const permission = await withTimeout(
        Notification.requestPermission(),
        15000, // aguarda até 15s o diálogo do browser
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
        8000,
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
        8000,
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

  const config: Record<Status, { label: string; emoji: string; color: string; action?: () => void }> = {
    idle:        { label: 'Ativar alertas',       emoji: '🔔', color: '#0ea5e9', action: handleActivate },
    subscribed:  { label: 'Alertas ativos',        emoji: '✅', color: '#10b981', action: handleDeactivate },
    denied:      { label: 'Permitir notificações', emoji: '🔕', color: '#ef4444' },
    unsupported: { label: 'Não suportado',          emoji: '⚠️', color: '#64748b' },
    error:       { label: 'Tentar de novo',         emoji: '❌', color: '#f59e0b', action: handleActivate },
  };

  if (status === 'unsupported') return null;

  // Permissão negada — orienta o usuário
  if (status === 'denied') {
    return (
      <span
        title="Ative notificações nas configurações do seu navegador"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          fontSize: '0.75rem', color: '#ef4444', fontWeight: 700,
          padding: '0.4rem 0.9rem', border: '1.5px solid #ef4444',
          borderRadius: '100px', opacity: 0.8,
        }}
      >
        🔕 Notificações bloqueadas — ative nas config. do browser
      </span>
    );
  }

  const { label, emoji, color, action } = config[status];
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
          <span style={{ fontSize: '0.9rem', animation: 'spin 1s linear infinite' }}>⏳</span>
          Aguardando permissão...
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

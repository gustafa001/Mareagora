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
    return new Uint8Array();
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Timeout: ${label}`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

async function getSWRegistration(): Promise<ServiceWorkerRegistration> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    throw new Error('SW not supported');
  }
  const reg = await navigator.serviceWorker.getRegistration('/');
  if (reg) return reg;
  return await navigator.serviceWorker.register('/sw.js');
}

type Status = 'idle' | 'subscribed' | 'denied' | 'unsupported' | 'error';

export default function BotaoAlertas({ portSlug, portName, variant = 'pill' }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    
    // Check Notification support safely
    if (!('Notification' in window)) {
      setStatus('unsupported');
      return;
    }

    try {
      if (Notification.permission === 'denied') {
        setStatus('denied');
      } else {
        const saved = localStorage.getItem(`push_subscribed_${portSlug}`);
        if (saved === '1') setStatus('subscribed');
      }
    } catch (e) {
      console.warn('Initial check error', e);
    }
  }, [portSlug]);

  if (!mounted) return null;

  const handleActivate = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const permission = await withTimeout(Notification.requestPermission(), 30000, 'Permission');
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }

      const registration = await getSWRegistration();
      const subscription = await withTimeout(
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        }),
        15000,
        'Subscribe'
      );

      const subJson = subscription.toJSON();
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subJson, portSlug }),
      });

      if (!res.ok) throw new Error('Falha no servidor');

      localStorage.setItem(`push_subscribed_${portSlug}`, '1');
      setStatus('subscribed');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro desconhecido');
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
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'unsupported') {
    return <span style={{ fontSize: '11px', color: '#64748b', opacity: 0.7 }}>Alertas não disponíveis neste navegador</span>;
  }

  const isPill = variant === 'pill';
  
  const config = {
    idle: { label: 'Ativar alertas', emoji: '🔔', color: '#0ea5e9' },
    subscribed: { label: 'Alertas ativos', emoji: '✅', color: '#10b981' },
    denied: { label: 'Bloqueado no browser', emoji: '🔕', color: '#ef4444' },
    error: { label: 'Tentar novamente', emoji: '❌', color: '#f59e0b' }
  };

  const current = config[status === 'denied' || status === 'error' || status === 'subscribed' ? status : 'idle'];

  return (
    <button
      onClick={status === 'subscribed' ? handleDeactivate : handleActivate}
      disabled={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: isPill ? '8px 18px' : '6px 12px',
        borderRadius: isPill ? '100px' : '8px',
        border: `1.5px solid ${current.color}`,
        background: status === 'subscribed' ? `${current.color}15` : 'rgba(15, 23, 42, 0.6)',
        color: current.color,
        fontSize: '13px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        opacity: loading ? 0.6 : 1,
        backdropFilter: 'blur(8px)',
      }}
    >
      <span>{loading ? '⏳' : current.emoji}</span>
      {loading ? 'Processando...' : current.label}
    </button>
  );
}

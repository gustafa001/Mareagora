'use client';

import { useEffect, useState } from 'react';

// Chave pública VAPID (fallback direto no código para evitar problemas de env)
const VAPID_KEY = 'BIEIsoBEg4UubQNr2jyhdoUATIQFhZ_gIukjnkw85uGvLB-svLQXjaNSi-fdN9IqgNI1NTZI1kwAbvnQiTo0aGU';

interface Props {
  portSlug: string;
  portName?: string;
}

export default function BotaoAlertas({ portSlug, portName }: Props) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'subscribed' | 'denied' | 'unsupported' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }

    const saved = localStorage.getItem(`push_subscribed_${portSlug}`);
    if (saved === '1') {
      setStatus('subscribed');
    }
  }, [portSlug]);

  if (!mounted) return null;

  async function handleAction() {
    if (loading) return;
    setLoading(true);

    try {
      if (status === 'subscribed') {
        // Desativar
        const reg = await navigator.serviceWorker.getRegistration();
        const sub = await reg?.pushManager.getSubscription();
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
      } else {
        // Ativar
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setStatus('denied');
          return;
        }

        const reg = await navigator.serviceWorker.ready;
        
        // Helper to convert VAPID key
        const padding = '='.repeat((4 - (VAPID_KEY.length % 4)) % 4);
        const base64 = (VAPID_KEY + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: outputArray
        });

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub, portSlug }),
        });

        localStorage.setItem(`push_subscribed_${portSlug}`, '1');
        setStatus('subscribed');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'unsupported') return null;

  const colors = {
    idle: '#0ea5e9',
    subscribed: '#10b981',
    denied: '#ef4444',
    error: '#f59e0b'
  };

  const labels = {
    idle: 'Ativar alertas de maré',
    subscribed: 'Alertas ativos ✓',
    denied: 'Notificações bloqueadas',
    error: 'Tentar novamente'
  };

  const color = colors[status] || colors.idle;
  const label = labels[status] || labels.idle;

  return (
    <button
      onClick={handleAction}
      disabled={loading || status === 'denied'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '50px',
        border: `1.5px solid ${color}`,
        background: status === 'subscribed' ? `${color}15` : 'rgba(15, 23, 42, 0.8)',
        color: color,
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all 0.2s',
        marginTop: '10px'
      }}
    >
      {loading ? '⏳ Processando...' : label}
    </button>
  );
}

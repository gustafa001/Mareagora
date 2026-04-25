'use client';

import { useEffect, useState } from 'react';
import { VAPID_PUBLIC_KEY } from '@/lib/vapid';

interface Props {
  portSlug: string;
  portName?: string;
  /** Aparência do botão: 'pill' (padrão) | 'inline' */
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

type Status = 'idle' | 'requesting' | 'subscribed' | 'denied' | 'unsupported' | 'error';

export default function BotaoAlertas({ portSlug, portName, variant = 'pill' }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    // Verifica se já está inscrito para este porto
    const saved = localStorage.getItem(`push_subscribed_${portSlug}`);
    if (saved === '1') setStatus('subscribed');

    // Verifica permissão atual
    if (Notification.permission === 'denied') setStatus('denied');
  }, [portSlug]);

  const handleActivate = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1. Pede permissão
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('denied');
        setLoading(false);
        return;
      }

      // 2. Obtém o service worker registration
      const registration = await navigator.serviceWorker.ready;

      // 3. Cria a subscription via PushManager
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // 4. Serializa e envia ao servidor
      const subJson = subscription.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subJson, portSlug }),
      });

      if (!res.ok) throw new Error('Server error');

      localStorage.setItem(`push_subscribed_${portSlug}`, '1');
      setStatus('subscribed');
    } catch (err) {
      console.error('[BotaoAlertas]', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
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

  // Texto e ação do botão por estado
  const config: Record<Status, { label: string; emoji: string; color: string; action?: () => void }> = {
    idle:        { label: 'Ativar alertas',    emoji: '🔔', color: '#0ea5e9', action: handleActivate },
    requesting:  { label: 'Aguardando...',     emoji: '⏳', color: '#64748b' },
    subscribed:  { label: 'Alertas ativos',    emoji: '✅', color: '#10b981', action: handleDeactivate },
    denied:      { label: 'Permissão negada',  emoji: '🚫', color: '#ef4444' },
    unsupported: { label: 'Não suportado',     emoji: '⚠️', color: '#64748b' },
    error:       { label: 'Erro — tentar de novo', emoji: '❌', color: '#f59e0b', action: handleActivate },
  };

  const { label, emoji, color, action } = config[status];

  if (status === 'unsupported') return null;

  const isPill = variant === 'pill';

  return (
    <button
      id={`btn-alertas-${portSlug}`}
      onClick={action}
      disabled={!action || loading}
      title={portName ? `Alertas de maré para ${portName}` : 'Alertas de maré'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: isPill ? '0.55rem 1.25rem' : '0.4rem 0.9rem',
        borderRadius: isPill ? '100px' : '8px',
        border: `1.5px solid ${color}`,
        background: status === 'subscribed' ? `${color}22` : 'transparent',
        color,
        fontSize: isPill ? '0.82rem' : '0.75rem',
        fontWeight: 700,
        cursor: action ? 'pointer' : 'default',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        opacity: loading ? 0.7 : 1,
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ fontSize: '1rem' }}>{emoji}</span>
      {loading ? 'Aguardando...' : label}
    </button>
  );
}

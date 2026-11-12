'use client';

import { useEffect, useState } from 'react';
import PushHelpModal from '@/components/PushHelpModal';
import { getPushEnv, hasActiveSubscription, type PushEnv } from '@/lib/pushEnv';

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

interface Props {
  portSlug: string;
  portName?: string;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function BotaoAlertas({ portSlug, portName }: Props) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'subscribed' | 'denied' | 'unsupported' | 'error'>('idle');
  const [loading, setLoading] = useState(false);
  const [helpKind, setHelpKind] = useState<Exclude<PushEnv, 'ok'> | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const env = getPushEnv();

    // iPhone fora do app instalado NÃO é "unsupported": mostra o botão e
    // explica como instalar ao clicar.
    if (env === 'unsupported') {
      setStatus('unsupported');
      return;
    }
    if (env === 'denied') setStatus('denied');
    if (env === 'ios-install') return;

    // Só mostra "ativo" se a permissão do celular ainda vale E há inscrição.
    const saved = localStorage.getItem(`push_subscribed_${portSlug}`) === '1';
    if (!saved) return;
    hasActiveSubscription().then((active) => {
      if (active) {
        setStatus('subscribed');
      } else {
        localStorage.removeItem(`push_subscribed_${portSlug}`);
      }
    });
  }, [portSlug]);

  if (!mounted) return null;

  async function handleAction() {
    if (loading) return;

    // Sem await antes do requestPermission: iOS e Chrome Android exigem que
    // o pedido nativo rode direto no clique.
    if (status !== 'subscribed') {
      const env = getPushEnv();
      if (env !== 'ok') {
        setHelpKind(env);
        if (env === 'denied') setStatus('denied');
        return;
      }
    }

    setLoading(true);

    try {
      if (status === 'subscribed') {
        // --- DESATIVAR ---
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
        // --- ATIVAR ---
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          // 'denied' = bloqueou no popup; 'default' = fechou sem escolher.
          if (permission === 'denied') {
            setStatus('denied');
            setHelpKind('denied');
          }
          return;
        }

        // Aguarda SW ativo com timeout de 10s
        // NÃO chama register() aqui — o Next.js/next-pwa já registra
        const reg = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Service Worker demorou demais para ficar pronto')), 10_000)
          ),
        ]);

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
        });

        const res = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub, portSlug }),
        });
        if (!res.ok) {
          // Servidor não salvou: desfaz a inscrição do navegador para não
          // mostrar "ativo" sem que nenhum aviso possa chegar.
          await sub.unsubscribe().catch(() => {});
          throw new Error(`Falha ao salvar inscrição (HTTP ${res.status})`);
        }

        localStorage.setItem(`push_subscribed_${portSlug}`, '1');
        setStatus('subscribed');
      }
    } catch (err) {
      console.error('[BotaoAlertas]', err);
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
    error: '#f59e0b',
  };

  const labels = {
    idle: 'Ativar alertas de maré',
    subscribed: 'Alertas ativos ✓',
    denied: 'Liberar notificações',
    error: 'Tentar novamente',
  };

  const color = colors[status] ?? colors.idle;
  const label = labels[status] ?? labels.idle;

  return (
    <>
    <button
      onClick={handleAction}
      disabled={loading}
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
        marginTop: '10px',
      }}
    >
      {loading ? '⏳ Processando...' : label}
    </button>
    {helpKind && <PushHelpModal kind={helpKind} onClose={() => setHelpKind(null)} />}
    </>
  );
}

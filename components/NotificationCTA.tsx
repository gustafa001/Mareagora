'use client';

import { useEffect, useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

// Mesma chave pública que o servidor usa para assinar os envios (lib/vapid.ts).
// Chave fixa no código divergiria do par VAPID da Vercel e os avisos seriam rejeitados.
const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

interface NotificationCTAProps {
  portSlug: string;
  /**
   * `banner` = bloco completo usado no corpo da página.
   * `compact` = botão para o hero/card, ao lado do compartilhamento.
   */
  variant?: 'banner' | 'compact';
  /** Texto do botão compacto (padrão: "Receber alerta desta maré"). */
  label?: string;
  /** Classes extras do botão compacto. */
  className?: string;
}

export default function NotificationCTA({ portSlug, variant = 'banner', label = 'Receber alerta desta maré', className = '' }: NotificationCTAProps) {
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

    if (Notification.permission === 'granted') {
      const saved = localStorage.getItem(`push_subscribed_${portSlug}`);
      if (saved === '1') {
        setStatus('subscribed');
      }
    }
  }, [portSlug]);

  if (!mounted) {
    if (variant === 'compact') {
      return (
        <button
          type="button"
          disabled
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm bg-blue-600 text-white opacity-60 cursor-wait"
        >
          <Bell size={16} />
          {label}
        </button>
      );
    }
    return null;
  }

  if (status === 'unsupported') return null;

  async function handleSubscribe() {
    if (loading) return;
    setLoading(true);

    try {
      if (status === 'subscribed') {
        // --- DESATIVAR ---
        const existing = await navigator.serviceWorker.getRegistration();
        const current = await existing?.pushManager.getSubscription();
        if (current) {
          await fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: current.endpoint }),
          }).catch(() => {});
          await current.unsubscribe().catch(() => {});
        }
        localStorage.removeItem(`push_subscribed_${portSlug}`);
        setStatus('idle');
        return;
      }

      if (!VAPID_KEY) throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY ausente');

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus('denied');
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      
      const padding = '='.repeat((4 - (VAPID_KEY.length % 4)) % 4);
      const base64 = (VAPID_KEY + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: outputArray
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
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={loading || status === 'denied'}
        title={
          status === 'denied'
            ? 'Permissão de notificações bloqueada no navegador'
            : status === 'subscribed'
            ? 'Clique para desativar'
            : undefined
        }
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
          status === 'subscribed'
            ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
            : 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40'
        } ${className}`}
      >
        {status === 'subscribed' ? <CheckCircle2 size={16} /> : <Bell size={16} />}
        {loading
          ? status === 'subscribed'
            ? 'Desativando...'
            : 'Ativando...'
          : status === 'subscribed'
          ? 'Alerta ativado ✓'
          : status === 'denied'
          ? 'Alertas bloqueados'
          : label}
      </button>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-4 shadow-lg border border-slate-700">
      <div className="flex items-center gap-4 text-left w-full md:w-auto">
        <div className="bg-blue-500/20 p-3 rounded-full shrink-0">
          <Bell className="text-blue-400" size={24} />
        </div>
        <div>
          <h3 className="text-slate-100 font-bold text-lg leading-tight">Receba alertas de maré baixa no seu celular</h3>
          <p className="text-slate-400 text-sm mt-1">Ative as notificações push — grátis</p>
        </div>
      </div>
      
      {status === 'subscribed' ? (
        <div className="flex flex-col items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-400/10 px-6 py-3 rounded-lg w-full md:w-auto justify-center transition-all">
            <CheckCircle2 size={20} />
            ✅ Alertas ativados
          </div>
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={loading}
            className="text-slate-400 hover:text-slate-200 text-sm underline underline-offset-2 disabled:opacity-50 disabled:cursor-wait"
          >
            {loading ? 'Desativando...' : 'Desativar alertas'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={loading || status === 'denied'}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Processando...' : 'Ativar alertas 🔔'}
        </button>
      )}
    </div>
  );
}

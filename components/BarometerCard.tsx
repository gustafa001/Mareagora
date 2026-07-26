'use client';

import { useEffect, useMemo, useState } from 'react';

interface Props {
  lat: number;
  lon: number;
}

interface PressurePoint {
  time: string;
  hPa: number;
}

interface BarometerStatus {
  label: string;
  color: string;
  bg: string;
  icon: string;
  trendLabel: string;
  trendIcon: string;
  detail: string;
}

/** Classifica o sinal de pesca a partir da variação de pressão nas últimas 3h. */
function getBarometerStatus(delta3h: number): BarometerStatus {
  if (delta3h >= 1.0) {
    return {
      label: 'MUITO BOM',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      icon: '📈',
      trendLabel: 'Subindo rápido',
      trendIcon: '↑',
      detail:
        'Pressão em forte alta — sinal clássico de bom sinal para a pesca. Atividade alta prevista para os peixes nas próximas horas.',
    };
  }
  if (delta3h >= 0.3) {
    return {
      label: 'BOM',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
      icon: '↗️',
      trendLabel: 'Subindo',
      trendIcon: '↑',
      detail: 'Pressão em alta suave. Bom sinal — tendência de boa atividade dos peixes.',
    };
  }
  if (delta3h > -0.3) {
    return {
      label: 'MÉDIO',
      color: 'text-slate-300',
      bg: 'bg-white/5 border-white/10',
      icon: '➡️',
      trendLabel: 'Estável',
      trendIcon: '→',
      detail: 'Pressão estável. Atividade normal dos peixes, sem grandes mudanças de comportamento esperadas.',
    };
  }
  if (delta3h > -1.0) {
    return {
      label: 'BOM NO INÍCIO',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      icon: '↘️',
      trendLabel: 'Caindo',
      trendIcon: '↓',
      detail: 'Pressão em queda. Boa pesca no início, mas os peixes tendem a parar de se alimentar em pouco tempo.',
    };
  }
  return {
    label: 'MAU',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30',
    icon: '📉',
    trendLabel: 'Caindo rápido',
    trendIcon: '↓',
    detail:
      'Queda brusca de pressão — geralmente indica chegada de frente fria ou mau tempo. Atividade dos peixes tende a cair bastante.',
  };
}

export default function BarometerCard({ lat, lon }: Props) {
  const [points, setPoints] = useState<PressurePoint[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=pressure_msl&past_days=1&forecast_days=1&timezone=auto`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const times: string[] = data?.hourly?.time ?? [];
        const values: number[] = data?.hourly?.pressure_msl ?? [];
        const pts = times
          .map((t, i) => ({ time: t, hPa: values[i] }))
          .filter((p): p is PressurePoint => typeof p.hPa === 'number');
        setPoints(pts);
      })
      .catch(() => {
        if (!cancelled) setPoints([]);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  const calc = useMemo(() => {
    if (!points || points.length === 0) return null;

    const now = new Date();
    let nowIdx = 0;
    let minDiff = Infinity;
    points.forEach((p, i) => {
      const diff = Math.abs(new Date(p.time).getTime() - now.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        nowIdx = i;
      }
    });

    const idx3hAgo = Math.max(0, nowIdx - 3);
    const current = points[nowIdx].hPa;
    const past = points[idx3hAgo].hPa;
    const delta = current - past;

    const last24h = points.slice(Math.max(0, nowIdx - 24), nowIdx + 1);
    const min = Math.min(...last24h.map((p) => p.hPa));
    const max = Math.max(...last24h.map((p) => p.hPa));

    return { current, delta, last24h, min, max, status: getBarometerStatus(delta) };
  }, [points]);

  if (points === null) {
    return (
      <section className="bg-[#0d1526] text-white rounded-3xl p-6 shadow-xl border border-white/5">
        <div className="h-40 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />
      </section>
    );
  }

  if (!calc) return null;

  const { current, delta, last24h, min, max, status } = calc;

  const W = 600;
  const H = 80;
  const pad = 4;
  const range = Math.max(0.5, max - min);
  const stepX = last24h.length > 1 ? (W - pad * 2) / (last24h.length - 1) : 0;
  const pathD = last24h
    .map((p, i) => {
      const x = pad + i * stepX;
      const y = pad + (H - pad * 2) * (1 - (p.hPa - min) / range);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <section className="bg-[#0d1526] text-white rounded-3xl p-6 shadow-xl border border-white/5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-2xl font-bold font-syne flex items-center gap-2 text-cyan-400">
          🌡️ Barômetro de Pesca
        </h2>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${status.bg} ${status.color}`}
        >
          <span>{status.icon}</span>
          <span>{status.label}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Pressão Atual</p>
          <p className="text-3xl font-bold text-white">
            {current.toFixed(1)} <span className="text-base font-medium text-slate-400">hPa</span>
          </p>
        </div>
        <div className={`rounded-2xl px-5 py-4 border ${status.bg}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Tendência (3h)</p>
          <p className={`text-2xl font-bold flex items-center gap-2 ${status.color}`}>
            <span>{status.trendIcon}</span>
            <span>{status.trendLabel}</span>
            <span className="text-sm font-medium opacity-70">
              ({delta >= 0 ? '+' : ''}
              {delta.toFixed(1)} hPa)
            </span>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[10px] font-black text-cyan-500/70 uppercase tracking-[0.2em] mb-3 px-1">
          Últimas 24 horas
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 overflow-x-auto">
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ minWidth: 280 }}>
            <path d={pathD} fill="none" stroke="#00D4FF" strokeWidth={2} />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-500 mt-2">
            <span>Mín {min.toFixed(1)} hPa</span>
            <span>Máx {max.toFixed(1)} hPa</span>
          </div>
        </div>
      </div>

      <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl border mb-6 ${status.bg}`}>
        <span className="text-xl leading-none mt-0.5">{status.icon}</span>
        <p className={`text-sm font-semibold ${status.color}`}>{status.detail}</p>
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
          Mudanças de pressão atmosférica influenciam a atividade dos peixes: pressão em alta ou em queda rápida
          costuma antecipar uma &quot;arrancada&quot; de fome antes da mudança de tempo, enquanto pressão estável
          mantém a atividade em ritmo normal. Dados de pressão ao nível do mar via Open-Meteo.
        </p>
      </div>
    </section>
  );
}

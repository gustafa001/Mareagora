'use client';

import { AlertTriangle, Waves } from 'lucide-react';
import { classifyRessaca } from '@/lib/ressaca';
import type { RessacaForecastDay } from '@/hooks/useSeaConditions';

interface RessacaAlertProps {
  swellHeight: number | null | undefined;
  swellPeriod: number | null | undefined;
  forecast?: RessacaForecastDay[];
  loading?: boolean;
}

const DAY_LABELS = ['Hoje', 'Amanhã', 'Dia +2', 'Dia +3'];

export default function RessacaAlert({ swellHeight, swellPeriod, forecast = [], loading }: RessacaAlertProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl p-5 animate-pulse">
        <div className="h-5 w-40 bg-white/10 rounded mb-3" />
        <div className="h-4 w-full bg-white/5 rounded" />
      </div>
    );
  }

  const current = classifyRessaca(swellHeight ?? null, swellPeriod ?? null);
  const upcoming = forecast
    .slice(0, 4)
    .map((d, idx) => ({ ...d, idx, cls: classifyRessaca(d.swellHeightMax, d.swellPeriodMax) }));

  const hasWarning = current.severity === 'ressaca' || current.severity === 'ressaca-forte';
  const upcomingWarning = upcoming.some((d) => d.idx > 0 && (d.cls.severity === 'ressaca' || d.cls.severity === 'ressaca-forte'));

  return (
    <section
      className="rounded-2xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl shadow-lg shadow-black/20 p-5 flex flex-col gap-4"
      style={{ borderColor: hasWarning ? `${current.color}55` : undefined }}
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {hasWarning ? (
            <AlertTriangle className="w-5 h-5" style={{ color: current.color }} />
          ) : (
            <Waves className="w-5 h-5 text-blue-400" />
          )}
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 font-syne">
            Previsão de Ressaca
          </h3>
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: `${current.color}22`, color: current.color, border: `1px solid ${current.color}55` }}
        >
          {current.label}
        </span>
      </header>

      <div className="flex items-center gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none">Swell agora</p>
          <p className="text-lg font-black font-syne text-white mt-1">
            {swellHeight != null ? `${swellHeight.toFixed(1)}m` : '--'}
            {swellPeriod != null && <span className="text-sm text-slate-400 font-bold ml-1.5">/ {swellPeriod.toFixed(0)}s</span>}
          </p>
        </div>
        <p className="text-sm text-slate-300 flex-1">{current.description}</p>
      </div>

      {upcoming.length > 1 && (
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10">
          {upcoming.map((d) => (
            <div key={d.date} className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{DAY_LABELS[d.idx] ?? d.date}</p>
              <p className="text-sm font-black font-syne mt-1" style={{ color: d.cls.color }}>
                {d.swellHeightMax != null ? `${d.swellHeightMax.toFixed(1)}m` : '--'}
              </p>
            </div>
          ))}
        </div>
      )}

      {upcomingWarning && !hasWarning && (
        <p className="text-xs text-amber-400 font-semibold">
          ⚠ Ressaca prevista nos próximos dias — confira a tábua antes de planejar atividades no mar.
        </p>
      )}
    </section>
  );
}

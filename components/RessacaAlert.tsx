'use client';

import { AlertTriangle, Waves, Compass } from 'lucide-react';
import { classifyRessaca, RESSACA_SCALE, ressacaGaugePosition } from '@/lib/ressaca';
import { degToCompass } from '@/lib/tideUtils';
import type { RessacaForecastDay } from '@/hooks/useSeaConditions';

interface RessacaAlertProps {
  swellHeight: number | null | undefined;
  swellPeriod: number | null | undefined;
  swellDirection?: number | null;
  forecast?: RessacaForecastDay[];
  loading?: boolean;
}

const WEEKDAYS_ABBR = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

/**
 * "YYYY-MM-DD" -> "Hoje" | "Amanhã" | "seg, 03" (real, a partir da data
 * que a própria API retorna em forecast[i].date — nunca "Dia +2/+3").
 */
function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Hoje';
  if (index === 1) return 'Amanhã';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = WEEKDAYS_ABBR[date.getDay()];
  return `${weekday}, ${String(d).padStart(2, '0')}`;
}

function RiskGauge({ swellHeight, swellPeriod }: { swellHeight: number | null; swellPeriod: number | null }) {
  const pct = ressacaGaugePosition(swellHeight, swellPeriod) * 100;
  const current = classifyRessaca(swellHeight, swellPeriod);

  return (
    <div className="pt-1">
      <div className="relative h-2 rounded-full overflow-hidden flex">
        {RESSACA_SCALE.map((s) => (
          <div key={s.severity} className="flex-1 h-full" style={{ background: s.color, opacity: 0.3 }} />
        ))}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: current.color }}
        />
        <div
          className="absolute -top-[3px] w-3.5 h-3.5 rounded-full border-2"
          style={{ left: `calc(${pct}% - 7px)`, background: '#0d1526', borderColor: current.color }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {RESSACA_SCALE.map((s) => (
          <span key={s.severity} className="text-[9px] uppercase tracking-wide text-slate-500">
            {s.short}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RessacaAlert({
  swellHeight,
  swellPeriod,
  swellDirection,
  forecast = [],
  loading,
}: RessacaAlertProps) {
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
    .slice(0, 7)
    .map((d, idx) => ({ ...d, idx, cls: classifyRessaca(d.swellHeightMax, d.swellPeriodMax) }));

  const hasWarning = current.severity === 'ressaca' || current.severity === 'ressaca-forte';
  const upcomingWarning = upcoming.some(
    (d) => d.idx > 0 && (d.cls.severity === 'ressaca' || d.cls.severity === 'ressaca-forte')
  );

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
            {swellPeriod != null && (
              <span className="text-sm text-slate-400 font-bold ml-1.5">/ {swellPeriod.toFixed(0)}s</span>
            )}
          </p>
          {swellDirection != null && (
            <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
              <Compass className="w-3 h-3" style={{ transform: `rotate(${swellDirection}deg)` }} />
              <span>{degToCompass(swellDirection)}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-300 flex-1">{current.description}</p>
      </div>

      <RiskGauge swellHeight={swellHeight ?? null} swellPeriod={swellPeriod ?? null} />

      {upcoming.length > 1 && (
        <div className="grid grid-cols-7 gap-1 pt-3 border-t border-white/10 overflow-x-auto">
          {upcoming.map((d) => (
            <div key={d.date} className="text-center">
              <p className="text-[9px] uppercase tracking-wide text-slate-500 font-bold whitespace-nowrap">
                {formatDayLabel(d.date, d.idx)}
              </p>
              <p className="text-xs font-black font-syne mt-1" style={{ color: d.cls.color }}>
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

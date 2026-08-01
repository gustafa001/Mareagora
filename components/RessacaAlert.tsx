'use client';

import { AlertTriangle, Waves, Compass } from 'lucide-react';
import {
  classifyRessaca,
  RESSACA_SCALE,
  ressacaGaugePosition,
  activityBanho,
  activitySurfe,
  activityPesca,
  calculateTrend,
  calculateBestWindow,
  calcularPicoDoDia,
} from '@/lib/ressaca';
import { degToCompass } from '@/lib/tideUtils';
import type { RessacaForecastDay, HourlySwellEntry } from '@/hooks/useSeaConditions';

interface RessacaAlertProps {
  swellHeight: number | null | undefined;
  swellPeriod: number | null | undefined;
  swellDirection?: number | null;
  windSpeed?: number | null;
  forecast?: RessacaForecastDay[];
  hourlyToday?: HourlySwellEntry[];
  loading?: boolean;
  error?: string | null;
}

const WEEKDAYS_ABBR = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

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
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: current.color }}
        />
        <div
          className="absolute -top-[3px] w-3.5 h-3.5 rounded-full border-2 shadow-lg transition-all duration-700"
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

function ActivityChipItem({ icon, label, status, color }: { icon: string; label: string; status: string; color: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2.5 min-w-[72px]"
      style={{ background: `${color}15`, border: `1px solid ${color}33` }}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{label}</span>
      <span className="text-xs font-black font-syne" style={{ color }}>{status}</span>
    </div>
  );
}

function BarChart({ forecast }: { forecast: RessacaForecastDay[] }) {
  const days = forecast.slice(0, 7);
  const maxVal = Math.max(...days.map((d) => d.swellHeightMax ?? 0), 0.5);

  return (
    <div className="overflow-x-auto pt-1">
      <div className="flex items-end gap-1.5 min-w-[320px]" style={{ height: 80 }}>
        {days.map((d, idx) => {
          const cls = classifyRessaca(d.swellHeightMax, d.swellPeriodMax);
          const h = d.swellHeightMax ?? 0;
          const barPct = maxVal > 0 ? (h / maxVal) * 100 : 0;
          const label = formatDayLabel(d.date, idx);
          return (
            <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
              {/* valor */}
              <span className="text-[10px] font-black font-syne" style={{ color: cls.color }}>
                {h > 0 ? `${h.toFixed(1)}m` : '--'}
              </span>
              {/* barra */}
              <div className="w-full rounded-t-md relative" style={{ height: 48, background: '#ffffff0a' }}>
                <div
                  className="absolute bottom-0 left-0 w-full rounded-t-md transition-all duration-700"
                  style={{ height: `${barPct}%`, background: cls.color, opacity: 0.85 }}
                />
              </div>
              {/* label dia */}
              <span className="text-[9px] text-slate-500 font-bold whitespace-nowrap">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RessacaAlert({
  swellHeight,
  swellPeriod,
  swellDirection,
  windSpeed,
  forecast = [],
  hourlyToday = [],
  loading,
  error,
}: RessacaAlertProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl p-5 animate-pulse">
        <div className="h-5 w-40 bg-white/10 rounded mb-3" />
        <div className="h-24 bg-white/5 rounded mb-3" />
        <div className="h-4 w-full bg-white/5 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl p-5 text-sm text-slate-400">
        {error} Tente novamente em instantes.
      </div>
    );
  }

  const h = swellHeight ?? null;
  const p = swellPeriod ?? null;
  const current = classifyRessaca(h, p);
  const hasWarning = current.severity === 'ressaca' || current.severity === 'ressaca-forte';

  const banho = activityBanho(h, p);
  const surfe = activitySurfe(h, p);
  const pesca = activityPesca(h, p, windSpeed ?? null);

  const trend = calculateTrend(forecast);
  const bestWindow = calculateBestWindow(hourlyToday);
  const pico = calcularPicoDoDia(hourlyToday);

  // Antes olhava só os 3 dias seguintes — agora cobre toda a janela de 7 dias
  // que a API já retorna (mesma janela usada no gráfico de barras abaixo),
  // e aponta o primeiro dia em que a ressaca deve chegar.
  const upcomingRessacaDay = forecast.slice(1).find((d) => {
    const c = classifyRessaca(d.swellHeightMax, d.swellPeriodMax);
    return c.severity === 'ressaca' || c.severity === 'ressaca-forte';
  });
  const upcomingWarning = Boolean(upcomingRessacaDay);
  const upcomingWarningLabel = upcomingRessacaDay
    ? formatDayLabel(upcomingRessacaDay.date, forecast.indexOf(upcomingRessacaDay))
    : null;

  return (
    <section
      className="rounded-2xl border border-white/10 bg-[#0d1526]/90 backdrop-blur-xl shadow-lg shadow-black/20 p-5 flex flex-col gap-4"
      style={{ borderColor: hasWarning ? `${current.color}55` : undefined }}
    >
      {/* Cabeçalho */}
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

      {/* Swell agora + descrição */}
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none">Swell agora</p>
          <p className="text-3xl font-black font-syne text-white mt-1 leading-none">
            {h != null ? `${h.toFixed(1)}m` : '--'}
            {p != null && <span className="text-base text-slate-400 font-bold ml-2">/ {p.toFixed(0)}s</span>}
          </p>
          {swellDirection != null && (
            <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-400">
              <Compass className="w-3.5 h-3.5" style={{ transform: `rotate(${swellDirection}deg)` }} />
              <span>{degToCompass(swellDirection)}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-300 flex-1 leading-relaxed pt-0.5">{current.description}</p>
      </div>

      {/* Risk Gauge */}
      <RiskGauge swellHeight={h} swellPeriod={p} />

      {/* Chips de atividade */}
      <div className="flex gap-2">
        <ActivityChipItem {...banho} />
        <ActivityChipItem {...surfe} />
        <ActivityChipItem {...pesca} />
      </div>

      {/* Tendência e Melhor Janela */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-xs text-slate-400 font-semibold">{trend.label}</span>
        {bestWindow && (
          <span className="text-xs text-slate-400 font-semibold">⏱ Melhor janela: {bestWindow}</span>
        )}
      </div>

      {/* Gráfico de barras dos 7 dias */}
      {forecast.length > 0 && (
        <div className="rounded-xl bg-black/20 p-3 border border-white/5">
          <BarChart forecast={forecast} />
        </div>
      )}

      {upcomingWarning && !hasWarning && (
        <p className="text-xs text-amber-400 font-semibold">
          ⚠ Ressaca prevista para {upcomingWarningLabel} — confira a tábua antes de planejar atividades no mar.
        </p>
      )}

      {/* Pico do dia */}
      {pico && (
        <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 px-3 py-2.5">
          <span className="text-xs text-slate-400 font-semibold">
            Pico previsto hoje
          </span>
          <span className="text-xs font-black font-syne" style={{ color: pico.classificacao.color }}>
            {pico.alturaM.toFixed(1)}m
            {pico.periodoS !== null && ` / ${pico.periodoS}s`} às {pico.horario}
          </span>
        </div>
      )}

      <p className="text-[10px] text-slate-500">
        Fonte: Open-Meteo (modelo GFS Wave) · atualizado a cada hora
      </p>
    </section>
  );
}

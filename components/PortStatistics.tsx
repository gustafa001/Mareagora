'use client';

import { useMemo } from 'react';

interface TideEvento {
  data: string;
  mares: { hora: string; altura_m: number; tipo: string }[];
}

interface PortStatisticsProps {
  eventos: TideEvento[];
  portName: string;
}

export default function PortStatistics({ eventos, portName }: PortStatisticsProps) {
  const stats = useMemo(() => {
    const allTides = eventos.flatMap((e) => e.mares);
    if (allTides.length === 0) return null;

    // Classificar marés altas e baixas corretamente (por picos e vales)
    const highs = allTides.filter((t) => {
      const idx = allTides.indexOf(t);
      const prev = allTides[idx - 1]?.altura_m ?? -Infinity;
      const next = allTides[idx + 1]?.altura_m ?? -Infinity;
      return t.altura_m > prev && t.altura_m > next;
    });

    const lows = allTides.filter((t) => {
      const idx = allTides.indexOf(t);
      const prev = allTides[idx - 1]?.altura_m ?? Infinity;
      const next = allTides[idx + 1]?.altura_m ?? Infinity;
      return t.altura_m < prev && t.altura_m < next;
    });

    const allHeights = allTides.map((t) => t.altura_m);

    const maxHeight = Math.max(...allHeights);
    const minHeight = Math.min(...allHeights);
    const avgHeight = allHeights.reduce((a, b) => a + b, 0) / allHeights.length;
    const amplitude = maxHeight - minHeight;

    // Encontrar a data da maré máxima
    const maxEvent = allTides.find((t) => t.altura_m === maxHeight);
    const maxDay = eventos.find((e) => e.mares.includes(maxEvent!));

    // Encontrar a data da maré mínima
    const minEvent = allTides.find((t) => t.altura_m === minHeight);
    const minDay = eventos.find((e) => e.mares.includes(minEvent!));

    return {
      maxHeight: maxHeight.toFixed(2),
      minHeight: minHeight.toFixed(2),
      avgHeight: avgHeight.toFixed(2),
      amplitude: amplitude.toFixed(2),
      maxDay: maxDay?.data ?? '--',
      minDay: minDay?.data ?? '--',
      totalDays: eventos.length,
      totalHighs: highs.length,
      totalLows: lows.length,
    };
  }, [eventos]);

  if (!stats) return null;

  return (
    <section className="classic-card bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
      <h2 className="card-title text-slate-900 dark:text-white mb-6">📊 Estatísticas de Maré — {portName}</h2>
      
      {/* Grid principal com 4 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Maior maré */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-cyan-100/80 to-cyan-50/40 dark:from-cyan-500/20 dark:to-cyan-600/10 border border-cyan-300/50 dark:border-cyan-500/30 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-cyan-700 dark:text-cyan-400 mb-1">{stats.maxHeight}m</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Maior maré</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">{stats.maxDay}</div>
          </div>
        </div>

        {/* Menor maré */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-orange-100/80 to-orange-50/40 dark:from-orange-500/20 dark:to-orange-600/10 border border-orange-300/50 dark:border-orange-500/30 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-400/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-orange-700 dark:text-orange-400 mb-1">{stats.minHeight}m</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Menor maré</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">{stats.minDay}</div>
          </div>
        </div>

        {/* Média anual */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-teal-100/80 to-teal-50/40 dark:from-teal-500/20 dark:to-teal-600/10 border border-teal-300/50 dark:border-teal-500/30 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-400/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-teal-700 dark:text-teal-400 mb-1">{stats.avgHeight}m</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Média anual</div>
          </div>
        </div>

        {/* Dias no ano */}
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-slate-100/80 to-slate-50/40 dark:from-slate-700/40 dark:to-slate-800/40 border border-slate-300/50 dark:border-slate-600/50 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-slate-400/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-slate-700 dark:text-slate-300 mb-1">{stats.totalDays}</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Dias no ano</div>
          </div>
        </div>
      </div>

      {/* Cards secundários */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Amplitude */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-blue-100/60 to-blue-50/30 dark:from-blue-500/15 dark:to-blue-600/5 border border-blue-200/60 dark:border-blue-500/20">
          <div className="relative z-10">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.amplitude}m</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Amplitude</div>
          </div>
        </div>

        {/* Marés altas */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-cyan-100/60 to-cyan-50/30 dark:from-cyan-500/15 dark:to-cyan-600/5 border border-cyan-200/60 dark:border-cyan-500/20">
          <div className="relative z-10">
            <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{stats.totalHighs}</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Marés altas</div>
          </div>
        </div>

        {/* Marés baixas */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-orange-100/60 to-orange-50/30 dark:from-orange-500/15 dark:to-orange-600/5 border border-orange-200/60 dark:border-orange-500/20">
          <div className="relative z-10">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{stats.totalLows}</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Marés baixas</div>
          </div>
        </div>
      </div>
    </section>
  );
}

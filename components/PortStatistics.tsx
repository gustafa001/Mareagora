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
      maxDay: maxDay?.data ?? '--',
      minDay: minDay?.data ?? '--',
      totalDays: eventos.length,
      totalHighs: highs.length,
      totalLows: lows.length,
    };
  }, [eventos]);

  if (!stats) return null;

  return (
    <section className="classic-card">
      <h2 className="card-title">📊 Estatísticas de Maré — {portName}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <div className="text-2xl font-extrabold text-blue-600 font-syne">{stats.maxHeight}m</div>
          <div className="text-xs text-gray-500 mt-1">Maior maré</div>
          <div className="text-xs text-gray-400">{stats.maxDay}</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-xl">
          <div className="text-2xl font-extrabold text-orange-600 font-syne">{stats.minHeight}m</div>
          <div className="text-xs text-gray-500 mt-1">Menor maré</div>
          <div className="text-xs text-gray-400">{stats.minDay}</div>
        </div>
        <div className="text-center p-3 bg-teal-50 rounded-xl">
          <div className="text-2xl font-extrabold text-teal-600 font-syne">{stats.avgHeight}m</div>
          <div className="text-xs text-gray-500 mt-1">Média anual</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <div className="text-2xl font-extrabold text-gray-600 font-syne">{stats.totalDays}</div>
          <div className="text-xs text-gray-500 mt-1">Dias no ano</div>
        </div>
      </div>

      {/* Estatísticas adicionais */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-100/50 rounded-lg border border-blue-200">
          <div className="text-lg font-bold text-blue-700">{stats.totalHighs}</div>
          <div className="text-xs text-blue-600">Marés altas</div>
        </div>
        <div className="p-3 bg-orange-100/50 rounded-lg border border-orange-200">
          <div className="text-lg font-bold text-orange-700">{stats.totalLows}</div>
          <div className="text-xs text-orange-600">Marés baixas</div>
        </div>
      </div>
    </section>
  );
}

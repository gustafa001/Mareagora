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

    const highs = allTides.filter((t) => t.altura_m >= 0.5);
    const lows = allTides.filter((t) => t.altura_m < 0.5);
    const allHeights = allTides.map((t) => t.altura_m);

    const maxHeight = Math.max(...allHeights);
    const minHeight = Math.min(...allHeights);
    const avgHeight = allHeights.reduce((a, b) => a + b, 0) / allHeights.length;

    const maxEvent = allTides.find((t) => t.altura_m === maxHeight);
    const maxDay = eventos.find((e) => e.mares.includes(maxEvent!));

    return {
      maxHeight: maxHeight.toFixed(2),
      minHeight: minHeight.toFixed(2),
      avgHeight: avgHeight.toFixed(2),
      maxDay: maxDay?.data ?? '--',
      totalDays: eventos.length,
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
    </section>
  );
}


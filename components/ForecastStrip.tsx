"use client";

import { useEffect, useState } from "react";

interface ForecastStripProps {
  lat: number;
  lon: number;
}

function waveIcon(maxW: number): string {
  if (maxW < 0.3) return "🏝️"; // plano / lago
  if (maxW < 0.8) return "〰️"; // fraco
  if (maxW < 1.5) return "🏄"; // bom para surf
  if (maxW < 2.5) return "🌊"; // moderado
  if (maxW < 3.5) return "⚠️"; // forte
  return "🚨";                  // muito forte / perigoso
}

function waveLabel(maxW: number): string {
  if (maxW < 0.3) return "Plano";
  if (maxW < 0.8) return "Fraco";
  if (maxW < 1.5) return "Bom";
  if (maxW < 2.5) return "Mod.";
  if (maxW < 3.5) return "Forte";
  return "Perig.";
}

export default function ForecastStrip({ lat, lon }: ForecastStripProps) {
  const [dayData, setDayData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchForecast() {
      const url =
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
        `&hourly=wave_height,wave_period&timezone=America%2FSao_Paulo&forecast_days=7`;

      try {
        const res = await fetch(url);
        const json = await res.json();

        if (!json?.hourly?.time) return;

        const h = json.hourly;
        const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const seen = new Set<string>();
        const results: any[] = [];

        h.time.forEach((t: string, i: number) => {
          const d = new Date(t);
          const key = d.toDateString();
          if (!seen.has(key) && results.length < 7) {
            seen.add(key);

            const idxs = h.time
              .map((tt: string, ii: number) =>
                new Date(tt).toDateString() === key ? ii : -1
              )
              .filter((x: number) => x >= 0);

            const heights = idxs.map((ii: number) => h.wave_height?.[ii] ?? 0);
            const periods = idxs.map((ii: number) => h.wave_period?.[ii] ?? 0);

            const maxW = heights.length > 0 ? Math.max(...heights) : 0;
            const minW = heights.length > 0 ? Math.min(...heights) : 0;
            const avgP =
              periods.length > 0
                ? periods.reduce((a: number, b: number) => a + b, 0) / periods.length
                : 0;

            results.push({
              label: days[d.getDay()],
              maxW: maxW.toFixed(1),
              minW: minW.toFixed(1),
              avgP: avgP.toFixed(0),
            });
          }
        });

        setDayData(results);
      } catch {}
    }
    fetchForecast();
  }, [lat, lon]);

  return (
    <div className="classic-card">
      <h3 className="card-title mb-4">📅 Próximos 7 dias</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {dayData.map((d, i) => {
          const max = parseFloat(d.maxW);
          return (
            <div
              key={i}
              className={`flex flex-col items-center justify-center border ${
                i === activeIndex
                  ? "border-blue-400 bg-blue-50/50"
                  : "border-gray-100 bg-gray-50"
              } rounded-xl py-3 px-1 cursor-pointer hover:border-blue-300 transition-colors w-full`}
              onClick={() => setActiveIndex(i)}
            >
              <div className="text-[0.6rem] font-bold uppercase text-gray-500 mb-1">
                {d.label}
              </div>
              <div className="text-lg mb-1">{waveIcon(max)}</div>
              <div className="text-xs font-bold text-blue-600">{d.maxW}m</div>
              <div className="text-[0.6rem] text-orange-400 font-medium">{d.minW}m</div>
              <div className="text-[0.55rem] text-gray-400 mt-0.5 hidden sm:block">
                {d.avgP}s
              </div>
              <div className="text-[0.55rem] text-gray-400 font-medium hidden sm:block">
                {waveLabel(max)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

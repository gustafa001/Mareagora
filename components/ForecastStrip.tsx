"use client";

import { useEffect, useState } from "react";

interface ForecastStripProps {
  lat: number;
  lon: number;
}

export default function ForecastStrip({ lat, lon }: ForecastStripProps) {
  const [dayData, setDayData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchForecast() {
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=America%2FSao_Paulo&forecast_days=7`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        const h = json.hourly;
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const seen = new Set();
        const results: any[] = [];

        h.time.forEach((t: string, i: number) => {
          const d = new Date(t);
          const key = d.toDateString();
          if (!seen.has(key) && results.length < 7) {
            seen.add(key);
            const dayIdxs = h.time.map((tt: string, ii: number) => new Date(tt).toDateString() === key ? ii : -1).filter((x: number) => x >= 0);
            const maxW = Math.max(...dayIdxs.map((ii: number) => h.wave_height[ii] || 0));
            const minW = Math.min(...dayIdxs.map((ii: number) => h.wave_height[ii] || 0));
            results.push({ 
              label: days[d.getDay()], 
              maxW: maxW.toFixed(1), 
              minW: minW.toFixed(1) 
            });
          }
        });
        setDayData(results);
      } catch (e) {}
    }
    fetchForecast();
  }, [lat, lon]);

  return (
    <div className="card">
      <div className="card-title">📅 Próximos 7 dias</div>
      <div className="forecast-strip">
        {dayData.map((d, i) => {
          const wIcon = parseFloat(d.maxW) < 0.5 ? '🌊' : parseFloat(d.maxW) < 1.5 ? '🏄' : parseFloat(d.maxW) < 2.5 ? '🌊' : '⚠️';
          return (
            <div 
              key={i} 
              className={`fc-day ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <div className="fc-day-name text-[0.72rem] font-syne font-bold uppercase text-[var(--muted)] mb-1">{d.label}</div>
              <div className="fc-icon text-xl mb-1">{wIcon}</div>
              <div className="fc-high text-sm font-syne font-bold text-[var(--foam)]">{d.maxW}m</div>
              <div className="fc-low text-[0.75rem] text-[var(--sun)]">{d.minW}m</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
        
        if (!json || !json.hourly || !json.hourly.time) {
          return;
        }

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
            
            const heights = dayIdxs.map((ii: number) => h.wave_height ? h.wave_height[ii] : 0);
            const maxW = heights.length > 0 ? Math.max(...heights) : 0;
            const minW = heights.length > 0 ? Math.min(...heights) : 0;
            
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
    <div className="classic-card">
      <h3 className="card-title mb-4">📅 Próximos 7 dias</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {dayData.map((d, i) => {
          const wIcon = parseFloat(d.maxW) < 0.5 ? '🌊' : parseFloat(d.maxW) < 1.5 ? '🏄' : parseFloat(d.maxW) < 2.5 ? '🌊' : '⚠️';
          return (
            <div 
              key={i} 
              className={`flex-shrink-0 flex flex-col items-center justify-center border ${i === activeIndex ? 'border-blue-400 bg-blue-50/50' : 'border-gray-100 bg-gray-50'} rounded-xl p-3 min-w-[75px] cursor-pointer hover:border-blue-300 transition-colors`}
              onClick={() => setActiveIndex(i)}
            >
              <div className="text-[0.65rem] font-bold uppercase text-gray-500 mb-2">{d.label}</div>
              <div className="text-xl mb-1">{wIcon}</div>
              <div className="text-sm font-bold text-blue-600">{d.maxW}m</div>
              <div className="text-[0.7rem] text-orange-400 font-medium">{d.minW}m</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

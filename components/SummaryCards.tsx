"use client";

import { TideEvent } from "@/lib/tideUtils";
import { useEffect, useState } from "react";

interface SummaryCardsProps {
  nextHigh: TideEvent | null;
  nextLow: TideEvent | null;
  lat: number;
  lon: number;
}

export default function SummaryCards({ nextHigh, nextLow, lat, lon }: SummaryCardsProps) {
  const [seaData, setSeaData] = useState<{wind: string, waves: string, colorClass: string, time: string} | null>(null);

  useEffect(() => {
    async function fetchSeaConditions() {
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=America%2FSao_Paulo&forecast_days=1`;
      const windUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m&wind_speed_unit=kmh&timezone=America%2FSao_Paulo`;
      
      try {
        const resWave = await fetch(url);
        const jsonWave = await resWave.json();
        
        const resWind = await fetch(windUrl);
        const jsonWind = await resWind.json();

        const h = jsonWave.hourly;
        const now = new Date();
        const nowPad = now.getHours().toString().padStart(2, '0');
        const todayStr = now.toLocaleDateString('en-CA');
        
        const idx = h.time.findIndex((t: string) => {
          return t.startsWith(todayStr) && t.includes(`T${nowPad}:`);
        });
        const i = idx >= 0 ? idx : 0;
        const waveHeight = h.wave_height[i];
        const wavesStr = waveHeight !== undefined ? `${waveHeight.toFixed(1)} m` : "--";

        const windSpeed = jsonWind.current?.wind_speed_10m;
        const windStr = windSpeed !== undefined ? `${windSpeed.toFixed(0)} km/h` : "--";

        let colorClass = "card-mar-calmo";
        if (waveHeight >= 2.5) colorClass = "card-mar-revolto";
        else if (waveHeight >= 1.5) colorClass = "card-mar-agitado";
        else if (waveHeight >= 0.8) colorClass = "card-mar-suave";
        
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        setSeaData({
          wind: windStr,
          waves: wavesStr,
          colorClass,
          time: timeStr
        });

      } catch (e) {
        console.error("Erro ao buscar conditions do SummaryCards", e);
        const now = new Date();
        setSeaData({
          wind: "--",
          waves: "--",
          colorClass: "card-mar-suave",
          time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
      }
    }
    fetchSeaConditions();
  }, [lat, lon]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 relative z-20">
      {/* Próxima Maré Alta */}
      <div className="summary-card bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl hover:shadow-2xl flex flex-col justify-between min-h-[160px] border border-blue-400/50">
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-95 bg-white/20 px-3 py-1 rounded-full text-white">Próxima Alta</span>
            <span className="text-2xl animate-bounce">🌊</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne text-white">{nextHigh?.hora || "--:--"}</div>
        </div>
        <div className="text-lg font-bold mt-2 text-white/95 tracking-wide bg-white/10 px-3 py-2 rounded-lg w-fit">
          +{nextHigh?.altura_m?.toFixed(2) ?? "--"} m
        </div>
      </div>

      {/* Próxima Maré Baixa */}
      <div className="summary-card bg-gradient-to-br from-orange-500 to-orange-700 shadow-xl hover:shadow-2xl flex flex-col justify-between min-h-[160px] border border-orange-400/50">
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-95 bg-white/20 px-3 py-1 rounded-full text-white">Próxima Baixa</span>
            <span className="text-2xl">📉</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne text-white">{nextLow?.hora || "--:--"}</div>
        </div>
        <div className="text-lg font-bold mt-2 text-white/95 tracking-wide bg-white/10 px-3 py-2 rounded-lg w-fit">
          +{nextLow?.altura_m?.toFixed(2) ?? "--"} m
        </div>
      </div>

      {/* Condições Agora */}
      <div className={`summary-card shadow-xl hover:shadow-2xl flex flex-col justify-between min-h-[160px] transition-all duration-700 border border-white/30 ${
        seaData?.colorClass === 'card-mar-revolto' ? 'bg-gradient-to-br from-red-500 to-red-700 border-red-400/50' :
        seaData?.colorClass === 'card-mar-agitado' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 border-indigo-400/50' :
        seaData?.colorClass === 'card-mar-suave' ? 'bg-gradient-to-br from-teal-500 to-teal-700 border-teal-400/50' :
        'bg-gradient-to-br from-cyan-500 to-cyan-700 border-cyan-400/50'
      } ${!seaData ? 'loading-shimmer' : ''}`}>
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-95 bg-white/20 px-3 py-1 rounded-full text-white">Condições Agora</span>
            <span className="text-2xl animate-pulse">🕒</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne text-white">{seaData?.time || "--:--"}</div>
        </div>
        <div className="text-sm font-bold text-white/95 mt-2 leading-tight bg-white/10 px-3 py-2 rounded-lg">
          🌬️ {seaData?.wind || "--"} · 🌊 {seaData?.waves || "--"}
        </div>
      </div>
    </div>
  );
}

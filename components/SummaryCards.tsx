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
        const nowH = now.getHours();
        
        const idx = h.time.findIndex((t: string) => {
          const d = new Date(t);
          return d.getHours() === nowH && d.toDateString() === now.toDateString();
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
      <div className="summary-card glass-card card-mare-alta flex flex-col justify-between min-h-[160px]">
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-80 backdrop-blur-sm shadow-sm md:shadow-none bg-black/10 px-2 py-0.5 rounded md:bg-transparent md:px-0 md:py-0 md:rounded-none inline-block">Próxima Alta</span>
            <span className="text-2xl drop-shadow-md">🌊</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne drop-shadow-md">{nextHigh?.hora || "--:--"}</div>
        </div>
        <div className="text-lg font-bold mt-2 drop-shadow-sm tracking-wide">+{nextHigh?.altura_m.toFixed(2)} m</div>
      </div>

      {/* Próxima Maré Baixa */}
      <div className="summary-card glass-card card-mare-baixa flex flex-col justify-between min-h-[160px]">
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-80 backdrop-blur-sm shadow-sm md:shadow-none bg-black/10 px-2 py-0.5 rounded md:bg-transparent md:px-0 md:py-0 md:rounded-none inline-block">Próxima Baixa</span>
            <span className="text-2xl drop-shadow-md">📉</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne drop-shadow-md">{nextLow?.hora || "--:--"}</div>
        </div>
        <div className="text-lg font-bold mt-2 drop-shadow-sm tracking-wide">+{nextLow?.altura_m.toFixed(2)} m</div>
      </div>

      {/* Condições Agora */}
      <div className={`summary-card glass-card ${seaData ? seaData.colorClass : 'card-mar-suave loading-shimmer'} flex flex-col justify-between min-h-[160px] transition-all duration-700`}>
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-80 backdrop-blur-sm shadow-sm md:shadow-none bg-black/10 px-2 py-0.5 rounded md:bg-transparent md:px-0 md:py-0 md:rounded-none inline-block">Condições Agora</span>
            <span className="text-xl animate-pulse">🕒</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne drop-shadow-md">{seaData?.time || "--:--"}</div>
        </div>
        <div className="text-sm font-bold opacity-90 mt-2 leading-tight drop-shadow-sm bg-black/10 px-3 py-1.5 rounded-lg inline-block self-start">
          Vento: {seaData?.wind || "--"} · Ondas: {seaData?.waves || "--"}
        </div>
      </div>
    </div>
  );
}

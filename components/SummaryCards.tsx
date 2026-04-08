"use client";

import { TideEvent } from "@/lib/tideUtils";
import { useEffect, useState } from "react";

interface SummaryCardsProps {
  nextHigh: TideEvent | null;
  nextLow: TideEvent | null;
  lat: number;
  lon: number;
}

import { useSeaConditions } from "@/hooks/useSeaConditions";

export default function SummaryCards({ nextHigh, nextLow, lat, lon }: SummaryCardsProps) {
  const { waveHeight, windSpeed, loading } = useSeaConditions(lat, lon);
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const wavesStr = waveHeight !== null ? `${waveHeight.toFixed(1)} m` : "--";
  const windStr = windSpeed !== null ? `${windSpeed.toFixed(0)} km/h` : "--";

  let colorClass = "card-mar-calmo";
  if (waveHeight !== null) {
    if (waveHeight >= 2.5) colorClass = "card-mar-revolto";
    else if (waveHeight >= 1.5) colorClass = "card-mar-agitado";
    else if (waveHeight >= 0.8) colorClass = "card-mar-suave";
  }

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
      <div className={`summary-card glass-card ${!loading ? colorClass : 'card-mar-suave loading-shimmer'} flex flex-col justify-between min-h-[160px] transition-all duration-700`}>
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-80 backdrop-blur-sm shadow-sm md:shadow-none bg-black/10 px-2 py-0.5 rounded md:bg-transparent md:px-0 md:py-0 md:rounded-none inline-block">Condições Agora</span>
            <span className="text-xl animate-pulse">🕒</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne drop-shadow-md">{timeStr}</div>
        </div>
        <div className="text-sm font-bold opacity-90 mt-2 leading-tight drop-shadow-sm bg-black/10 px-3 py-1.5 rounded-lg inline-block self-start">
          Vento: {windStr} · Ondas: {wavesStr}
        </div>
      </div>
    </div>
  );
}

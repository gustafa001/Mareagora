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
import { getMoonAge, getMoonPhase, getTideCoefficient } from "@/lib/tideUtils";

export default function SummaryCards({ nextHigh, nextLow, lat, lon }: SummaryCardsProps) {
  const { waveHeight, windSpeed, loading } = useSeaConditions(lat, lon);
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const wavesStr = waveHeight !== null ? `${waveHeight.toFixed(1)} m` : "--";
  const windStr = windSpeed !== null ? `${windSpeed.toFixed(0)} km/h` : "--";

  const moonAge = getMoonAge(now);
  const moon = getMoonPhase(moonAge);
  const coef = getTideCoefficient(moonAge);

  let colorClass = "card-mar-calmo";
  if (waveHeight !== null) {
    if (waveHeight >= 2.5) colorClass = "card-mar-revolto";
    else if (waveHeight >= 1.5) colorClass = "card-mar-agitado";
    else if (waveHeight >= 0.8) colorClass = "card-mar-suave";
  }

  return (
    <div className="flex flex-col gap-6 -mt-16 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Coeficiente e Lua — Design Refinado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="summary-card glass-card bg-slate-900/40 border-white/5 p-6 flex items-center justify-between rounded-[2rem] hover:bg-slate-900/60 transition-all duration-500">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner border border-white/5">
              📊
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Coeficiente</div>
              <div className={`text-4xl font-black font-syne leading-none ${coef.color} drop-shadow-sm`}>{coef.value}</div>
              <div className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${coef.color.replace('text-', 'bg-')}`}></span>
                {coef.label}
              </div>
            </div>
          </div>
          <div className="hidden lg:block text-right max-w-[140px]">
            <p className="text-[10px] leading-relaxed text-slate-500 font-medium italic">
              Amplitude da maré. Valores altos indicam marés vivas.
            </p>
          </div>
        </div>

        <div className="summary-card glass-card bg-slate-900/40 border-white/5 p-6 flex items-center justify-between rounded-[2rem] hover:bg-slate-900/60 transition-all duration-500">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shadow-inner border border-white/5">
              {moon.icon}
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Fase Lunar</div>
              <div className="text-3xl font-black font-syne text-white leading-none drop-shadow-sm">{moon.name}</div>
              <div className="text-xs font-bold text-blue-400/80 mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Influência na Pesca
              </div>
            </div>
          </div>
          <div className="hidden lg:block text-right max-w-[140px]">
            <p className="text-[10px] leading-relaxed text-slate-500 font-medium italic">
              A lua rege a força das marés e o peixe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

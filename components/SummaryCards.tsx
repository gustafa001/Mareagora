"use client";

import { TideEvent } from "@/lib/tideUtils";

interface SummaryCardsProps {
  nextHigh: TideEvent | null;
  nextLow: TideEvent | null;
  currentConditions: {
    temp?: string;
    wind?: string;
    waves?: string;
    time?: string;
  };
}

export default function SummaryCards({ nextHigh, nextLow, currentConditions }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 relative z-20">
      {/* Próxima Maré Alta */}
      <div className="summary-card bg-mare-high flex flex-col justify-between min-h-[160px]">
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-80">Próxima Maré Alta</span>
            <span className="text-2xl">↑</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne">{nextHigh?.hora || "--:--"}</div>
        </div>
        <div className="text-lg font-bold mt-2">+{nextHigh?.altura_m.toFixed(2)} m</div>
      </div>

      {/* Próxima Maré Baixa */}
      <div className="summary-card bg-mare-low flex flex-col justify-between min-h-[160px]">
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-80">Próxima Maré Baixa</span>
            <span className="text-2xl">↓</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne">{nextLow?.hora || "--:--"}</div>
        </div>
        <div className="text-lg font-bold mt-2">+{nextLow?.altura_m.toFixed(2)} m</div>
      </div>

      {/* Condições Agora */}
      <div className="summary-card bg-mare-cond flex flex-col justify-between min-h-[160px]">
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold opacity-80">Condições Agora</span>
            <span className="text-xl">🕒</span>
          </div>
          <div className="text-4xl font-extrabold mt-4 font-syne">{currentConditions.time || "--:--"}</div>
        </div>
        <div className="text-sm font-medium mt-2 leading-tight">
          Vento: {currentConditions.wind || "--"} - Ondas: {currentConditions.waves || "--"}
        </div>
      </div>
    </div>
  );
}

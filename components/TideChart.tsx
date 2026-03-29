"use client";

import { tideAtMinute, TideEvent } from "@/lib/tideUtils";
import { useEffect, useState } from "react";

interface TideChartProps {
  tides: TideEvent[];
}

export default function TideChart({ tides }: TideChartProps) {
  const [nowMin, setNowMin] = useState(0);

  useEffect(() => {
    const update = () => {
      const date = new Date();
      setNowMin(date.getHours() * 60 + date.getMinutes());
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!tides || tides.length === 0) {
    return (
      <div className="mt-5 mb-2 rounded-xl flex items-center justify-center bg-[rgba(56,201,240,0.05)] h-[90px]">
        <span className="text-[var(--muted)] text-xs font-syne uppercase tracking-widest">Sem dados de gráfico</span>
      </div>
    );
  }

  const W = 600, H = 90, PAD_V = 8;
  const heights = tides.map(t => t.altura_m);
  const maxH = Math.max(...heights);
  const minH = Math.min(...heights);
  const range = maxH - minH || 1;

  const pts: [number, number][] = [];
  for (let m = 0; m <= 1440; m += 10) {
    const h = tideAtMinute(m, tides);
    const x = (m / 1440) * W;
    const y = H - PAD_V - ((h - minH) / range) * (H - PAD_V * 2);
    pts.push([x, y]);
  }

  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const area = d + ` L${W},${H} L0,${H} Z`;

  const cursorPct = (nowMin / 1440) * 100;

  // Calcula as posições dos eventos de maré para os pontos no gráfico
  const tidePoints = tides.map(t => {
    const [h, m] = t.hora.split(':').map(Number);
    const min = (h || 0) * 60 + (m || 0);
    const x = (min / 1440) * W;
    const y = H - PAD_V - ((t.altura_m - minH) / range) * (H - PAD_V * 2);
    
    // Simplificando o tipo (se subir em relação ao nível médio ou vizinhos)
    // No print: picos são azuis, vales são laranjas.
    const isHigh = t.altura_m >= (maxH + minH) / 2;
    
    return { x, y, label: `${t.hora} ${t.altura_m.toFixed(2)}m`, isHigh };
  });

  return (
    <div className="mt-8 mb-4">
      <h3 className="card-title mb-8">Tabela de Marés</h3>
      <div className="relative h-[220px] bg-white rounded-xl p-4 overflow-visible shadow-sm border border-gray-100">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity=".15" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Linha de base opcional */}
          <line x1="0" y1={H} x2={W} y2={H} stroke="#edf2f7" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Área e Linha da Curva */}
          <path d={area} fill="url(#cg)" />
          <path d={d} fill="none" stroke="#2a68f6" strokeWidth="2.5" strokeLinejoin="round" />
          
          {/* Pontos de Maré e Labels */}
          {tidePoints.map((p, i) => (
            <g key={i}>
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="4" 
                fill="white" 
                stroke={p.isHigh ? "#2a68f6" : "#ff914d"} 
                strokeWidth="2.5" 
              />
              <text 
                x={p.x} 
                y={p.y - 12} 
                textAnchor="middle" 
                fontSize="10" 
                fontWeight="700"
                className="fill-gray-700 font-inter"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Cursor de Tempo Atual */}
        <div 
          className="absolute top-4 bottom-4 w-[1px] border-l border-dashed border-gray-300 pointer-events-none transition-all duration-500" 
          style={{ left: `calc(${cursorPct}% + 16px)` }}
        />
      </div>
      
      <div className="flex justify-between text-[0.65rem] font-bold text-gray-400 mt-3 px-4 uppercase tracking-tighter">
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>
    </div>
  );
}

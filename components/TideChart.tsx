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

  return (
    <div className="mt-5 mb-2 rounded-xl overflow-hidden bg-transparent">
      <div className="relative h-[90px] overflow-hidden rounded-xl">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38c9f0" stopOpacity=".5" />
              <stop offset="100%" stopColor="#0e7fbe" stopOpacity=".05" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#cg)" />
          <path d={d} fill="none" stroke="#38c9f0" strokeWidth="2" />
        </svg>
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-[var(--sun)] shadow-[0_0_8px_var(--sun)] rounded-sm transition-all duration-500 ease-in-out" 
          style={{ left: `${cursorPct}%` }}
        />
      </div>
      <div className="flex justify-between text-[0.72rem] color-[var(--muted)] mt-1">
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>
    </div>
  );
}

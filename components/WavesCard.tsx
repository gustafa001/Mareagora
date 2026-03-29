"use client";

import { degToCompass } from "@/lib/tideUtils";
import { useEffect, useState } from "react";

interface WavesCardProps {
  lat: number;
  lon: number;
}

export default function WavesCard({ lat, lon }: WavesCardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWaves() {
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}`
        + `&hourly=wave_height,wave_period,wave_direction,wind_wave_height`
        + `&wind_speed_unit=kn&timezone=America%2FSao_Paulo&forecast_days=7`;

      try {
        const res = await fetch(url);
        const json = await res.json();
        
        if (!json || !json.hourly || !json.hourly.time) {
          setLoading(false);
          return;
        }

        const h = json.hourly;
        const now = new Date();
        const nowH = now.getHours();
        
        const idx = h.time.findIndex((t: string) => {
          const d = new Date(t);
          return d.getHours() === nowH && d.toDateString() === now.toDateString();
        });
        const i = idx >= 0 ? idx : 0;

        if (h.wave_height && h.wave_height[i] !== undefined) {
          setData({
            height: h.wave_height[i],
            period: h.wave_period ? h.wave_period[i] : 0,
            direction: h.wave_direction ? h.wave_direction[i] : 0,
            windWave: h.wind_wave_height ? h.wind_wave_height[i] : 0,
          });
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    fetchWaves();
  }, [lat, lon]);

  if (loading) return <div className="card text-center p-4 text-[var(--muted)] text-sm">Carregando ondas…</div>;
  if (!data) return <div className="card text-center p-4 text-[var(--muted)] text-sm">Sem dados de ondas.</div>;

  return (
    <div className="card">
      <div className="card-title">🌊 Ondas & Vento agora</div>
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center py-2.5 border-b border-[rgba(56,201,240,0.06)]">
          <span className="text-[var(--muted)] text-sm">Altura das ondas</span>
          <span className="font-syne font-bold text-base text-[var(--foam)]">{data.height.toFixed(1)} m</span>
        </div>
        <div className="flex justify-between items-center py-2.5 border-b border-[rgba(56,201,240,0.06)]">
          <span className="text-[var(--muted)] text-sm">Período</span>
          <span className="font-syne font-bold text-base text-[var(--white)]">{data.period.toFixed(0)} s</span>
        </div>
        <div className="flex justify-between items-center py-2.5 border-b border-[rgba(56,201,240,0.06)]">
          <span className="text-[var(--muted)] text-sm">Direção das ondas</span>
          <span className="font-syne font-bold text-base text-[var(--white)]">{degToCompass(data.direction)} ({data.direction}°)</span>
        </div>
        <div className="flex justify-between items-center py-2.5 border-none pb-0">
          <span className="text-[var(--muted)] text-sm">Vento</span>
          <span className="font-syne font-bold text-base text-[var(--white)]">{data.windWave.toFixed(1)} m ondas vento</span>
        </div>
        <div className="flex items-center gap-5 mt-3">
          <div className="w-[70px] h-[70px] rounded-full border-2 border-[rgba(56,201,240,0.2)] flex items-center justify-center relative shrink-0">
            <span 
              className="text-2xl transition-transform duration-500 ease-out inline-block" 
              style={{ transform: `rotate(${data.direction}deg)` }}
            >
              ↑
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-syne font-bold text-2xl text-[var(--white)]">{data.height.toFixed(1)}m</div>
            <div className="text-[var(--muted)] text-sm">{degToCompass(data.direction)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

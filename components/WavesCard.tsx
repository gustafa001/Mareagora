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

  if (loading) return <div className="classic-card text-center p-6 text-gray-500 text-sm">Carregando ondas…</div>;
  if (!data) return <div className="classic-card text-center p-6 text-gray-500 text-sm">Sem dados de ondas.</div>;

  return (
    <div className="classic-card">
      <h3 className="card-title mb-6">🌊 Ondas e Vento agora</h3>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Altura das ondas</span>
          <span className="font-syne font-bold text-base text-blue-600">{data.height.toFixed(1)} m</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Período</span>
          <span className="font-syne font-bold text-base text-gray-800">{data.period.toFixed(0)} s</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Dir. das ondas</span>
          <span className="font-syne font-bold text-base text-gray-800">{degToCompass(data.direction)} ({data.direction}°)</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-gray-500 text-sm font-medium">Vento</span>
          <span className="font-syne font-bold text-base text-gray-800">{data.windWave.toFixed(1)} m</span>
        </div>
        
        <div className="flex justify-center items-center gap-6 mt-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <div className="w-[60px] h-[60px] rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center relative shrink-0">
            <span 
              className="text-2xl text-blue-600 transition-transform duration-500 ease-out inline-block" 
              style={{ transform: `rotate(${data.direction}deg)` }}
            >
              ↑
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-syne font-bold text-3xl text-gray-800 leading-none">{data.height.toFixed(1)}m</div>
            <div className="text-gray-500 text-sm font-bold tracking-wide uppercase">{degToCompass(data.direction)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

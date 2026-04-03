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
      const url =
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
        `&hourly=wave_height,wave_period,wave_direction,wind_wave_height` +
        `&wind_speed_unit=kn&timezone=America%2FSao_Paulo&forecast_days=7`;

      // Busca vento separado (Open-Meteo weather API)
      const windUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&hourly=wind_speed_10m,wind_direction_10m&wind_speed_unit=kn` +
        `&timezone=America%2FSao_Paulo&forecast_days=1`;

      try {
        const [marineRes, windRes] = await Promise.all([fetch(url), fetch(windUrl)]);
        const marine = await marineRes.json();
        const wind = await windRes.json();

        if (!marine?.hourly?.time) {
          setLoading(false);
          return;
        }

        const h = marine.hourly;
        const now = new Date();
        const nowPad = now.getHours().toString().padStart(2, "0");
        const todayStr = now.toLocaleDateString("en-CA");

        const idx = h.time.findIndex(
          (t: string) => t.startsWith(todayStr) && t.includes(`T${nowPad}:`)
        );
        const i = idx >= 0 ? idx : 0;

        // Vento da weather API
        let windSpeed = 0;
        let windDir = 0;
        if (wind?.hourly?.time) {
          const wh = wind.hourly;
          const wi = wh.time.findIndex(
            (t: string) => t.startsWith(todayStr) && t.includes(`T${nowPad}:`)
          );
          const wIdx = wi >= 0 ? wi : 0;
          windSpeed = wh.wind_speed_10m?.[wIdx] ?? 0;
          windDir = wh.wind_direction_10m?.[wIdx] ?? 0;
        }

        if (h.wave_height?.[i] !== undefined) {
          setData({
            height: h.wave_height[i],
            period: h.wave_period?.[i] ?? 0,
            direction: h.wave_direction?.[i] ?? 0,
            windSpeed,
            windDir,
          });
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
    fetchWaves();
  }, [lat, lon]);

  if (loading)
    return (
      <div className="classic-card text-center p-6 text-gray-500 text-sm">
        Carregando ondas…
      </div>
    );
  if (!data)
    return (
      <div className="classic-card text-center p-6 text-gray-500 text-sm">
        Sem dados de ondas.
      </div>
    );

  return (
    <div className="classic-card">
      <h3 className="card-title mb-6">🌊 Ondas e Vento agora</h3>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Altura das ondas</span>
          <span className="font-syne font-bold text-base text-blue-600">
            {data.height.toFixed(1)} m
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Período</span>
          <span className="font-syne font-bold text-base text-gray-800">
            {data.period.toFixed(0)} s
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Dir. das ondas</span>
          <span className="font-syne font-bold text-base text-gray-800">
            {degToCompass(data.direction)} ({data.direction}°)
          </span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm font-medium">Vento</span>
          <span className="font-syne font-bold text-base text-gray-800">
            {data.windSpeed.toFixed(0)} kn · {degToCompass(data.windDir)}
          </span>
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
            <div className="font-syne font-bold text-3xl text-gray-800 leading-none">
              {data.height.toFixed(1)}m
            </div>
            <div className="text-gray-500 text-sm font-bold tracking-wide uppercase">
              {degToCompass(data.direction)}
            </div>
            <div className="text-gray-400 text-xs">
              💨 {data.windSpeed.toFixed(0)} kn {degToCompass(data.windDir)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

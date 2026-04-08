"use client";

import { useEffect, useState } from "react";
import WaveChart from "@/components/WaveChart";
import WindChart from "@/components/WindChart";

interface WindWaveChartsProps {
  lat: number;
  lon: number;
}

interface MarineHourly {
  time: string[];
  wave_height: number[];
  wave_period: number[];
  swell_wave_height?: number[];
  swell_wave_period?: number[];
}

interface WindHourly {
  time: string[];
  windspeed_10m: number[];
  winddirection_10m: number[];
}

export default function WindWaveCharts({ lat, lon }: WindWaveChartsProps) {
  const [marineHourly, setMarineHourly] = useState<MarineHourly | null>(null);
  const [windHourly, setWindHourly] = useState<WindHourly | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const tz = "America%2FSao_Paulo";

    const marineUrl =
      `https://marine-api.open-meteo.com/v1/marine` +
      `?latitude=${lat}&longitude=${lon}` +
      `&hourly=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period` +
      `&forecast_days=7&timezone=${tz}`;

    const windUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&hourly=windspeed_10m,winddirection_10m` +
      `&wind_speed_unit=kmh` +
      `&forecast_days=7&timezone=${tz}`;

    Promise.all([
      fetch(marineUrl).then((r) => r.json()),
      fetch(windUrl).then((r) => r.json()),
    ])
      .then(([marine, wind]) => {
        setMarineHourly(marine.hourly ?? null);
        setWindHourly(wind.hourly ?? null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[WindWaveCharts] Erro ao buscar dados:", err);
        setLoading(false);
      });
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        <div className="h-[400px] bg-[#0d1526] rounded-3xl animate-pulse border border-white/5" />
        <div className="h-[400px] bg-[#0d1526] rounded-3xl animate-pulse border border-white/5" />
      </div>
    );
  }

  return (
    <section className="mt-16 mb-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
        <h2 className="text-2xl md:text-3xl font-black text-white font-syne tracking-tight uppercase">
          Previsão Detalhada — 7 Dias
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Ondas */}
        <div className="bg-[#0d1526] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
          {/* Efeito de brilho sutil no topo */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <span className="text-xl">🌊</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-none">Altura das Ondas</h3>
                <p className="text-slate-500 text-xs mt-1 font-medium uppercase tracking-widest">Próximas 24 horas</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-tighter">
              Metros (m)
            </div>
          </div>
          
          <WaveChart data={marineHourly?.time.slice(0, 24).map((t, i) => ({
            time: new Date(t).getHours() + "h",
            height: marineHourly.wave_height[i]
          })) || []} />
        </div>

        {/* Gráfico de Vento */}
        <div className="bg-[#0d1526] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
          {/* Efeito de brilho sutil no topo */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <span className="text-xl">💨</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-none">Velocidade do Vento</h3>
                <p className="text-slate-500 text-xs mt-1 font-medium uppercase tracking-widest">Próximos 7 dias</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-tighter">
              Km/h
            </div>
          </div>
          
          <WindChart hourly={windHourly} days={7} />
        </div>
      </div>
    </section>
  );
}

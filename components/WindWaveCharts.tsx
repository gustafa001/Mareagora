"use client";

import { useEffect, useState } from "react";
import WaveChart from "@/components/WaveChart";
import WindChart from "@/components/WindChart";
import WaveEnergyChart from "@/components/WaveEnergyChart";
import WindRadarCard from "@/components/WindRadarCard";
import { useT } from "@/lib/tideI18n";

interface MarineHourly {
  time: string[];
  wave_height: number[];
  wave_period: number[];
  wave_direction: number[];
}

interface WindHourly {
  time: string[];
  windspeed_10m: number[];
  winddirection_10m: number[];
  windgusts_10m: number[];
}

interface WindWaveChartsProps {
  lat: number;
  lon: number;
  // NOVO: dados já buscados no servidor (page.tsx), usados como estado
  // inicial. Quando presentes, pulamos o loading/fetch inicial e evitamos
  // o "flash" do skeleton — os gráficos já nascem preenchidos.
  initialMarineHourly?: MarineHourly | null;
  initialWindHourly?: WindHourly | null;
}

export default function WindWaveCharts({
  lat,
  lon,
  initialMarineHourly = null,
  initialWindHourly = null,
}: WindWaveChartsProps) {
  const { s } = useT();
  const [marineHourly, setMarineHourly] = useState<MarineHourly | null>(initialMarineHourly);
  const [windHourly, setWindHourly] = useState<WindHourly | null>(initialWindHourly);
  // Só entra em "loading" se NÃO recebemos dados prontos do servidor.
  const [loading, setLoading] = useState(!initialMarineHourly || !initialWindHourly);

  useEffect(() => {
    // Já temos dados do servidor para este lat/lon: não refaz o fetch.
    // (Se o usuário navegar para outro porto, lat/lon muda e o efeito
    // roda de novo normalmente, buscando os dados do novo local.)
    if (initialMarineHourly && initialWindHourly) return;

    setLoading(true);
    const tz = "America%2FSao_Paulo";

    // API de Marinha (Ondas) — agora inclui período e direção, usados para
    // colorir as barras e desenhar as setas no estilo Surfguru.
    const marineUrl =
      `https://marine-api.open-meteo.com/v1/marine` +
      `?latitude=${lat}&longitude=${lon}` +
      `&hourly=wave_height,wave_period,wave_direction` +
      `&forecast_days=7&timezone=${tz}`;

    // API de Clima (Vento) — agora inclui rajadas (windgusts_10m).
    const windUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&hourly=windspeed_10m,winddirection_10m,windgusts_10m` +
      `&wind_speed_unit=kmh` +
      `&forecast_days=7&timezone=${tz}`;

    Promise.all([
      fetch(marineUrl).then((r) => r.json()),
      fetch(windUrl).then((r) => r.json()),
    ])
      .then(([marine, wind]) => {
        if (marine.hourly) setMarineHourly(marine.hourly);
        if (wind.hourly) setWindHourly(wind.hourly);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[WindWaveCharts] Erro ao buscar dados:", err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <section className="mb-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
        <h2 className="text-2xl md:text-3xl font-black text-[#0d1526] font-syne uppercase">
          {s.detailedForecast}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#0d1526]/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WaveChart hourly={marineHourly} days={7} />
        <WindChart hourly={windHourly} days={7} />
        <WaveEnergyChart hourly={marineHourly} days={7} />
        <WindRadarCard lat={lat} lon={lon} />
      </div>
    </section>
  );
}
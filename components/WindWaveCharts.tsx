"use client";

import { useEffect, useState } from "react";
import SwellChart from "@/components/SwellChart";
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

  useEffect(() => {
    // Reset ao trocar de praia → ativa skeleton nos dois gráficos
    setMarineHourly(null);
    setWindHourly(null);

    const tz = "America%2FSao_Paulo";

    // ── Marine API (ondas/swell) ────────────────────────────────────
    const marineUrl =
      `https://marine-api.open-meteo.com/v1/marine` +
      `?latitude=${lat}&longitude=${lon}` +
      `&hourly=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period` +
      `&forecast_days=7&timezone=${tz}`;

    // ── Weather API (vento) — km/h obrigatório para Beaufort correto ─
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
      })
      .catch((err) => {
        console.error("[WindWaveCharts] Erro ao buscar dados:", err);
      });
  }, [lat, lon]); // ← re-executa sempre que a praia mudar

  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={styles.sectionTitle}>📊 Previsão detalhada — 7 dias</h2>
      <div style={styles.grid}>
        <SwellChart hourly={marineHourly} days={7} />
        <WindChart  hourly={windHourly}   days={7} />
      </div>
    </section>
  );
}

const styles = {
  sectionTitle: {
    color: "var(--white)",
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "0.15em",
    marginBottom: 24,
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-fira-code)",
    textAlign: "center" as const,
    opacity: 0.9,
  } as React.CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
  } as React.CSSProperties,
};

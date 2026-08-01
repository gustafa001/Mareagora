import { useState, useEffect } from 'react';

export interface RessacaForecastDay {
  date: string;          // "YYYY-MM-DD"
  swellHeightMax: number | null; // m
  swellPeriodMax: number | null; // s
  swellDirection: number | null; // graus
}

export interface HourlySwellEntry {
  hour: number;              // 0–23
  swellHeight: number | null;
  swellPeriod: number | null;
}

export function useSeaConditions(lat: number, lon: number) {
  const [waveHeight, setWaveHeight] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [swellHeight, setSwellHeight] = useState<number | null>(null);
  const [swellPeriod, setSwellPeriod] = useState<number | null>(null);
  const [swellDirection, setSwellDirection] = useState<number | null>(null);
  const [forecast, setForecast] = useState<RessacaForecastDay[]>([]);
  const [hourlyToday, setHourlyToday] = useState<HourlySwellEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeaConditions() {
      // hourly: dados hora a hora (swell + direção) | daily: previsão de 7 dias
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,swell_wave_height,swell_wave_period,swell_wave_direction&daily=swell_wave_height_max,swell_wave_period_max,swell_wave_direction_dominant&timezone=America%2FSao_Paulo&forecast_days=7`;
      const windUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m&wind_speed_unit=kmh&timezone=America%2FSao_Paulo`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const [resWave, resWind] = await Promise.all([
          fetch(url, { signal: controller.signal }),
          fetch(windUrl, { signal: controller.signal })
        ]);
        clearTimeout(timeoutId);

        const jsonWave = await resWave.json();
        const jsonWind = await resWind.json();

        const h = jsonWave.hourly;
        const now = new Date();
        const nowPad = now.getHours().toString().padStart(2, '0');
        const todayStr = now.toLocaleDateString('en-CA');

        const idx = h.time.findIndex((t: string) => {
          return t.startsWith(todayStr) && t.includes(`T${nowPad}:`);
        });
        const i = idx >= 0 ? idx : 0;

        setWaveHeight(h.wave_height?.[i] ?? null);
        setSwellHeight(h.swell_wave_height?.[i] ?? null);
        setSwellPeriod(h.swell_wave_period?.[i] ?? null);
        setSwellDirection(h.swell_wave_direction?.[i] ?? null);
        setWindSpeed(jsonWind.current?.wind_speed_10m ?? null);

        // Dados hora a hora de hoje (para cálculo de melhor janela real)
        const todayEntries: HourlySwellEntry[] = [];
        h.time.forEach((t: string, j: number) => {
          if (t.startsWith(todayStr)) {
            const hour = parseInt(t.split('T')[1].split(':')[0], 10);
            todayEntries.push({
              hour,
              swellHeight: h.swell_wave_height?.[j] ?? null,
              swellPeriod: h.swell_wave_period?.[j] ?? null,
            });
          }
        });
        setHourlyToday(todayEntries);

        const d = jsonWave.daily;
        if (d?.time) {
          setForecast(
            d.time.map((date: string, idx2: number) => ({
              date,
              swellHeightMax: d.swell_wave_height_max?.[idx2] ?? null,
              swellPeriodMax: d.swell_wave_period_max?.[idx2] ?? null,
              swellDirection: d.swell_wave_direction_dominant?.[idx2] ?? null,
            }))
          );
        }
      } catch (e) {
        clearTimeout(timeoutId);
        console.error("Erro ao buscar condições do mar:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchSeaConditions();
  }, [lat, lon]);

  return { waveHeight, windSpeed, swellHeight, swellPeriod, swellDirection, forecast, hourlyToday, loading };
}

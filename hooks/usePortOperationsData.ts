'use client';

import { useEffect, useState } from 'react';
import type { WeatherSnapshot, SeaState } from '@/lib/portOperations';

export interface PortOperationsHourly {
  time: string[];
  windSpeed: number[];
  waveHeight: number[];
}

export interface PortOperationsDataResult {
  weather: WeatherSnapshot;
  sea: SeaState;
  hourly: PortOperationsHourly | null;
  loading: boolean;
  error: boolean;
  offline: boolean;
  lastUpdated: Date | null;
}

const EMPTY_WEATHER: WeatherSnapshot = {
  temperature: null, windSpeed: null, windDirectionDeg: null,
  precipitationProbability: null, humidity: null, pressure: null, visibility: null,
};

const EMPTY_SEA: SeaState = {
  waveHeight: null, wavePeriod: null, waveDirectionDeg: null,
  windSpeed: null, windDirectionDeg: null, currentSpeed: null,
};

/**
 * Busca clima + condições do mar em tempo real (Open-Meteo), reaproveitando
 * os mesmos endpoints públicos já usados em `useSeaConditions` e
 * `WindWaveCharts`, sem alterar nenhum desses arquivos.
 */
export function usePortOperationsData(lat: number, lon: number): PortOperationsDataResult {
  const [weather, setWeather] = useState<WeatherSnapshot>(EMPTY_WEATHER);
  const [sea, setSea] = useState<SeaState>(EMPTY_SEA);
  const [hourly, setHourly] = useState<PortOperationsHourly | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [offline, setOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOffline(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const tz = 'America%2FSao_Paulo';

    async function load() {
      setLoading(true);
      setError(false);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,precipitation_probability,visibility` +
        `&hourly=windspeed_10m,winddirection_10m` +
        `&wind_speed_unit=kmh&forecast_days=4&timezone=${tz}`;

      const marineUrl =
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
        `&hourly=wave_height,wave_period,wave_direction,ocean_current_velocity` +
        `&forecast_days=4&timezone=${tz}`;

      try {
        const [wRes, mRes] = await Promise.all([
          fetch(weatherUrl, { signal: controller.signal }),
          fetch(marineUrl, { signal: controller.signal }),
        ]);
        clearTimeout(timeoutId);
        const wJson = await wRes.json();
        const mJson = await mRes.json();
        if (cancelled) return;

        const current = wJson.current ?? {};
        setWeather({
          temperature: current.temperature_2m ?? null,
          windSpeed: current.wind_speed_10m ?? null,
          windDirectionDeg: current.wind_direction_10m ?? null,
          precipitationProbability: current.precipitation_probability ?? null,
          humidity: current.relative_humidity_2m ?? null,
          pressure: current.surface_pressure ?? null,
          visibility: current.visibility != null ? current.visibility / 1000 : null,
        });

        const now = new Date();
        const nowPad = now.getHours().toString().padStart(2, '0');
        const todayStr = now.toLocaleDateString('en-CA');
        const marineHourly = mJson.hourly;
        const idx = marineHourly?.time
          ? marineHourly.time.findIndex((t: string) => t.startsWith(todayStr) && t.includes(`T${nowPad}:`))
          : -1;
        const mi = idx >= 0 ? idx : 0;

        setSea({
          waveHeight: marineHourly?.wave_height?.[mi] ?? null,
          wavePeriod: marineHourly?.wave_period?.[mi] ?? null,
          waveDirectionDeg: marineHourly?.wave_direction?.[mi] ?? null,
          windSpeed: current.wind_speed_10m ?? null,
          windDirectionDeg: current.wind_direction_10m ?? null,
          currentSpeed: marineHourly?.ocean_current_velocity?.[mi] != null
            ? marineHourly.ocean_current_velocity[mi] * 1.94384 // m/s -> nós
            : null,
        });

        if (wJson.hourly && marineHourly) {
          setHourly({
            time: wJson.hourly.time,
            windSpeed: wJson.hourly.windspeed_10m,
            waveHeight: marineHourly.wave_height,
          });
        }

        setLastUpdated(new Date());
      } catch (e) {
        clearTimeout(timeoutId);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 10 * 60 * 1000); // atualiza a cada 10min
    return () => { cancelled = true; clearInterval(interval); };
  }, [lat, lon]);

  return { weather, sea, hourly, loading, error, offline, lastUpdated };
}

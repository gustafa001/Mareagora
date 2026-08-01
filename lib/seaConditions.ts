'use client';

import { useState, useEffect } from 'react';
import {
  fetchSeaConditions,
  type RessacaForecastDay,
  type HourlySwellEntry,
} from '@/lib/seaConditions';

export type { RessacaForecastDay, HourlySwellEntry };

export function useSeaConditions(lat: number, lon: number) {
  const [waveHeight, setWaveHeight] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [swellHeight, setSwellHeight] = useState<number | null>(null);
  const [swellPeriod, setSwellPeriod] = useState<number | null>(null);
  const [swellDirection, setSwellDirection] = useState<number | null>(null);
  const [forecast, setForecast] = useState<RessacaForecastDay[]>([]);
  const [hourlyToday, setHourlyToday] = useState<HourlySwellEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSeaConditions(lat, lon, { signal: controller.signal });
        clearTimeout(timeoutId);
        setWaveHeight(data.waveHeight);
        setSwellHeight(data.swellHeight);
        setSwellPeriod(data.swellPeriod);
        setSwellDirection(data.swellDirection);
        setWindSpeed(data.windSpeed);
        setForecast(data.forecast);
        setHourlyToday(data.hourlyToday);
      } catch (e) {
        clearTimeout(timeoutId);
        console.error('Erro ao buscar condições do mar:', e);
        setError('Não foi possível carregar as condições do mar agora.');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [lat, lon]);

  return {
    waveHeight,
    windSpeed,
    swellHeight,
    swellPeriod,
    swellDirection,
    forecast,
    hourlyToday,
    loading,
    error,
  };
}

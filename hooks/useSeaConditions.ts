import { useState, useEffect } from 'react';

export function useSeaConditions(lat: number, lon: number) {
  const [waveHeight, setWaveHeight] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeaConditions() {
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=America%2FSao_Paulo&forecast_days=1`;
      const windUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m&wind_speed_unit=kmh&timezone=America%2FSao_Paulo`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      
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
        
        setWaveHeight(h.wave_height[i]);
        setWindSpeed(jsonWind.current?.wind_speed_10m);
      } catch (e) {
        clearTimeout(timeoutId);
        console.error("Erro ao buscar condições do mar:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchSeaConditions();
  }, [lat, lon]);

  return { waveHeight, windSpeed, loading };
}

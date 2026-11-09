/**
 * Condições atuais do mar para o card da home (Server Component / ISR).
 *
 * Busca no servidor, com cache de 1h, e entrega os valores prontos no HTML:
 * nada de fetch no cliente, então não há divergência de hidratação.
 * Qualquer falha devolve null e o card simplesmente não mostra a linha.
 * UV fica de fora de propósito (a Open-Meteo devolve índice de céu limpo).
 */
import { marineLatLon } from '@/lib/marineCoords';

export interface HomeConditions {
  waveHeight: number | null; // m
  wavePeriod: number | null; // s
  waterTemp: number | null; // °C
  windSpeed: number | null; // km/h
  windDirection: string | null; // N, NE, ...
  airTemp: number | null; // °C
  /** Horário da leitura (BRT), "HH:mm" */
  time: string | null;
}

const CARDINALS = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];

function toCardinal(deg: unknown): string | null {
  if (typeof deg !== 'number' || !Number.isFinite(deg)) return null;
  return CARDINALS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

const num = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null;

async function getJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function getHomeConditions(lat: number, lon: number): Promise<HomeConditions | null> {
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?${marineLatLon(lat, lon)}&current=wave_height,wave_period,sea_surface_temperature&timezone=America%2FSao_Paulo`;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh&timezone=America%2FSao_Paulo`;

  const [marine, weather] = await Promise.all([getJson(marineUrl), getJson(weatherUrl)]);

  const data: HomeConditions = {
    waveHeight: num(marine?.current?.wave_height),
    wavePeriod: num(marine?.current?.wave_period),
    waterTemp: num(marine?.current?.sea_surface_temperature),
    windSpeed: num(weather?.current?.wind_speed_10m),
    windDirection: toCardinal(weather?.current?.wind_direction_10m),
    airTemp: num(weather?.current?.temperature_2m),
    time:
      typeof weather?.current?.time === 'string'
        ? weather.current.time.slice(11, 16)
        : typeof marine?.current?.time === 'string'
          ? marine.current.time.slice(11, 16)
          : null,
  };

  const hasAny = data.waveHeight !== null || data.waterTemp !== null || data.windSpeed !== null;
  return hasAny ? data : null;
}

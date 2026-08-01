/**
 * MaréAgora — Busca de condições do mar (Open-Meteo)
 * ---------------------------------------------------------------------------
 * Lógica de fetch/parse compartilhada entre:
 *  - hooks/useSeaConditions.ts   → uso em Client Components (fetch a cada visita)
 *  - getSeaConditionsCached()    → uso em Server Components (cache de 1h via
 *                                   `next: { revalidate }`, reduz chamadas à API)
 *
 * Extraído para cá para não duplicar a URL/parse em dois lugares.
 */

export interface RessacaForecastDay {
  date: string; // "YYYY-MM-DD"
  swellHeightMax: number | null; // m
  swellPeriodMax: number | null; // s
  swellDirection: number | null; // graus
}

export interface HourlySwellEntry {
  hour: number; // 0–23
  timeLabel: string; // "HH:mm", útil para exibir o horário do pico
  swellHeight: number | null;
  swellPeriod: number | null;
  swellDirection: number | null;
}

export interface SeaConditionsData {
  waveHeight: number | null;
  windSpeed: number | null;
  swellHeight: number | null;
  swellPeriod: number | null;
  swellDirection: number | null;
  forecast: RessacaForecastDay[];
  hourlyToday: HourlySwellEntry[];
}

const EMPTY: SeaConditionsData = {
  waveHeight: null,
  windSpeed: null,
  swellHeight: null,
  swellPeriod: null,
  swellDirection: null,
  forecast: [],
  hourlyToday: [],
};

function buildUrls(lat: number, lon: number) {
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,swell_wave_height,swell_wave_period,swell_wave_direction&daily=swell_wave_height_max,swell_wave_period_max,swell_wave_direction_dominant&timezone=America%2FSao_Paulo&forecast_days=10`;
  const windUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m&wind_speed_unit=kmh&timezone=America%2FSao_Paulo`;
  return { marineUrl, windUrl };
}

function parseResponses(jsonWave: any, jsonWind: any): SeaConditionsData {
  const h = jsonWave?.hourly;
  if (!h?.time?.length) return EMPTY;

  const now = new Date();
  const nowPad = now.getHours().toString().padStart(2, '0');
  const todayStr = now.toLocaleDateString('en-CA');

  const idx = h.time.findIndex((t: string) => t.startsWith(todayStr) && t.includes(`T${nowPad}:`));
  const i = idx >= 0 ? idx : 0;

  const hourlyToday: HourlySwellEntry[] = [];
  h.time.forEach((t: string, j: number) => {
    if (t.startsWith(todayStr)) {
      const timeLabel = t.slice(11, 16);
      hourlyToday.push({
        hour: parseInt(timeLabel.split(':')[0], 10),
        timeLabel,
        swellHeight: h.swell_wave_height?.[j] ?? null,
        swellPeriod: h.swell_wave_period?.[j] ?? null,
        swellDirection: h.swell_wave_direction?.[j] ?? null,
      });
    }
  });

  const d = jsonWave?.daily;
  const forecast: RessacaForecastDay[] = d?.time
    ? d.time.map((date: string, idx2: number) => ({
        date,
        swellHeightMax: d.swell_wave_height_max?.[idx2] ?? null,
        swellPeriodMax: d.swell_wave_period_max?.[idx2] ?? null,
        swellDirection: d.swell_wave_direction_dominant?.[idx2] ?? null,
      }))
    : [];

  return {
    waveHeight: h.wave_height?.[i] ?? null,
    swellHeight: h.swell_wave_height?.[i] ?? null,
    swellPeriod: h.swell_wave_period?.[i] ?? null,
    swellDirection: h.swell_wave_direction?.[i] ?? null,
    windSpeed: jsonWind?.current?.wind_speed_10m ?? null,
    forecast,
    hourlyToday,
  };
}

/**
 * Busca as condições do mar. Funciona em client e em server.
 * Em Server Components, passe `revalidateSeconds` para usar o cache de
 * dados do Next.js (evita bater na API do Open-Meteo a cada request).
 * Em Client Components, deixe `revalidateSeconds` undefined e passe um
 * `signal` de AbortController se quiser timeout.
 */
export async function fetchSeaConditions(
  lat: number,
  lon: number,
  options?: { revalidateSeconds?: number; signal?: AbortSignal }
): Promise<SeaConditionsData> {
  const { marineUrl, windUrl } = buildUrls(lat, lon);
  const fetchInit: RequestInit & { next?: { revalidate: number } } = {
    signal: options?.signal,
    ...(options?.revalidateSeconds
      ? { next: { revalidate: options.revalidateSeconds } }
      : {}),
  };

  const [resWave, resWind] = await Promise.all([
    fetch(marineUrl, fetchInit),
    fetch(windUrl, fetchInit),
  ]);

  if (!resWave.ok) {
    throw new Error(`Open-Meteo Marine API retornou ${resWave.status}`);
  }

  const [jsonWave, jsonWind] = await Promise.all([
    resWave.json(),
    resWind.ok ? resWind.json() : Promise.resolve(null),
  ]);

  return parseResponses(jsonWave, jsonWind);
}

/**
 * Atalho para Server Components: busca com cache de 1h.
 * Ex.: const dados = await getSeaConditionsCached(lat, lon);
 */
export function getSeaConditionsCached(lat: number, lon: number) {
  return fetchSeaConditions(lat, lon, { revalidateSeconds: 3600 });
}

import { degToCompass } from '@/lib/tideUtils';

export interface MarineHourly {
  time: string[];
  wave_height: number[];
  wave_period: number[];
  wave_direction: number[];
}

export interface WindHourly {
  time: string[];
  windspeed_10m: number[];
  winddirection_10m: number[];
  windgusts_10m: number[];
}

export interface SeaConditionsSummary {
  waveMin: number;
  waveMax: number;
  wavePeriod: number;
  waveDirectionCardinal: string;
  windMin: number;
  windMax: number;
  windGustMax: number;
  windDirectionCardinal: string;
}

/**
 * Busca dados de ondas (Marine API) e vento (Forecast API) da Open-Meteo
 * no SERVIDOR (Server Component), com cache/ISR alinhado ao revalidate da
 * página. Isso garante que os números apareçam no HTML entregue a
 * crawlers/bots de IA, que não esperam fetch client-side.
 *
 * Retorna null em caso de falha — quem chamar deve tratar esse caso
 * (ex.: cair para o texto genérico antigo) em vez de quebrar a página.
 */
export async function getSeaConditionsSummary(
  lat: number,
  lon: number,
  revalidateSeconds: number
): Promise<{ summary: SeaConditionsSummary; marineHourly: MarineHourly; windHourly: WindHourly } | null> {
  const tz = 'America%2FSao_Paulo';

  const marineUrl =
    `https://marine-api.open-meteo.com/v1/marine` +
    `?latitude=${lat}&longitude=${lon}` +
    `&hourly=wave_height,wave_period,wave_direction` +
    `&forecast_days=7&timezone=${tz}`;

  const windUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&hourly=windspeed_10m,winddirection_10m,windgusts_10m` +
    `&wind_speed_unit=kmh` +
    `&forecast_days=7&timezone=${tz}`;

  try {
    const [marineRes, windRes] = await Promise.all([
      fetch(marineUrl, { next: { revalidate: revalidateSeconds } }),
      fetch(windUrl, { next: { revalidate: revalidateSeconds } }),
    ]);

    if (!marineRes.ok || !windRes.ok) return null;

    const marineJson = await marineRes.json();
    const windJson = await windRes.json();

    const marineHourly: MarineHourly | undefined = marineJson?.hourly;
    const windHourly: WindHourly | undefined = windJson?.hourly;
    if (!marineHourly || !windHourly) return null;

    const summary = buildTodaySummary(marineHourly, windHourly);
    if (!summary) return null;

    return { summary, marineHourly, windHourly };
  } catch (err) {
    console.error('[getSeaConditionsSummary] Erro ao buscar dados:', err);
    return null;
  }
}

/**
 * Reduz as primeiras 24h retornadas (que já vêm no fuso de São Paulo,
 * começando à meia-noite de hoje) a um resumo simples: faixa min/max de
 * altura de onda, período dominante, direção cardinal predominante de
 * onda e vento, faixa de vento e rajada máxima.
 */
function buildTodaySummary(marine: MarineHourly, wind: WindHourly): SeaConditionsSummary | null {
  const hoursToday = 24;

  const waveHeights = marine.wave_height?.slice(0, hoursToday).filter((v) => typeof v === 'number');
  const wavePeriods = marine.wave_period?.slice(0, hoursToday).filter((v) => typeof v === 'number');
  const waveDirections = marine.wave_direction?.slice(0, hoursToday).filter((v) => typeof v === 'number');

  const windSpeeds = wind.windspeed_10m?.slice(0, hoursToday).filter((v) => typeof v === 'number');
  const windGusts = wind.windgusts_10m?.slice(0, hoursToday).filter((v) => typeof v === 'number');
  const windDirections = wind.winddirection_10m?.slice(0, hoursToday).filter((v) => typeof v === 'number');

  if (!waveHeights?.length || !windSpeeds?.length) return null;

  const round1 = (n: number) => Math.round(n * 10) / 10;
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  return {
    waveMin: round1(Math.min(...waveHeights)),
    waveMax: round1(Math.max(...waveHeights)),
    wavePeriod: Math.round(avg(wavePeriods ?? [0])),
    waveDirectionCardinal: degToCompass(avg(waveDirections ?? [0])),
    windMin: Math.round(Math.min(...windSpeeds)),
    windMax: Math.round(Math.max(...windSpeeds)),
    windGustMax: Math.round(Math.max(...(windGusts ?? windSpeeds))),
    windDirectionCardinal: degToCompass(avg(windDirections ?? [0])),
  };
}
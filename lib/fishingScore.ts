/**
 * MariaAgora Fishing Score
 * Cálculo único do "score de pesca" (0–10). É a fonte de verdade usada tanto
 * pelo DailyScoreCard (cliente) quanto pelo texto de SEO gerado no servidor
 * (SSR) — assim o número que aparece no HTML pré-renderizado bate com o card.
 *
 * Fórmula herdada do DailyScoreCard.tsx (bloco PESCA):
 *  - base 4
 *  - +3/+1 se estamos dentro de 1h/2h de um evento de maré (período solunar)
 *  - +2 (amplitude >= 1.5m) / +1 (>= 0.8m) / -1 (maré morta)
 *  - +1 se a maré está enchendo
 *  - +1 vento < 20km/h / -2 vento > 35km/h
 *  - +1 mar < 1.0m / -1 mar >= 2.0m
 */

import type { TideEvent } from '@/lib/tideUtils';

export interface FishingMarine {
  waveHeight: number;   // metros
  wavePeriod: number;   // segundos
  windSpeed: number;    // km/h
}

/** Tradutor dos motivos exibidos no card. As chaves batem com as r_* do tideI18n. */
export interface FishingReasonsI18n {
  r_solunar_major?: string;
  r_solunar_minor?: string;
  r_spring_tide?: (r: number) => string;
  r_moderate_range?: (r: number) => string;
  r_neap_tide?: string;
  r_flooding?: string;
  r_wind_favorable?: string;
  r_wind_strong_fish?: (w: number) => string;
  r_sea_good_fish?: string;
  r_sea_rough_fish?: (w: number) => string;
  r_no_weather?: string;
}

const PT_REASONS: FishingReasonsI18n = {
  r_solunar_major: 'Período solunar maior ativo 🌙',
  r_solunar_minor: 'Período solunar menor ativo',
  r_spring_tide: (r) => `Maré viva (amplitude ${r}m)`,
  r_moderate_range: (r) => `Amplitude moderada (${r}m)`,
  r_neap_tide: 'Maré morta (baixa amplitude)',
  r_flooding: 'Maré enchendo (peixes se movem)',
  r_wind_favorable: 'Vento favorável para pescaria',
  r_wind_strong_fish: (w) => `Vento forte (${w} km/h)`,
  r_sea_good_fish: 'Mar adequado para pescaria',
  r_sea_rough_fish: (w) => `Mar agitado (${w}m)`,
  r_no_weather: 'Dados climáticos indisponíveis',
};

export interface FishingScoreResult {
  score: number;        // 0–10
  label: string;        // pt: Excelente / Ótimo / Bom / Razoável / Ruim
  color: string;        // hex (mesmas faixas do getScoreColor do card)
  reasons: string[];
}

/** Minutos desde 00:00 no fuso do local consultado (não do navegador do usuário). */
export function localNowMinutes(utcOffsetMin: number): number {
  const localMs = Date.now() + utcOffsetMin * 60 * 1000;
  const d = new Date(localMs);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

export function fishingLabel(score: number): string {
  if (score >= 9) return 'Excelente';
  if (score >= 7) return 'Ótimo';
  if (score >= 5) return 'Bom';
  if (score >= 3) return 'Razoável';
  return 'Ruim';
}

export function fishingColor(score: number): string {
  if (score >= 8) return '#10b981';
  if (score >= 6) return '#3b82f6';
  if (score >= 4) return '#f59e0b';
  return '#ef4444';
}

function toMin(ts: string): number {
  const [h, m] = ts.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Calcula o score de pesca "agora". Aceita `nowMin` (minutos locais) quando
 * o chamador já tem a hora local calculada (ex.: SSR) — sem isso, usa o
 * relógio + utcOffsetMin (comportamento do DailyScoreCard).
 */
export function calcFishingScore(
  tides: TideEvent[],
  marine: FishingMarine | null,
  utcOffsetMin: number,
  nowMin?: number,
  t: FishingReasonsI18n = PT_REASONS
): FishingScoreResult {
  const currentMinute = nowMin ?? localNowMinutes(utcOffsetMin);

  // Período solunar: 1h ao redor de uma preamar/baixamar (maior) ou 2h (menor)
  let solunar = 0;
  for (const ev of tides) {
    const diff = Math.abs(toMin(ev.hora) - currentMinute);
    if (diff <= 60) solunar = Math.max(solunar, 2);
    else if (diff <= 120) solunar = Math.max(solunar, 1);
  }

  // Amplitude do dia (alta - baixa)
  const heights = tides.map(ev => ev.altura_m ?? 0);
  const range = heights.length ? Math.max(...heights) - Math.min(...heights) : 0;

  // A maré está enchendo agora?
  const sorted = [...tides].sort((a, b) => toMin(a.hora) - toMin(b.hora));
  let rising: boolean | null = null;
  for (let i = 0; i < sorted.length - 1; i++) {
    const aMin = toMin(sorted[i].hora);
    const bMin = toMin(sorted[i + 1].hora);
    if (currentMinute >= aMin && currentMinute <= bMin) {
      rising = (sorted[i + 1].altura_m ?? 0) > (sorted[i].altura_m ?? 0);
      break;
    }
  }

  const wave = marine?.waveHeight ?? 0;
  const wind = marine?.windSpeed ?? 0;

  let score = 4;
  const reasons: string[] = [];

  if (solunar === 2) { score += 3; reasons.push(t.r_solunar_major ?? PT_REASONS.r_solunar_major!); }
  else if (solunar === 1) { score += 1; reasons.push(t.r_solunar_minor ?? PT_REASONS.r_solunar_minor!); }

  if (range >= 1.5) { score += 2; reasons.push((t.r_spring_tide ?? PT_REASONS.r_spring_tide!)(range)); }
  else if (range >= 0.8) { score += 1; reasons.push((t.r_moderate_range ?? PT_REASONS.r_moderate_range!)(range)); }
  else { score -= 1; reasons.push(t.r_neap_tide ?? PT_REASONS.r_neap_tide!); }

  if (rising === true) { score += 1; reasons.push(t.r_flooding ?? PT_REASONS.r_flooding!); }

  if (wind < 20) { score += 1; reasons.push(t.r_wind_favorable ?? PT_REASONS.r_wind_favorable!); }
  else if (wind > 35) { score -= 2; reasons.push((t.r_wind_strong_fish ?? PT_REASONS.r_wind_strong_fish!)(Math.round(wind))); }

  if (wave > 0 && wave < 1.0) { score += 1; reasons.push(t.r_sea_good_fish ?? PT_REASONS.r_sea_good_fish!); }
  else if (wave >= 2.0) { score -= 1; reasons.push((t.r_sea_rough_fish ?? PT_REASONS.r_sea_rough_fish!)(wave)); }

  if (!marine) reasons.push(t.r_no_weather ?? PT_REASONS.r_no_weather!);

  score = Math.max(0, Math.min(10, score));

  return { score, label: fishingLabel(score), color: fishingColor(score), reasons };
}
/**
 * lib/seo/tideRegimeClassifier.ts
 *
 * Classifica automaticamente o regime de maré (diurno / semidiurno / misto)
 * e calcula amplitude média e máxima a partir de uma semana de eventos extremos
 * retornados por getGlobalTideData().
 *
 * Algoritmo:
 *  - Conta extremos por dia nos 7 dias
 *  - ~2 eventos/dia → diurno (1 alta + 1 baixa)
 *  - ~4 eventos/dia com alturas de alta parecidas → semidiurno
 *  - 4 eventos/dia com grande desigualdade diurna OU contagem variável → misto
 */

import type { GlobalTideEvent } from '../globalTide';

export interface TideRegimeResult {
  regime: 'diurno' | 'semidiurno' | 'misto';
  amplitudeMedia: number; // média de (alta - baixa mais próxima) na semana, em metros
  amplitudeMax: number;   // maior diferença entre consecutivos alta/baixa na semana
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Agrupa eventos por data (YYYY-MM-DD). */
function groupByDay(events: GlobalTideEvent[]): Record<string, GlobalTideEvent[]> {
  const byDay: Record<string, GlobalTideEvent[]> = {};
  for (const ev of events) {
    const day = ev.dt.slice(0, 10);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(ev);
  }
  return byDay;
}

/**
 * Calcula amplitude entre pares consecutivos de extremos.
 * Como neaps retorna alternadamente max/min, basta calcular |h[i] - h[i+1]|
 * para cada par e acumular os que representam descida (alta→baixa).
 */
function calcAmplitudes(events: GlobalTideEvent[]): number[] {
  const amps: number[] = [];
  for (let i = 0; i < events.length - 1; i++) {
    const diff = Math.abs(events[i].height_m - events[i + 1].height_m);
    amps.push(diff);
  }
  return amps;
}

/**
 * Índice de desigualdade diurna: para dias com 4 extremos, compara as duas
 * alturas máximas locais. Retorna a razão diffHighs / range (0 = igual, 1 = muito desigual).
 */
function diurnalInequalityRatio(dayEvents: GlobalTideEvent[]): number {
  if (dayEvents.length < 4) return 0;
  const sorted = [...dayEvents].sort((a, b) => b.height_m - a.height_m);
  const high1 = sorted[0].height_m;
  const high2 = sorted[1].height_m;
  const low1 = sorted[sorted.length - 1].height_m;
  const range = high1 - low1;
  if (range <= 0) return 0;
  return Math.abs(high1 - high2) / range;
}

// ── Função principal ──────────────────────────────────────────────────────────

export function classifyTideRegime(events: GlobalTideEvent[]): TideRegimeResult {
  if (!events || events.length === 0) {
    return { regime: 'semidiurno', amplitudeMedia: 2.0, amplitudeMax: 2.5 };
  }

  const byDay = groupByDay(events);
  const days = Object.keys(byDay).sort();

  if (days.length === 0) {
    return { regime: 'semidiurno', amplitudeMedia: 2.0, amplitudeMax: 2.5 };
  }

  // Contagem de eventos por dia
  const eventCounts = days.map((d) => byDay[d].length);
  const avgCount = eventCounts.reduce((a, b) => a + b, 0) / eventCounts.length;

  // Variabilidade da contagem (std dev normalizado)
  const countVariance = eventCounts.reduce((acc, c) => acc + (c - avgCount) ** 2, 0) / eventCounts.length;
  const countCv = Math.sqrt(countVariance) / (avgCount || 1); // coeficiente de variação

  // Índice de desigualdade diurna (apenas para dias com ≥4 extremos)
  const inequalityRatios = days
    .filter((d) => byDay[d].length >= 4)
    .map((d) => diurnalInequalityRatio(byDay[d]));
  const avgInequality = inequalityRatios.length > 0
    ? inequalityRatios.reduce((a, b) => a + b, 0) / inequalityRatios.length
    : 0;

  // Amplitudes
  const allAmplitudes = calcAmplitudes(events);
  const amplitudeMedia = allAmplitudes.length > 0
    ? Math.round((allAmplitudes.reduce((a, b) => a + b, 0) / allAmplitudes.length) * 10) / 10
    : 2.0;
  const amplitudeMax = allAmplitudes.length > 0
    ? Math.round(Math.max(...allAmplitudes) * 10) / 10
    : 2.5;

  // Classificação
  let regime: 'diurno' | 'semidiurno' | 'misto';

  if (avgCount < 2.6) {
    // ~1 alta + 1 baixa por dia → diurno
    regime = 'diurno';
  } else if (avgCount >= 3.5 && countCv < 0.25) {
    // ~4 extremos por dia de forma consistente → semidiurno ou misto por desigualdade
    regime = avgInequality > 0.30 ? 'misto' : 'semidiurno';
  } else {
    // Contagem variável ou intermediária → misto
    regime = 'misto';
  }

  return { regime, amplitudeMedia, amplitudeMax };
}

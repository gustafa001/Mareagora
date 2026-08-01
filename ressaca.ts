/**
 * MaréAgora — Classificação de Ressaca (Swell)
 * ---------------------------------------------------------------------------
 * MESCLA: lógica de severidade/chips/tendência (versão em produção) +
 * cálculo de pico do dia e horário exato (versão alternativa recebida).
 * ---------------------------------------------------------------------------
 * "Ressaca" no sentido de mar agitado por swell de longo período — diferente
 * de vento local (wind wave). Usa swell_wave_height + swell_wave_period do
 * Open-Meteo Marine API (ver hooks/useSeaConditions.ts).
 *
 * Regra de classificação:
 *  - Período curto (<8s) tende a ser vento local (wind chop), menos perigoso
 *    mesmo com altura razoável.
 *  - Período longo (>=10s) indica swell de verdade (energia vinda de longe),
 *    mais perigoso mesmo com altura moderada — típico de frentes frias e
 *    ressacas de fato.
 */

import type { HourlySwellEntry, RessacaForecastDay } from '@/hooks/useSeaConditions';

export type RessacaSeverity = 'calmo' | 'moderado' | 'ressaca' | 'ressaca-forte';

export interface RessacaClassification {
  severity: RessacaSeverity;
  label: string;
  color: string;
  description: string;
}

// Mesmos thresholds usados dentro de classifyRessaca, expostos para
// desenhar a escala visual (gauge) sem duplicar os números em outro lugar.
export const RESSACA_SCALE: { severity: RessacaSeverity; short: string; color: string; upTo: number }[] = [
  { severity: 'calmo', short: 'Calmo', color: '#10b981', upTo: 1.0 },
  { severity: 'moderado', short: 'Moderado', color: '#38bdf8', upTo: 1.8 },
  { severity: 'ressaca', short: 'Ressaca', color: '#f59e0b', upTo: 2.5 },
  { severity: 'ressaca-forte', short: 'Forte', color: '#ef4444', upTo: 3.2 },
];

// Posição (0-1) do ponteiro no gauge, considerando o mesmo ajuste de
// período longo que classifyRessaca aplica à altura.
export function ressacaGaugePosition(swellHeight: number | null, swellPeriod: number | null): number {
  if (swellHeight === null) return 0;
  const longPeriod = swellPeriod !== null && swellPeriod >= 10;
  const effectiveHeight = longPeriod ? swellHeight + 0.4 : swellHeight;
  const max = RESSACA_SCALE[RESSACA_SCALE.length - 1].upTo;
  return Math.min(Math.max(effectiveHeight / max, 0), 1);
}

export function classifyRessaca(
  swellHeight: number | null,
  swellPeriod: number | null
): RessacaClassification {
  if (swellHeight === null) {
    return { severity: 'calmo', label: 'Sem dados', color: '#64748b', description: 'Dados de swell indisponíveis no momento.' };
  }

  const longPeriod = swellPeriod !== null && swellPeriod >= 10;
  const effectiveHeight = longPeriod ? swellHeight + 0.4 : swellHeight;

  if (effectiveHeight < 1.0) {
    return { severity: 'calmo', label: 'Mar calmo', color: '#10b981', description: 'Condições tranquilas para banho e atividades na praia.' };
  }
  if (effectiveHeight < 1.8) {
    return { severity: 'moderado', label: 'Mar moderado', color: '#38bdf8', description: 'Ondulação perceptível, mas dentro da normalidade para a região.' };
  }
  if (effectiveHeight < 2.5) {
    return {
      severity: 'ressaca',
      label: 'Ressaca',
      color: '#f59e0b',
      description: longPeriod
        ? 'Swell de período longo — mar agitado mesmo em dias sem vento forte. Atenção redobrada no banho.'
        : 'Mar agitado. Bancos de areia e correntes podem mudar rapidamente.',
    };
  }
  return {
    severity: 'ressaca-forte',
    label: 'Ressaca forte',
    color: '#ef4444',
    description: 'Ondas grandes e correntes de retorno prováveis. Evite o banho de mar e fique atento a avisos da Marinha e da Defesa Civil.',
  };
}

// ── Chips de atividade ────────────────────────────────────────────────────────

export interface ActivityChip {
  label: string;
  status: string;
  color: string;
  icon: string;
}

/** Recomendação de banho baseada na altura efetiva do swell. */
export function activityBanho(swellHeight: number | null, swellPeriod: number | null): ActivityChip {
  if (swellHeight === null) return { label: 'Banho', status: '--', color: '#64748b', icon: '🏊' };
  const longPeriod = swellPeriod !== null && swellPeriod >= 10;
  const eff = longPeriod ? swellHeight + 0.4 : swellHeight;
  if (eff < 1.0) return { label: 'Banho', status: 'Bom', color: '#10b981', icon: '🏊' };
  if (eff < 1.8) return { label: 'Banho', status: 'Atenção', color: '#f59e0b', icon: '🏊' };
  return { label: 'Banho', status: 'Evite', color: '#ef4444', icon: '🏊' };
}

/** Recomendação de surfe baseada em altura e período do swell. */
export function activitySurfe(swellHeight: number | null, swellPeriod: number | null): ActivityChip {
  if (swellHeight === null) return { label: 'Surfe', status: '--', color: '#64748b', icon: '🏄' };
  const eff = swellHeight;
  const period = swellPeriod ?? 0;
  if (eff >= 1.2 && period >= 9) return { label: 'Surfe', status: 'Excelente', color: '#10b981', icon: '🏄' };
  if (eff >= 0.8 && period >= 7) return { label: 'Surfe', status: 'Bom', color: '#38bdf8', icon: '🏄' };
  if (eff >= 0.5) return { label: 'Surfe', status: 'Moderado', color: '#f59e0b', icon: '🏄' };
  return { label: 'Surfe', status: 'Ruim', color: '#ef4444', icon: '🏄' };
}

/** Recomendação de pesca baseada em swell efetivo e vento. */
export function activityPesca(swellHeight: number | null, swellPeriod: number | null, windSpeed: number | null): ActivityChip {
  if (swellHeight === null) return { label: 'Pesca', status: '--', color: '#64748b', icon: '🎣' };
  const longPeriod = swellPeriod !== null && swellPeriod >= 10;
  const eff = longPeriod ? swellHeight + 0.4 : swellHeight;
  const wind = windSpeed ?? 0;
  if (eff < 1.5 && wind < 20) return { label: 'Pesca', status: 'Bom', color: '#10b981', icon: '🎣' };
  if (eff < 2.0 && wind < 30) return { label: 'Pesca', status: 'Ok', color: '#f59e0b', icon: '🎣' };
  return { label: 'Pesca', status: 'Ruim', color: '#ef4444', icon: '🎣' };
}

// ── Tendência ─────────────────────────────────────────────────────────────────

export type TrendDirection = 'subindo' | 'baixando' | 'estavel';

/**
 * Compara o max de hoje com a média dos próximos dias do forecast.
 * forecast[0] = hoje; forecast[1..] = dias seguintes.
 */
export function calculateTrend(forecast: RessacaForecastDay[]): { direction: TrendDirection; label: string } {
  if (forecast.length < 2) return { direction: 'estavel', label: '➡️ Estável nos próximos dias' };
  const todayMax = forecast[0].swellHeightMax;
  if (todayMax === null) return { direction: 'estavel', label: '➡️ Estável nos próximos dias' };

  const nextVals = forecast
    .slice(1, 4)
    .map((d) => d.swellHeightMax)
    .filter((v): v is number => v !== null);
  if (nextVals.length === 0) return { direction: 'estavel', label: '➡️ Estável nos próximos dias' };

  const nextAvg = nextVals.reduce((a, b) => a + b, 0) / nextVals.length;
  const diff = nextAvg - todayMax;

  if (diff > 0.2) return { direction: 'subindo', label: '📈 Subindo nos próximos dias' };
  if (diff < -0.2) return { direction: 'baixando', label: '📉 Baixando nos próximos dias' };
  return { direction: 'estavel', label: '➡️ Estável nos próximos dias' };
}

// ── Melhor Janela ─────────────────────────────────────────────────────────────

/**
 * Analisa os dados horários de hoje (da API) e retorna o intervalo de 3h
 * com menor swell efetivo entre 06h e 18h.
 * Retorna null se não houver dados suficientes.
 */
export function calculateBestWindow(hourlyToday: HourlySwellEntry[]): string | null {
  // Filtra horas diurnas com dados válidos
  const dayHours = hourlyToday
    .filter((e) => e.hour >= 6 && e.hour <= 17 && e.swellHeight !== null)
    .sort((a, b) => a.hour - b.hour);

  if (dayHours.length < 2) return null;

  let bestStart = dayHours[0].hour;
  let bestScore = Infinity;

  for (let j = 0; j < dayHours.length - 1; j++) {
    // Janela de até 3 horas a partir de dayHours[j]
    const windowEnd = dayHours[j].hour + 3;
    const inWindow = dayHours.filter((e) => e.hour >= dayHours[j].hour && e.hour < windowEnd);
    if (inWindow.length === 0) continue;

    const avgEff = inWindow.reduce((sum, e) => {
      const longPeriod = (e.swellPeriod ?? 0) >= 10;
      const eff = longPeriod ? (e.swellHeight ?? 0) + 0.4 : (e.swellHeight ?? 0);
      return sum + eff;
    }, 0) / inWindow.length;

    if (avgEff < bestScore) {
      bestScore = avgEff;
      bestStart = dayHours[j].hour;
    }
  }

  const endHour = Math.min(bestStart + 3, 18);
  return `${bestStart}h – ${endHour}h`;
}

// ── Pico do dia ───────────────────────────────────────────────────────────────
// (trazido da versão alternativa: identifica o horário exato de maior swell)

export interface PicoDoDia {
  alturaM: number;
  periodoS: number | null;
  direcaoGraus: number | null;
  horario: string; // "HH:mm"
  classificacao: RessacaClassification;
}

/**
 * A partir dos dados horários de hoje, encontra o horário de maior swell
 * (o "pico") e já retorna sua classificação de severidade.
 * Requer que hourlyToday tenha sido montado com swellDirection (opcional)
 * e timeLabel ("HH:mm") — ver useSeaConditions.ts.
 */
export function calcularPicoDoDia(
  hourlyToday: HourlySwellEntry[]
): PicoDoDia | null {
  const comDados = hourlyToday.filter((e) => e.swellHeight !== null);
  if (comDados.length === 0) return null;

  let pico = comDados[0];
  for (const e of comDados) {
    if ((e.swellHeight ?? 0) > (pico.swellHeight ?? 0)) pico = e;
  }

  const alturaM = Number((pico.swellHeight ?? 0).toFixed(1));
  const periodoS = pico.swellPeriod !== null ? Math.round(pico.swellPeriod) : null;

  return {
    alturaM,
    periodoS,
    direcaoGraus: pico.swellDirection ?? null,
    horario: pico.timeLabel ?? `${String(pico.hour).padStart(2, '0')}:00`,
    classificacao: classifyRessaca(alturaM, periodoS),
  };
}

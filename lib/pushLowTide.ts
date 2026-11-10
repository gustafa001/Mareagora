/**
 * Descobre se há uma maré baixa chegando para um porto, dentro de uma janela
 * de antecedência. Lógica pura (sem I/O), usada pelo /api/push/notify.
 *
 * Detalhes importantes:
 * - Os horários em data/mare/*.json são "ingênuos" (sem fuso) e já estão em
 *   horário de Brasília. Por isso comparamos tudo na mesma "régua ingênua":
 *   o relógio de Brasília de agora é tratado como se fosse UTC, igual aos
 *   horários dos eventos.
 * - Olhamos hoje E amanhã: uma maré baixa à 00:40 precisa ser avisada ainda
 *   na noite anterior (ex.: 22:40).
 */
import { getEventosDia } from '@/lib/mare';
import { addDays, brtNow } from '@/lib/tideNow';
import type { Port } from '@/lib/ports';

/** Quanto tempo antes da maré baixa o aviso pode sair. */
export const LEAD_MINUTES = 120;

export interface IncomingLowTide {
  hora: string;
  altura_m: number;
  dt_iso: string;
  minutesAhead: number;
  /** Identifica esta maré específica; usado para não avisar duas vezes. */
  key: string;
}

/** "2026-07-24T00:38:00" ou "2026-07-24T00:38" -> ms numa régua ingênua. */
function naiveMs(dt: string): number {
  return Date.parse(`${dt.slice(0, 16)}:00Z`);
}

export function findIncomingLowTide(
  port: Port,
  now: Date = new Date(),
  leadMinutes: number = LEAD_MINUTES,
): IncomingLowTide | null {
  const { dateStr, minutes } = brtNow(now);
  const nowNaive = Date.parse(`${dateStr}T00:00:00Z`) + minutes * 60_000;

  const eventos = [
    ...getEventosDia(port, dateStr),
    ...getEventosDia(port, addDays(dateStr, 1)),
  ];

  let best: IncomingLowTide | null = null;
  for (const ev of eventos) {
    if (ev.tipo !== 'low') continue;
    const minutesAhead = Math.round((naiveMs(ev.dt_iso) - nowNaive) / 60_000);
    if (minutesAhead <= 0 || minutesAhead > leadMinutes) continue;
    if (!best || minutesAhead < best.minutesAhead) {
      best = {
        hora: ev.hora,
        altura_m: ev.altura_m,
        dt_iso: ev.dt_iso,
        minutesAhead,
        key: `${port.slug}|${ev.dt_iso.slice(0, 16)}`,
      };
    }
  }
  return best;
}

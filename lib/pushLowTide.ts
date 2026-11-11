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
  /** Verdadeiro se for a menor das baixas do dia dela (só quando há mais de uma). */
  lowestOfDay: boolean;
  /** Próxima preamar depois desta baixa (se houver nos dados). */
  nextHigh: { hora: string; altura_m: number } | null;
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
        lowestOfDay: false,
        nextHigh: null,
      };
    }
  }
  if (best) {
    const day = best.dt_iso.slice(0, 10);
    const lowsSameDay = eventos.filter(e => e.tipo === 'low' && e.dt_iso.startsWith(day));
    best.lowestOfDay =
      lowsSameDay.length > 1 && lowsSameDay.every(e => e.altura_m >= best!.altura_m);
    const after = naiveMs(best.dt_iso);
    const high = eventos.find(e => e.tipo === 'high' && naiveMs(e.dt_iso) > after);
    best.nextHigh = high ? { hora: high.hora, altura_m: high.altura_m } : null;
  }
  return best;
}

/** "em 11 min", "em cerca de 1h", "em cerca de 1h30". */
export function formatLead(minutes: number): string {
  if (minutes < 60) return `em ${Math.max(1, minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const approx = m === 0 ? '' : m >= 45 ? `${h + 1}h` : m >= 15 ? `${h}h30` : `${h}h`;
  return `em cerca de ${m === 0 ? `${h}h` : approx}`;
}

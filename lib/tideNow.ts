/**
 * Maré "agora" — cálculo robusto na virada do dia.
 *
 * Problema que isto resolve: tideAtMinute() e getNextHighAndLow() só olham as
 * marés de HOJE. Depois da última maré do dia (ex.: 18h) e antes da primeira
 * (ex.: 00h–05h) eles caem no fallback "primeiro evento do dia": a altura
 * "agora" vira a da primeira maré e o rótulo enchendo/vazando fica errado.
 *
 * Aqui montamos uma linha do tempo com ontem + hoje + amanhã + depois de
 * amanhã, sempre no fuso de Brasília, e interpolamos entre o evento anterior
 * e o próximo de verdade (curva cossenoidal, mais fiel à maré real que reta).
 */
import { getEventosDia } from '@/lib/mare';
import type { Port } from '@/lib/ports';

export interface TimelineEvent {
  hora: string;
  altura_m: number;
  tipo: 'high' | 'low';
  /** 0 = hoje, 1 = amanhã, -1 = ontem */
  dayOffset: number;
  /** minutos absolutos a partir de 00:00 de hoje (pode ser negativo) */
  t: number;
}

export interface NextTide extends TimelineEvent {
  minutesFromNow: number;
}

export interface TideNow {
  height: number | null;
  rising: boolean | null;
  next: NextTide | null;
  nextHigh: NextTide | null;
  nextLow: NextTide | null;
  /** dia (BRT) usado como "hoje", AAAA-MM-DD */
  todayStr: string;
  /** minutos desde 00:00 (BRT) */
  nowMin: number;
}

const TZ = 'America/Sao_Paulo';

export function brtNow(now: Date): { dateStr: string; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '0';
  const hour = Number(get('hour')) % 24; // alguns engines devolvem "24"
  return {
    dateStr: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: hour * 60 + Number(get('minute')),
  };
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function buildTimeline(
  eventsByOffset: Record<number, { hora: string; altura_m: number; tipo?: 'high' | 'low' }[]>
): TimelineEvent[] {
  const out: TimelineEvent[] = [];
  for (const key of Object.keys(eventsByOffset)) {
    const dayOffset = Number(key);
    for (const e of eventsByOffset[dayOffset] ?? []) {
      const [h, m] = e.hora.split(':').map(Number);
      out.push({
        hora: e.hora,
        altura_m: e.altura_m,
        tipo: e.tipo ?? 'high',
        dayOffset,
        t: dayOffset * 1440 + (h || 0) * 60 + (m || 0),
      });
    }
  }
  out.sort((a, b) => a.t - b.t);
  // Se algum evento veio sem tipo, deduz pelos vizinhos (pico/vale).
  for (let i = 0; i < out.length; i++) {
    const e = out[i];
    const prev = out[i - 1], next = out[i + 1];
    if (prev && next) e.tipo = e.altura_m >= prev.altura_m && e.altura_m >= next.altura_m ? 'high' : 'low';
    else if (prev) e.tipo = e.altura_m > prev.altura_m ? 'high' : 'low';
    else if (next) e.tipo = e.altura_m > next.altura_m ? 'high' : 'low';
  }
  return out;
}

function cosInterp(h1: number, h2: number, ratio: number): number {
  return h1 + (h2 - h1) * (1 - Math.cos(Math.PI * ratio)) / 2;
}

/** Altura (m) no minuto absoluto t, interpolando entre eventos vizinhos. */
export function heightAt(timeline: TimelineEvent[], t: number): number | null {
  for (let i = 0; i < timeline.length - 1; i++) {
    const a = timeline[i], b = timeline[i + 1];
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t || 1;
      return cosInterp(a.altura_m, b.altura_m, (t - a.t) / span);
    }
  }
  return null;
}

/** Núcleo puro (testável): estado da maré num minuto absoluto. */
export function computeTideNow(timeline: TimelineEvent[], nowMin: number): Omit<TideNow, 'todayStr' | 'nowMin'> {
  const upcoming = timeline.filter(e => e.t > nowMin);
  const wrap = (e: TimelineEvent | undefined): NextTide | null =>
    e ? { ...e, minutesFromNow: e.t - nowMin } : null;
  const next = wrap(upcoming[0]);
  return {
    height: heightAt(timeline, nowMin),
    rising: next ? next.tipo === 'high' : null,
    next,
    nextHigh: wrap(upcoming.find(e => e.tipo === 'high')),
    nextLow: wrap(upcoming.find(e => e.tipo === 'low')),
  };
}

function timelineFor(port: Port, todayStr: string): TimelineEvent[] {
  const byOffset: Record<number, any[]> = {};
  for (const off of [-1, 0, 1, 2]) byOffset[off] = getEventosDia(port, addDays(todayStr, off));
  return buildTimeline(byOffset);
}

export function getTideNow(port: Port, now: Date): TideNow {
  const { dateStr, minutes } = brtNow(now);
  const tl = timelineFor(port, dateStr);
  return { ...computeTideNow(tl, minutes), todayStr: dateStr, nowMin: minutes };
}

/** Série para o mini-gráfico: de (agora − before) até (agora + after), em passos de `step` min. */
export function getTideSeries(
  port: Port, now: Date, before = 360, after = 1080, step = 30
): { points: { t: number; h: number }[]; nowIndexFraction: number } {
  const { dateStr, minutes } = brtNow(now);
  const tl = timelineFor(port, dateStr);
  const points: { t: number; h: number }[] = [];
  for (let t = minutes - before; t <= minutes + after; t += step) {
    const h = heightAt(tl, t);
    if (h !== null) points.push({ t, h });
  }
  return { points, nowIndexFraction: before / (before + after) };
}

export function formatCountdown(minutes: number): string {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (h === 0) return `em ${m}min`;
  if (m === 0) return `em ${h}h`;
  return `em ${h}h ${m}min`;
}

/** "00:12 (amanhã)" quando o evento cai no dia seguinte. */
export function formatEventTime(e: { hora: string; dayOffset: number }): string {
  return e.dayOffset > 0 ? `${e.hora} (amanhã)` : e.hora;
}

/**
 * MareAgora — Cálculo da Tábua Mensal
 * Extraído de MonthlyTideTable.tsx para ser reaproveitado tanto na renderização
 * da tabela quanto na geração dos exports (PDF/imagem), sem duplicar lógica.
 */

import { TideDay } from './tideUtils';

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getSunTimes(
  year: number, month: number, day: number,
  lat: number, lon: number, utcOffset = -3
): { sunrise: string; sunset: string } {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const normalize = (v: number) => ((v % 360) + 360) % 360;
  const N1 = Math.floor(275 * month / 9);
  const N2 = Math.floor((month + 9) / 12);
  const N3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  const N = N1 - N2 * N3 + day - 30;
  const lngHour = lon / 15;
  const fmt = (h: number) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    if (mm === 60) return `${String(hh + 1).padStart(2, '0')}:00`;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };
  function calc(isRise: boolean): string {
    const t = N + ((isRise ? 6 : 18) - lngHour) / 24;
    const M = 0.9856 * t - 3.289;
    let L = M + 1.916 * Math.sin(toRad(M)) + 0.02 * Math.sin(toRad(2 * M)) + 282.634;
    L = normalize(L);
    let RA = toDeg(Math.atan(0.91764 * Math.tan(toRad(L))));
    const Lq = Math.floor(L / 90) * 90;
    const RAq = Math.floor(RA / 90) * 90;
    RA = normalize(RA + (Lq - RAq)) / 15;
    const sinDec = 0.39782 * Math.sin(toRad(L));
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH = (Math.cos(toRad(90.833)) - sinDec * Math.sin(toRad(lat))) /
      (cosDec * Math.cos(toRad(lat)));
    if (cosH > 1 || cosH < -1) return '--:--';
    const H = isRise
      ? (360 - toDeg(Math.acos(cosH))) / 15
      : toDeg(Math.acos(cosH)) / 15;
    const T = H + RA - 0.06571 * t - 6.622;
    const UT = ((T - lngHour) % 24 + 24) % 24;
    const local = ((UT + utcOffset) % 24 + 24) % 24;
    return fmt(local);
  }
  return { sunrise: calc(true), sunset: calc(false) };
}

export function calcCoef(mares: { altura_m: number }[]): number | null {
  if (mares.length < 2) return null;
  const heights = mares.map((m) => m.altura_m);
  const range = Math.max(...heights) - Math.min(...heights);
  return Math.min(120, Math.max(5, Math.round(range * 55)));
}

export function coefColor(c: number): { text: string; bg: string } {
  if (c >= 90) return { text: '#60a5fa', bg: 'rgba(59,130,246,0.12)' };
  if (c >= 70) return { text: '#34d399', bg: 'rgba(52,211,153,0.12)' };
  if (c >= 50) return { text: '#a3e635', bg: 'rgba(163,230,53,0.12)' };
  if (c >= 30) return { text: '#fbbf24', bg: 'rgba(251,191,36,0.12)' };
  return { text: '#94a3b8', bg: 'rgba(148,163,184,0.08)' };
}

export function pickBestFour(raw: { hora: string; altura_m: number }[]): { hora: string; altura_m: number }[] {
  const sorted = [...raw].sort((a, b) => {
    const toMin = (h: string) => { const [hh, mm] = h.split(':').map(Number); return hh * 60 + mm; };
    return toMin(a.hora) - toMin(b.hora);
  });
  if (sorted.length <= 4) return sorted;
  const extrema: { hora: string; altura_m: number }[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const prev = i > 0 ? sorted[i - 1].altura_m : -Infinity;
    const curr = sorted[i].altura_m;
    const next = i < sorted.length - 1 ? sorted[i + 1].altura_m : -Infinity;
    if ((curr >= prev && curr >= next) || (curr <= prev && curr <= next)) {
      const last = extrema[extrema.length - 1];
      if (!last || Math.abs(last.altura_m - curr) > 0.005) extrema.push(sorted[i]);
    }
  }
  if (extrema.length <= 4) return extrema;
  const result: { hora: string; altura_m: number }[] = [extrema[0]];
  for (let i = 1; i < extrema.length && result.length < 4; i++) {
    const lastH = result[result.length - 1].altura_m;
    const currH = extrema[i].altura_m;
    const lastWasHigh = result.length < 2 || result[result.length - 1].altura_m > result[result.length - 2].altura_m;
    if ((currH > lastH) !== lastWasHigh) result.push(extrema[i]);
  }
  return result.length > 1 ? result : extrema.slice(0, 4);
}

export function isAlta(t: { altura_m: number }, index: number, all: { altura_m: number }[]): boolean {
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;
  if (prev && next) return t.altura_m >= prev.altura_m && t.altura_m >= next.altura_m;
  if (prev) return t.altura_m > prev.altura_m;
  if (next) return t.altura_m > next.altura_m;
  return index % 2 === 0;
}

export interface MareResumo {
  hora: string;
  altura_m: number;
  alta: boolean;
}

export interface LinhaTabua {
  data: string; // YYYY-MM-DD
  dia: number;
  weekday: string;
  isToday: boolean;
  mares: MareResumo[]; // até 4
  coef: number | null;
  sunrise: string;
  sunset: string;
}

/** Monta todas as linhas de um mês (uma por dia), prontas pra renderizar ou exportar */
export function buildMonthRows(
  eventos: TideDay[],
  year: number,
  month: number, // 0-indexado
  lat: number,
  lon: number,
  todayStr: string
): LinhaTabua[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
    const evento = eventos?.find(e => e.data === dateStr) || null;
    const date = parseLocalDate(dateStr);
    const day = date.getDate();
    const weekday = WEEKDAYS[date.getDay()];

    const maresBrutas = pickBestFour(evento?.mares ?? []);
    const mares: MareResumo[] = maresBrutas.map((t, idx) => ({
      hora: t.hora,
      altura_m: t.altura_m,
      alta: isAlta(t, idx, maresBrutas),
    }));

    const coef = calcCoef(maresBrutas);
    const { sunrise, sunset } = getSunTimes(date.getFullYear(), date.getMonth() + 1, day, lat, lon);

    return {
      data: dateStr,
      dia: day,
      weekday,
      isToday: dateStr === todayStr,
      mares,
      coef,
      sunrise,
      sunset,
    };
  });
}

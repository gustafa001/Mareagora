/**
 * MaréAgora — Operações Portuárias
 * ---------------------------------------------------------------------------
 * Módulo de domínio EXCLUSIVO da página "Operações Portuárias".
 *
 * Regra de compatibilidade: este arquivo é 100% aditivo. Ele apenas LÊ dados
 * já expostos por `lib/mare.ts` e `lib/tideUtils.ts` (sem modificá-los) e
 * deriva indicadores operacionais (janela operacional, índice, alertas etc.)
 * usados apenas pelos componentes em `components/port-operations/*`.
 */

import type { MareEvento } from './mare';
import { tideAtMinute, degToCompass, type TideEvent } from './tideUtils';
import { getPortOperationsConfig, type PortOperationsConfig } from '@/data/port-operations-config';

// ─────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────

export type OperationalStatus = 'ideal' | 'atencao' | 'restrita';

export interface SeaState {
  waveHeight: number | null;      // m
  wavePeriod: number | null;      // s
  waveDirectionDeg: number | null;
  windSpeed: number | null;       // km/h
  windDirectionDeg: number | null;
  currentSpeed: number | null;    // nós (estimado)
}

export interface WeatherSnapshot {
  temperature: number | null;     // °C
  windSpeed: number | null;       // km/h
  windDirectionDeg: number | null;
  precipitationProbability: number | null; // %
  humidity: number | null;        // %
  pressure: number | null;        // hPa
  visibility: number | null;      // km
}

export interface OperationalPoint {
  minute: number;         // minuto do dia (0-1439)
  time: string;            // "HH:MM"
  tideHeight: number;
  windSpeed: number | null;
  waveHeight: number | null;
  status: OperationalStatus;
  index: number;            // 0-100
}

export interface OperationalWindow {
  status: OperationalStatus;
  startMinute: number;
  endMinute: number;
  startTime: string;
  endTime: string;
}

export interface OperationalWindowSummary {
  currentStatus: OperationalStatus;
  currentWindow: OperationalWindow | null;
  nextEntryWindow: OperationalWindow | null;
  bestEntryTime: string | null;
  bestExitTime: string | null;
  windowDurationMinutes: number | null;
  minutesRemainingInWindow: number | null;
  progressPercent: number | null; // progresso dentro da janela atual (0-100)
  points: OperationalPoint[];
}

export interface DayForecastSummary {
  date: string;
  label: string; // "Hoje", "Amanhã", "Dia +2"...
  maxTide: number | null;
  minTide: number | null;
  bestWindowLabel: string | null;
  operationalIndex: number;
  status: OperationalStatus;
}

export interface OperationalAlert {
  id: string;
  icon: string;
  message: string;
  severity: 'warning' | 'danger';
}

// ─────────────────────────────────────────────────────────────────────────
// Classificação
// ─────────────────────────────────────────────────────────────────────────

export function classifySeaState(waveHeight: number | null): { label: string; color: string } {
  if (waveHeight === null) return { label: 'Sem dados', color: '#64748b' };
  if (waveHeight < 0.5) return { label: 'Excelente', color: '#10b981' };
  if (waveHeight < 1.2) return { label: 'Boa', color: '#38bdf8' };
  if (waveHeight < 2.0) return { label: 'Moderada', color: '#f59e0b' };
  return { label: 'Ruim', color: '#ef4444' };
}

export function classifyOperationalIndex(index: number): { label: string; color: string } {
  if (index >= 90) return { label: 'Excelente', color: '#10b981' };
  if (index >= 70) return { label: 'Muito Boa', color: '#38bdf8' };
  if (index >= 50) return { label: 'Regular', color: '#f59e0b' };
  if (index >= 30) return { label: 'Ruim', color: '#f97316' };
  return { label: 'Crítica', color: '#ef4444' };
}

export function statusMeta(status: OperationalStatus): { label: string; color: string; icon: string } {
  switch (status) {
    case 'ideal': return { label: 'Ideal', color: '#10b981', icon: '🟢' };
    case 'atencao': return { label: 'Atenção', color: '#f59e0b', icon: '🟡' };
    case 'restrita': return { label: 'Restrita', color: '#ef4444', icon: '🔴' };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Cálculo do índice operacional (0-100)
// ─────────────────────────────────────────────────────────────────────────

function scoreFromTide(tideHeight: number, config: PortOperationsConfig): number {
  const margin = tideHeight - config.minTideM;
  if (margin <= 0) return 0;
  const clamped = Math.min(margin / (config.idealTideM - config.minTideM || 1), 1.2);
  return Math.max(0, Math.min(100, clamped * 100));
}

function scoreFromWind(windSpeed: number | null, config: PortOperationsConfig): number {
  if (windSpeed === null) return 70; // sem dados: neutro
  if (windSpeed <= config.windIdealKmh) return 100;
  if (windSpeed >= config.windLimitKmh) return 0;
  const ratio = (config.windLimitKmh - windSpeed) / (config.windLimitKmh - config.windIdealKmh);
  return Math.max(0, Math.min(100, ratio * 100));
}

function scoreFromWave(waveHeight: number | null, config: PortOperationsConfig): number {
  if (waveHeight === null) return 70;
  if (waveHeight <= config.waveIdealM) return 100;
  if (waveHeight >= config.waveLimitM) return 0;
  const ratio = (config.waveLimitM - waveHeight) / (config.waveLimitM - config.waveIdealM);
  return Math.max(0, Math.min(100, ratio * 100));
}

export function computeOperationalIndex(
  tideHeight: number,
  windSpeed: number | null,
  waveHeight: number | null,
  config: PortOperationsConfig
): number {
  const tideScore = scoreFromTide(tideHeight, config);
  const windScore = scoreFromWind(windSpeed, config);
  const waveScore = scoreFromWave(waveHeight, config);
  // Peso: maré é o fator crítico para calado, vento e onda pesam na manobra.
  const weighted = tideScore * 0.5 + windScore * 0.25 + waveScore * 0.25;
  return Math.round(Math.max(0, Math.min(100, weighted)));
}

export function statusFromIndex(index: number): OperationalStatus {
  if (index >= 70) return 'ideal';
  if (index >= 40) return 'atencao';
  return 'restrita';
}

// ─────────────────────────────────────────────────────────────────────────
// Janela operacional (varre o dia em passos de 30 min)
// ─────────────────────────────────────────────────────────────────────────

interface HourlySeries {
  time: string[];         // ISO strings
  windSpeed?: number[];
  waveHeight?: number[];
}

function nearestHourlyValue(series: number[] | undefined, isoTimes: string[] | undefined, targetMinute: number, baseDate: string): number | null {
  if (!series || !isoTimes) return null;
  const targetHour = Math.floor(targetMinute / 60);
  const idx = isoTimes.findIndex(t => t.startsWith(baseDate) && t.endsWith(`${String(targetHour).padStart(2, '0')}:00`));
  if (idx === -1) return null;
  return series[idx] ?? null;
}

export function buildOperationalPoints(
  tides: (MareEvento | TideEvent)[],
  baseDate: string,
  config: PortOperationsConfig,
  hourly?: HourlySeries
): OperationalPoint[] {
  if (!tides || tides.length === 0) return [];
  const points: OperationalPoint[] = [];

  for (let minute = 0; minute < 1440; minute += 30) {
    const tideHeight = tideAtMinute(minute, tides as TideEvent[]);
    const windSpeed = nearestHourlyValue(hourly?.windSpeed, hourly?.time, minute, baseDate);
    const waveHeight = nearestHourlyValue(hourly?.waveHeight, hourly?.time, minute, baseDate);
    const index = computeOperationalIndex(tideHeight, windSpeed, waveHeight, config);
    const status = statusFromIndex(index);
    const hh = String(Math.floor(minute / 60)).padStart(2, '0');
    const mm = String(minute % 60).padStart(2, '0');
    points.push({ minute, time: `${hh}:${mm}`, tideHeight, windSpeed, waveHeight, status, index });
  }

  return points;
}

export function summarizeOperationalWindow(points: OperationalPoint[], nowMinute: number): OperationalWindowSummary {
  if (points.length === 0) {
    return {
      currentStatus: 'restrita',
      currentWindow: null,
      nextEntryWindow: null,
      bestEntryTime: null,
      bestExitTime: null,
      windowDurationMinutes: null,
      minutesRemainingInWindow: null,
      progressPercent: null,
      points,
    };
  }

  // Agrupa pontos consecutivos com mesmo status em "janelas".
  const windows: OperationalWindow[] = [];
  let start = points[0];
  let prev = points[0];
  for (let i = 1; i <= points.length; i++) {
    const p = points[i];
    if (!p || p.status !== prev.status) {
      windows.push({
        status: prev.status,
        startMinute: start.minute,
        endMinute: prev.minute + 30,
        startTime: start.time,
        endTime: prev.time,
      });
      start = p;
    }
    if (p) prev = p;
  }

  const currentIdx = points.reduce((best, p, i) =>
    Math.abs(p.minute - nowMinute) < Math.abs(points[best].minute - nowMinute) ? i : best, 0);
  const currentStatus = points[currentIdx].status;

  const currentWindow = windows.find(w => nowMinute >= w.startMinute && nowMinute < w.endMinute) ?? null;

  const idealWindows = windows.filter(w => w.status === 'ideal');
  const nextEntryWindow = idealWindows.find(w => w.endMinute > nowMinute) ?? idealWindows[0] ?? null;

  const windowDurationMinutes = currentWindow ? currentWindow.endMinute - currentWindow.startMinute : null;
  const minutesRemainingInWindow = currentWindow ? Math.max(0, currentWindow.endMinute - nowMinute) : null;
  const progressPercent = currentWindow && windowDurationMinutes
    ? Math.round(((nowMinute - currentWindow.startMinute) / windowDurationMinutes) * 100)
    : null;

  return {
    currentStatus,
    currentWindow,
    nextEntryWindow,
    bestEntryTime: nextEntryWindow?.startTime ?? null,
    bestExitTime: nextEntryWindow?.endTime ?? null,
    windowDurationMinutes,
    minutesRemainingInWindow,
    progressPercent,
    points,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Alertas operacionais
// ─────────────────────────────────────────────────────────────────────────

export function buildAlerts(
  sea: SeaState,
  weather: WeatherSnapshot,
  tideCoefficient: number | null,
  config: PortOperationsConfig
): OperationalAlert[] {
  const alerts: OperationalAlert[] = [];

  if (sea.waveHeight !== null && sea.waveHeight >= config.waveLimitM) {
    alerts.push({ id: 'ressaca', icon: '⚠️', message: `Ressaca — ondas de ${sea.waveHeight.toFixed(1)}m acima do limite operacional`, severity: 'danger' });
  }
  if (weather.precipitationProbability !== null && weather.precipitationProbability >= 70) {
    alerts.push({ id: 'chuva', icon: '⚠️', message: `Chuva intensa prevista (${weather.precipitationProbability}% de probabilidade)`, severity: 'warning' });
  }
  if (sea.windSpeed !== null && sea.windSpeed >= config.windLimitKmh) {
    alerts.push({ id: 'vento', icon: '⚠️', message: `Vento de ${Math.round(sea.windSpeed)} km/h acima do limite operacional`, severity: 'danger' });
  }
  if (weather.visibility !== null && weather.visibility < 2) {
    alerts.push({ id: 'neblina', icon: '⚠️', message: `Neblina — visibilidade reduzida a ${weather.visibility.toFixed(1)}km`, severity: 'warning' });
  }
  if (tideCoefficient !== null && (tideCoefficient >= 100 || tideCoefficient <= 25)) {
    alerts.push({ id: 'mare-excepcional', icon: '⚠️', message: `Maré excepcional — coeficiente ${tideCoefficient}`, severity: 'warning' });
  }

  return alerts;
}

// ─────────────────────────────────────────────────────────────────────────
// Utilitário: nascer/pôr do sol (mesma fórmula usada em MonthlyTideTable,
// extraída aqui como função compartilhada e independente — não altera o
// componente original).
// ─────────────────────────────────────────────────────────────────────────

export function getSunTimes(year: number, month: number, day: number, lat: number, lon: number, utcOffset = -3): { sunrise: string; sunset: string } {
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
    const cosH = (Math.cos(toRad(90.833)) - sinDec * Math.sin(toRad(lat))) / (cosDec * Math.cos(toRad(lat)));
    if (cosH > 1 || cosH < -1) return '--:--';
    const H = isRise ? (360 - toDeg(Math.acos(cosH))) / 15 : toDeg(Math.acos(cosH)) / 15;
    const T = H + RA - 0.06571 * t - 6.622;
    const UT = ((T - lngHour) % 24 + 24) % 24;
    const local = ((UT + utcOffset) % 24 + 24) % 24;
    return fmt(local);
  }
  return { sunrise: calc(true), sunset: calc(false) };
}

export { degToCompass, getPortOperationsConfig };
export type { PortOperationsConfig };

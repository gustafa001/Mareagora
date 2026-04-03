"use client";

import { useMemo, useState } from "react";
import { TideDay } from "@/lib/tideUtils";

interface MonthlyTideTableProps {
  eventos: TideDay[];
  portName: string;
  lat: number;
  lon: number;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getSunTimes(
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
    if (mm === 60) return `${String(hh + 1).padStart(2, "0")}:00`;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
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
    if (cosH > 1 || cosH < -1) return "--:--";
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

function calcCoef(mares: { altura_m: number }[]): number | null {
  if (mares.length < 2) return null;
  const heights = mares.map((m) => m.altura_m);
  const range = Math.max(...heights) - Math.min(...heights);
  return Math.min(120, Math.max(5, Math.round(range * 55)));
}

function coefStyle(c: number): { color: string; bg: string } {
  if (c >= 90) return { color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' };
  if (c >= 70) return { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' };
  if (c >= 50) return { color: '#34d399', bg: 'rgba(52,211,153,0.12)' };
  if (c >= 30) return { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' };
  return { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' };
}

function pickBestFour(raw: { hora: string; altura_m: number }[]): { hora: string; altura_m: number }[] {
  const sorted = [...raw].sort((a, b) => {
    const toMin = (h: string) => { const [hh, mm] = h.split(":").map(Number); return hh * 60 + mm; };
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

function isAlta(t: { altura_m: number }, index: number, all: { altura_m: number }[]): boolean {
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;
  if (prev && next) return t.altura_m >= prev.altura_m && t.altura_m >= next.altura_m;
  if (prev) return t.altura_m > prev.altura_m;
  if (next) return t.altura_m > next.altura_m;
  return index % 2 === 0;
}

export default function MonthlyTideTable({ eventos, portName, lat, lon }: MonthlyTideTableProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const today = useMemo(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  }, []);

  const rows = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
      return { data: dateStr, evento: eventos?.find(e => e.data === dateStr) || null };
    });
  }, [eventos, selectedMonth, selectedYear]);

  const availableYears = useMemo(() => {
    const years = new Set<number>([new Date().getFullYear()]);
    eventos?.forEach(e => { const y = parseInt(e.data.split('-')[0], 10); if (!isNaN(y)) years.add(y); });
    return Array.from(years).sort();
  }, [eventos]);

  if (!rows.length) return (
    <div style={cardStyle} className="text-center py-8">
      <span style={{ color: '#475569', fontFamily: 'monospace', fontSize: 13 }}>Dados indisponíveis para o período.</span>
    </div>
  );

  const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e2e8f0',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: 700,
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🌊</div>
          <div>
            <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace' }}>Tábua de Marés</div>
            <div style={{ color: '#475569', fontSize: 10, fontFamily: 'monospace', marginTop: 1 }}>{portName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 12, marginRight: 8 }}>
            <span style={{ color: '#38bdf8', fontSize: 10, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>▲ Alta</span>
            <span style={{ color: '#f97316', fontSize: 10, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>▼ Baixa</span>
            <span style={{ color: '#fbbf24', fontSize: 10, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>☀ Sol</span>
          </div>
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} style={selectStyle}>
            {MONTHS.map((m, idx) => <option key={m} value={idx} style={{ background: '#0f172a', color: '#e2e8f0' }}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} style={selectStyle}>
            {availableYears.map(y => <option key={y} value={y} style={{ background: '#0f172a', color: '#e2e8f0' }}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Dia', '1ª Maré', '2ª Maré', '3ª Maré', '4ª Maré', 'Coef.', '☀ Nascer', '🌅 Pôr'].map(h => (
                <th key={h} style={{
                  padding: '8px 10px', textAlign: h === 'Dia' ? 'left' : 'center',
                  color: '#475569', fontSize: '0.62rem', fontFamily: 'monospace',
                  textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { data: dateStr, evento } = row;
              const date = parseLocalDate(dateStr);
              const day = date.getDate();
              const weekday = WEEKDAYS[date.getDay()];
              const isToday = dateStr === today;
              const isSunday = date.getDay() === 0;
              const mares = pickBestFour(evento?.mares ?? []);
              const coef = calcCoef(mares);
              const cs = coef !== null ? coefStyle(coef) : null;
              const { sunrise, sunset } = getSunTimes(date.getFullYear(), date.getMonth() + 1, day, lat, lon);

              return (
                <tr key={dateStr} style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: isToday
                    ? 'rgba(56,189,248,0.07)'
                    : isSunday ? 'rgba(255,255,255,0.015)' : 'transparent',
                  transition: 'background 0.15s',
                }}>
                  {/* Day */}
                  <td style={{ padding: '7px 10px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: isToday ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)',
                        border: isToday ? '1px solid rgba(56,189,248,0.4)' : '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ color: isToday ? '#38bdf8' : isSunday ? '#f97316' : '#e2e8f0', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'monospace', lineHeight: 1 }}>{day}</span>
                        <span style={{ color: '#475569', fontSize: '0.52rem', fontFamily: 'monospace', textTransform: 'uppercase' }}>{weekday}</span>
                      </div>
                      {isToday && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />}
                    </div>
                  </td>

                  {/* 4 tides */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const tide = mares[i];
                    if (!tide) return (
                      <td key={i} style={{ padding: '7px 4px', textAlign: 'center' }}>
                        <span style={{ color: '#334155', fontSize: '0.7rem', fontFamily: 'monospace' }}>—</span>
                      </td>
                    );
                    const high = isAlta(tide, i, mares);
                    const color = high ? '#38bdf8' : '#f97316';
                    return (
                      <td key={i} style={{ padding: '7px 4px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <span style={{ color, fontSize: '0.6rem', lineHeight: 1 }}>{high ? '▲' : '▼'}</span>
                          <span style={{ color: '#cbd5e1', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem' }}>{tide.hora}</span>
                          <span style={{ color, fontFamily: 'monospace', fontSize: '0.68rem' }}>{tide.altura_m.toFixed(2)}m</span>
                        </div>
                      </td>
                    );
                  })}

                  {/* Coef */}
                  <td style={{ padding: '7px 6px', textAlign: 'center' }}>
                    {cs && coef !== null ? (
                      <span style={{
                        color: cs.color, background: cs.bg,
                        border: `1px solid ${cs.color}30`,
                        borderRadius: 20, padding: '2px 8px',
                        fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: 800,
                      }}>{coef}</span>
                    ) : <span style={{ color: '#334155', fontSize: '0.7rem' }}>—</span>}
                  </td>

                  {/* Sunrise */}
                  <td style={{ padding: '7px 6px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <span style={{ fontSize: '0.7rem' }}>☀</span>
                      <span style={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 600 }}>{sunrise}</span>
                    </div>
                  </td>

                  {/* Sunset */}
                  <td style={{ padding: '7px 6px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <span style={{ fontSize: '0.7rem' }}>🌅</span>
                      <span style={{ color: '#f97316', fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 600 }}>{sunset}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10 }}>
        <span style={{ color: '#334155', fontSize: '0.62rem', fontFamily: 'monospace' }}>
          📡 Fonte: Marinha do Brasil (CHM) · Horários em UTC-3 · ☀ calculado para {portName}
        </span>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(56,189,248,0.1)',
  borderRadius: 20,
  padding: '22px 20px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
};

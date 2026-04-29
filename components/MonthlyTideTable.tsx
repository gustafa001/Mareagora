"use client";

import { useMemo, useState } from "react";
import { TideDay } from "@/lib/tideUtils";

interface MonthlyTideTableProps {
  eventos: TideDay[];
  portName: string;
  lat: number;
  lon: number;
  referencePort?: {
    name: string;
    slug: string;
    distanceKm: number;
  };
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

function coefColor(c: number): { text: string; bg: string } {
  if (c >= 90) return { text: "#60a5fa", bg: "rgba(59,130,246,0.12)" };
  if (c >= 70) return { text: "#34d399", bg: "rgba(52,211,153,0.12)" };
  if (c >= 50) return { text: "#a3e635", bg: "rgba(163,230,53,0.12)" };
  if (c >= 30) return { text: "#fbbf24", bg: "rgba(251,191,36,0.12)" };
  return { text: "#94a3b8", bg: "rgba(148,163,184,0.08)" };
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

export default function MonthlyTideTable({ eventos, portName, lat, lon, referencePort }: MonthlyTideTableProps) {
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
    const currentYear = new Date().getFullYear();
    const years = new Set<number>([currentYear]);
    if (eventos) eventos.forEach(e => { const y = parseInt(e.data.split('-')[0], 10); if (!isNaN(y)) years.add(y); });
    return Array.from(years).sort();
  }, [eventos]);

  if (!rows.length) return (
    <div className="classic-card text-center text-gray-400 py-8">Dados indisponíveis para o período.</div>
  );

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%)",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Header */}
      <div style={{
        padding: "1.25rem 1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.75rem",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🌊</span>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#e2e8f0", letterSpacing: "-0.01em" }}>
            Tábua de Marés — {portName}
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "1rem", marginRight: "0.5rem" }}>
            <span style={{ color: "#60a5fa", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px" }}>▲ ALTA</span>
            <span style={{ color: "#fb923c", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px" }}>▼ BAIXA</span>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0", borderRadius: "8px", padding: "0.3rem 0.6rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", outline: "none",
            }}
          >
            {MONTHS.map((m, idx) => <option key={m} value={idx} style={{ background: "#1e293b" }}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0", borderRadius: "8px", padding: "0.3rem 0.6rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", outline: "none",
            }}
          >
            {availableYears.map(y => <option key={y} value={y} style={{ background: "#1e293b" }}>{y}</option>)}
          </select>
        </div>
      </div>

      {referencePort && (
        <div style={{
          padding: "0.5rem 1.5rem",
          background: "rgba(59,130,246,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <span style={{ fontSize: "0.9rem" }}>ℹ️</span>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>
            Os dados de {portName} são referenciados pelo <a href={`/mare/${referencePort.slug}`} style={{ color: "#60a5fa", textDecoration: "underline", textUnderlineOffset: "3px" }}>{referencePort.name}</a> (~{referencePort.distanceKm} km). 
            <span className="hidden sm:inline"> As diferenças de horário são inferiores a 2 minutos.</span>
          </p>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "75vh", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "520px" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#0f172a", boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", position: "sticky", left: 0, background: "#0f172a", zIndex: 11, minWidth: "64px" }}>DIA</th>
              {["1ª MARÉ","2ª MARÉ","3ª MARÉ","4ª MARÉ"].map(h => (
                <th key={h} style={{ padding: "0.65rem 0.5rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", minWidth: "90px" }}>{h}</th>
              ))}
              <th style={{ padding: "0.65rem 0.5rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", minWidth: "52px", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>COEF</th>
              <th style={{ padding: "0.65rem 0.5rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", minWidth: "64px" }}>☀ NASCE</th>
              <th style={{ padding: "0.65rem 0.5rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", minWidth: "64px" }}>🌅 PÕE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { data: dateStr, evento } = row;
              const date = parseLocalDate(dateStr);
              const day = date.getDate();
              const weekday = WEEKDAYS[date.getDay()];
              const isToday = dateStr === today;
              const mares = pickBestFour(evento?.mares ?? []);
              const coef = calcCoef(mares);
              const { sunrise, sunset } = getSunTimes(date.getFullYear(), date.getMonth() + 1, day, lat, lon);
              const coefStyle = coef !== null ? coefColor(coef) : null;
              const isSunday = date.getDay() === 0;
              const isSaturday = date.getDay() === 6;

              return (
                <tr key={dateStr} style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: isToday
                    ? "rgba(59,130,246,0.08)"
                    : isSunday || isSaturday
                    ? "rgba(255,255,255,0.015)"
                    : "transparent",
                  transition: "background 0.15s",
                }}>
                  {/* Day cell */}
                  <td style={{ padding: "0.5rem 1rem", position: "sticky", left: 0, background: isToday ? "rgba(30,50,100,0.95)" : "#0f172a", zIndex: 1, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "36px" }}>
                      <div style={{
                        width: "30px", height: "30px", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isToday ? "#3b82f6" : "transparent",
                        fontWeight: 700, fontSize: "0.95rem",
                        color: isToday ? "#fff" : isSunday ? "#fb923c" : "#e2e8f0",
                      }}>{day}</div>
                      <span style={{ fontSize: "0.6rem", fontWeight: 600, color: isToday ? "#93c5fd" : "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "1px" }}>{weekday}</span>
                      {isToday && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#60a5fa", marginTop: "2px" }} />}
                    </div>
                  </td>

                  {/* 4 tide columns */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const tide = mares[i];
                    if (!tide) return (
                      <td key={i} style={{ padding: "0.5rem", textAlign: "center", color: "#334155", fontSize: "0.85rem" }}>—</td>
                    );
                    const high = isAlta(tide, i, mares);
                    return (
                      <td key={i} style={{ padding: "0.45rem 0.4rem", textAlign: "center", background: high ? "rgba(59,130,246,0.05)" : "rgba(251,146,60,0.05)" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                          <span style={{ fontSize: "0.5rem", color: high ? "#60a5fa" : "#fb923c" }}>{high ? "▲" : "▼"}</span>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#f1f5f9", fontVariantNumeric: "tabular-nums", letterSpacing: "0.3px" }}>{tide.hora}</span>
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: high ? "#60a5fa" : "#fb923c", fontVariantNumeric: "tabular-nums" }}>{tide.altura_m.toFixed(2)}m</span>
                        </div>
                      </td>
                    );
                  })}

                  {/* Coef */}
                  <td style={{ padding: "0.5rem 0.4rem", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
                    {coef !== null && coefStyle ? (
                      <span style={{
                        display: "inline-block", fontSize: "0.78rem", fontWeight: 800,
                        padding: "0.15rem 0.4rem", borderRadius: "20px",
                        color: coefStyle.text, background: coefStyle.bg,
                        border: `1px solid ${coefStyle.text}33`,
                        fontVariantNumeric: "tabular-nums",
                      }}>{coef}</span>
                    ) : <span style={{ color: "#334155" }}>—</span>}
                  </td>

                  {/* Sunrise */}
                  <td style={{ padding: "0.5rem 0.4rem", textAlign: "center", background: "rgba(251,191,36,0.03)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                      <span style={{ fontSize: "0.65rem" }}>☀</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fcd34d", fontVariantNumeric: "tabular-nums" }}>{sunrise}</span>
                    </div>
                  </td>

                  {/* Sunset */}
                  <td style={{ padding: "0.5rem 0.4rem", textAlign: "center", background: "rgba(251,191,36,0.03)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                      <span style={{ fontSize: "0.65rem" }}>🌅</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fb923c", fontVariantNumeric: "tabular-nums" }}>{sunset}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ padding: "0.65rem 1rem", borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)", textAlign: "center", fontSize: "0.65rem", color: "#475569", letterSpacing: "0.3px" }}>
        Fonte: Marinha do Brasil (CHM) · Horários em UTC-3 · ☀ calculado para {portName}
      </div>
    </div>
  );
                       }
                          

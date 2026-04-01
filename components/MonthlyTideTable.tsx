"use client";

import { useMemo } from "react";
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

/* ── Date helpers ── */
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/* ── Sun times (NOAA simplified algorithm) ─────────────────────────
   Returns sunrise and sunset in local UTC-3 time.
   Accurate to ±1 min for Brazilian latitudes.
─────────────────────────────────────────────────────────────────── */
function getSunTimes(
  year: number, month: number, day: number,
  lat: number, lon: number, utcOffset = -3
): { sunrise: string; sunset: string } {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const normalize = (v: number) => ((v % 360) + 360) % 360;

  // Day of year
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

/* ── Coeficiente de maré ────────────────────────────────────────────
   Derived from daily tidal range. Brazilian reference: ~1.4–2.0m max.
   Formula: coef ≈ range_m × 55 (empirical), capped [0–120].
─────────────────────────────────────────────────────────────────── */
function calcCoef(mares: { altura_m: number }[]): number | null {
  if (mares.length < 2) return null;
  const heights = mares.map((m) => m.altura_m);
  const range = Math.max(...heights) - Math.min(...heights);
  return Math.min(120, Math.max(5, Math.round(range * 55)));
}

/* ── Coef colour ── */
function coefColor(c: number): string {
  if (c >= 90) return "#1d4ed8";   // muito alto – azul escuro
  if (c >= 70) return "#2563eb";   // alto – azul
  if (c >= 50) return "#16a34a";   // médio – verde
  if (c >= 30) return "#ca8a04";   // baixo – amarelo
  return "#9ca3af";                // muito baixo – cinza
}

/* ── Reduce to 4 true tide extremes ────────────────────────────────
   Handles ports where the JSON contains many hourly readings instead
   of only preamares/baixa-mares.
─────────────────────────────────────────────────────────────────── */
function pickBestFour(
  raw: { hora: string; altura_m: number }[]
): { hora: string; altura_m: number }[] {
  const sorted = [...raw].sort((a, b) => {
    const toMin = (h: string) => {
      const [hh, mm] = h.split(":").map(Number);
      return hh * 60 + mm;
    };
    return toMin(a.hora) - toMin(b.hora);
  });

  if (sorted.length <= 4) return sorted;

  // Find local extrema (peaks / valleys)
  const extrema: { hora: string; altura_m: number }[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const prev = i > 0 ? sorted[i - 1].altura_m : -Infinity;
    const curr = sorted[i].altura_m;
    const next = i < sorted.length - 1 ? sorted[i + 1].altura_m : -Infinity;
    if ((curr >= prev && curr >= next) || (curr <= prev && curr <= next)) {
      const last = extrema[extrema.length - 1];
      // De-duplicate plateau values
      if (!last || Math.abs(last.altura_m - curr) > 0.005) {
        extrema.push(sorted[i]);
      }
    }
  }

  if (extrema.length <= 4) return extrema;

  // Still too many — keep first 4 alternating high/low
  const result: { hora: string; altura_m: number }[] = [extrema[0]];
  for (let i = 1; i < extrema.length && result.length < 4; i++) {
    const lastH = result[result.length - 1].altura_m;
    const currH = extrema[i].altura_m;
    // Only accept if direction changes
    const lastWasHigh = result.length < 2 ||
      result[result.length - 1].altura_m > result[result.length - 2].altura_m;
    if ((currH > lastH) !== lastWasHigh) {
      result.push(extrema[i]);
    }
  }
  return result.length > 1 ? result : extrema.slice(0, 4);
}

/* ── Alta / baixa detector ── */
function isAlta(
  t: { altura_m: number },
  index: number,
  all: { altura_m: number }[]
): boolean {
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;
  if (prev && next) return t.altura_m >= prev.altura_m && t.altura_m >= next.altura_m;
  if (prev) return t.altura_m > prev.altura_m;
  if (next) return t.altura_m > next.altura_m;
  return index % 2 === 0;
}

/* ═══════════════════ COMPONENT ═══════════════════════════════════ */
export default function MonthlyTideTable({
  eventos, portName, lat, lon,
}: MonthlyTideTableProps) {
  const today = useMemo(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  }, []);

  /* 31 days from today */
  const rows = useMemo(() => {
    const dates = [];
    const startDate = new Date();
    // Generate 31 consecutive dates
    for (let i = 0; i < 31; i++) {
       const d = new Date(startDate);
       d.setDate(startDate.getDate() + i);
       const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
       
       const evento = eventos?.find(e => e.data === dateStr);
       dates.push({
         data: dateStr,
         evento: evento || null
       });
    }
    return dates;
  }, [eventos]);

  const monthLabel = useMemo(() => {
    if (!rows.length) return "";
    const d = parseLocalDate(rows[0].data);
    return `${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
  }, [rows]);

  if (!rows.length) {
    return (
      <div className="classic-card text-center text-gray-400 py-8">
        Dados indisponíveis para o período.
      </div>
    );
  }

  return (
    <div className="monthly-tide-card">
      {/* ── Header ── */}
      <div className="monthly-tide-header">
        <div className="monthly-tide-title-row">
          <span className="monthly-tide-icon">🌊</span>
          <h3 className="monthly-tide-title">Tábua de Marés — {portName}</h3>
          <span className="monthly-tide-month">{monthLabel}</span>
        </div>
        <div className="monthly-tide-legend">
          <span className="legend-alta">▲ Alta</span>
          <span className="legend-baixa">▼ Baixa</span>
          <span className="legend-sun">☀ Sol</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="monthly-tide-scroll">
        <table className="monthly-tide-table">
          <thead>
            <tr>
              <th className="col-day">Dia</th>
              <th className="col-tide">1ª Maré</th>
              <th className="col-tide">2ª Maré</th>
              <th className="col-tide">3ª Maré</th>
              <th className="col-tide">4ª Maré</th>
              <th className="col-meta col-coef">Coef.</th>
              <th className="col-meta col-sun">☀ Nascer</th>
              <th className="col-meta col-sun">🌅 Pôr</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const dateStr = row.data;
              const evento = row.evento;
              const date = parseLocalDate(dateStr);
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const day = date.getDate();
              const dayNum = day;
              const weekday = WEEKDAYS[date.getDay()];
              const isToday = dateStr === today;

              const mares = pickBestFour(evento?.mares ?? []);
              const coef = calcCoef(mares);
              const { sunrise, sunset } = getSunTimes(year, month, day, lat, lon);

              return (
                <tr
                  key={dateStr}
                  className={`tide-row ${isToday ? "tide-row--today" : ""}`}
                >
                  {/* Day */}
                  <td className="cell-day">
                    <div className={`day-badge ${isToday ? "day-badge--today" : ""}`}>
                      <span className="day-num">{dayNum}</span>
                      <span className="day-week">{weekday}</span>
                      {isToday && <span className="today-dot" />}
                    </div>
                  </td>

                  {/* 4 tide columns */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const tide = mares[i];
                    if (!tide) {
                      return <td key={i} className="cell-tide cell-empty">—</td>;
                    }
                    const high = isAlta(tide, i, mares);
                    return (
                      <td key={i} className={`cell-tide ${high ? "cell-alta" : "cell-baixa"}`}>
                        <div className="tide-entry">
                          <span className={`tide-arrow ${high ? "arrow-alta" : "arrow-baixa"}`}>
                            {high ? "▲" : "▼"}
                          </span>
                          <span className="tide-time">{tide.hora}</span>
                          <span className={`tide-height ${high ? "height-alta" : "height-baixa"}`}>
                            {tide.altura_m.toFixed(2)}m
                          </span>
                        </div>
                      </td>
                    );
                  })}

                  {/* Coeficiente */}
                  <td className="cell-meta cell-coef-val">
                    {coef !== null ? (
                      <span
                        className="coef-badge"
                        style={{ color: coefColor(coef), borderColor: coefColor(coef) + "44" }}
                      >
                        {coef}
                      </span>
                    ) : (
                      <span className="cell-empty">—</span>
                    )}
                  </td>

                  {/* Sunrise */}
                  <td className="cell-meta cell-sun-val">
                    <div className="sun-entry">
                      <span className="sun-icon">☀</span>
                      <span className="sun-time">{sunrise}</span>
                    </div>
                  </td>

                  {/* Sunset */}
                  <td className="cell-meta cell-sun-val">
                    <div className="sun-entry">
                      <span className="sun-icon sun-icon--set">🌅</span>
                      <span className="sun-time">{sunset}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="monthly-tide-footer">
        Fonte: Marinha do Brasil (CHM) · Horários em UTC-3 · ☀ calculado para {portName}
      </p>
    </div>
  );
}

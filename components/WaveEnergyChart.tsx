"use client";

import { useMemo, useState } from "react";
import { groupHourlyByDay, powerColor, POWER_STOPS } from "@/components/charts/surfChartUtils";
import { useT } from "@/lib/tideI18n";

interface HourlyMarine {
  time: string[];
  wave_height?: number[];
  wave_period?: number[];
}

interface WaveEnergyChartProps {
  hourly: HourlyMarine | null;
  days?: number;
  beachName?: string;
}

type Mode = "energia" | "potencia";

// Densidade de energia de onda: E ≈ (1/16) * rho * g * H^2  (J/m²)
function energyDensity(h: number) {
  return 628.7 * h * h;
}
// Potência por metro de crista (aproximação água profunda): P ≈ 0.5 * H^2 * T  (kW/m)
function wavePower(h: number, t: number) {
  return 0.5 * h * h * t;
}

export default function WaveEnergyChart({ hourly, days = 5, beachName = "praia" }: WaveEnergyChartProps) {
  const { lang, s } = useT();
  const [mode, setMode] = useState<Mode>("energia");
  const groupOpts = { todayLabel: s.today, tomorrowLabel: s.tomorrow, locale: lang === 'en' ? 'en-US' : 'pt-BR' };

  const points = useMemo(() => {
    if (!hourly?.time?.length) return [];
    return hourly.time.map((t, i) => {
      const h = hourly.wave_height?.[i] ?? 0;
      const p = hourly.wave_period?.[i] ?? 8;
      return { time: t, energy: energyDensity(h), power: wavePower(h, p) };
    });
  }, [hourly]);

  if (!points.length) return <ChartSkeleton label={s.loadingEnergy} />;

  const dayGroups = groupHourlyByDay(points, days, groupOpts).map((g) => ({
    ...g,
    points: g.points.filter((_, i) => i % 3 === 0),
  }));

  const key = mode === "energia" ? "energy" : "power";
  const maxVal = Math.max(...points.map((p) => p[key])) * 1.15 || 1;

  const W = 680;
  const marginLeft = 46, marginRight = 6, marginTop = 30, marginBottom = 20;
  const plotW = W - marginLeft - marginRight;
  const plotH = 190;
  const H = marginTop + plotH + marginBottom;
  const dayW = plotW / dayGroups.length;

  const yTicks = buildYTicks(maxVal);

  return (
    <div style={styles.card} aria-label={s.energyChartAria(beachName)}>
      <header style={styles.header}>
        <span style={styles.title}>{s.energyPowerTitle}</span>
      </header>

      <div style={styles.toggleRow}>
        <button style={{ ...styles.toggleBtn, ...(mode === "energia" ? styles.toggleBtnActive : {}) }} onClick={() => setMode("energia")}>
          {s.modeEnergy}
        </button>
        <button style={{ ...styles.toggleBtn, ...(mode === "potencia" ? styles.toggleBtnActive : {}) }} onClick={() => setMode("potencia")}>
          {s.modePower}
        </button>
      </div>
      <p style={styles.subtitle}>
        {mode === "energia" ? s.energySubtitle : s.powerSubtitle}
      </p>

      <div style={{ overflowX: "auto" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W, display: "block" }}>
          {dayGroups.map((g, di) => (
            <g key={g.key}>
              <rect x={marginLeft + di * dayW} y={0} width={dayW - 1} height={22} fill={di === 0 ? "#e879f9" : "rgba(255,255,255,0.06)"} rx={4} />
              <text x={marginLeft + di * dayW + dayW / 2} y={15} textAnchor="middle" fontSize={11} fontWeight={700} fill={di === 0 ? "#2b0033" : "#cbd5e1"}>
                {g.label}
              </text>
            </g>
          ))}

          {yTicks.map((y) => {
            const yy = marginTop + plotH - (y / maxVal) * plotH;
            return (
              <g key={y}>
                <line x1={marginLeft} x2={W - marginRight} y1={yy} y2={yy} stroke="rgba(255,255,255,0.08)" strokeDasharray="3,3" />
                <text x={marginLeft - 6} y={yy + 3} textAnchor="end" fontSize={9} fill="#94a3b8">{y}</text>
              </g>
            );
          })}

          {dayGroups.map((g, di) => {
            const slotW = dayW / g.points.length;
            return (
              <g key={g.key}>
                {g.points.map((p, pi) => {
                  const val = p[key];
                  const bh = (val / maxVal) * plotH;
                  const x = marginLeft + di * dayW + pi * slotW + slotW * 0.12;
                  const bw = slotW * 0.76;
                  const y = marginTop + plotH - bh;
                  const colorVal = mode === "potencia" ? val : val / 4; // reaproveita a escala de potência
                  return <rect key={pi} x={x} y={y} width={bw} height={Math.max(1, bh)} fill={powerColor(colorVal)} rx={1} />;
                })}
                {di > 0 && <line x1={marginLeft + di * dayW} x2={marginLeft + di * dayW} y1={marginTop} y2={marginTop + plotH} stroke="#0d1526" strokeWidth={2} />}
              </g>
            );
          })}

          <line x1={marginLeft} x2={W - marginRight} y1={marginTop + plotH} y2={marginTop + plotH} stroke="rgba(255,255,255,0.15)" />
        </svg>
      </div>

      <Legend stops={POWER_STOPS} caption={s.powerLegendCaption} />
    </div>
  );
}

function buildYTicks(max: number) {
  const step = max <= 20 ? 5 : max <= 200 ? 50 : max <= 1000 ? 200 : 500;
  const ticks: number[] = [];
  for (let v = 0; v <= max; v += step) ticks.push(Math.round(v));
  return ticks;
}

function Legend({ stops, caption }: { stops: { v: number; c: string }[]; caption: string }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", borderRadius: 4, overflow: "hidden" }}>
        {stops.map((s, i) => (
          <div key={s.v} style={{ flex: 1, background: s.c, color: "#031425", fontSize: 9, fontWeight: 800, textAlign: "center", padding: "3px 0" }}>
            {i === stops.length - 1 ? `${s.v}+` : s.v}
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: 10, color: "#64748b", marginTop: 6, fontWeight: 600 }}>{caption}</p>
    </div>
  );
}

function ChartSkeleton({ label }: { label: string }) {
  return (
    <div style={{ ...styles.card, display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
      <p style={{ color: "rgba(232,121,249,0.5)", fontFamily: "monospace", fontSize: 13 }}>{label}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "rgba(2, 6, 23, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(232, 121, 249, 0.15)",
    borderRadius: 20,
    padding: "20px 16px 16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { color: "#f8fafc", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" },
  toggleRow: { display: "flex", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", width: "fit-content" },
  toggleBtn: { padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#94a3b8", background: "transparent", border: "none", cursor: "pointer" },
  toggleBtnActive: { background: "#e879f9", color: "#2b0033" },
  subtitle: { fontSize: 11, color: "#94a3b8", fontWeight: 600, margin: "8px 0 0" },
};

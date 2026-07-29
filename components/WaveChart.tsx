"use client";

import { useMemo } from "react";
import {
  groupHourlyByDay,
  periodColor,
  PERIOD_STOPS,
  toCardinal,
  dominantDirection,
} from "@/components/charts/surfChartUtils";

interface HourlyMarine {
  time: string[];
  wave_height?: number[];
  wave_period?: number[];
  wave_direction?: number[];
}

interface WaveChartProps {
  hourly: HourlyMarine | null;
  days?: number;
  beachName?: string;
}

interface Point {
  time: string;
  height: number;
  period: number;
  direction: number;
}

const RESSACA_LIMIT = 2.5;

export default function WaveChart({ hourly, days = 5, beachName = "praia" }: WaveChartProps) {
  const points: Point[] = useMemo(() => {
    if (!hourly?.time?.length) return [];
    return hourly.time.map((t, i) => ({
      time: t,
      height: hourly.wave_height?.[i] ?? 0,
      period: hourly.wave_period?.[i] ?? 8,
      direction: hourly.wave_direction?.[i] ?? 0,
    }));
  }, [hourly]);

  if (!points.length) return <ChartSkeleton label="Carregando ondas…" />;

  const dayGroups = groupHourlyByDay(points, days);
  // Amostra ~8 pontos por dia (a cada 3h) pra manter o visual limpo
  const sampled = dayGroups.map((g) => ({
    ...g,
    points: g.points.filter((_, i) => i % 3 === 0),
    dir: dominantDirection(g.points.map((p) => p.direction)),
  }));

  const maxHeight = Math.max(3, ...points.map((p) => p.height)) * 1.15;

  const W = 680;
  const marginLeft = 40, marginRight = 6, marginTop = 30, marginBottom = 50;
  const plotW = W - marginLeft - marginRight;
  const plotH = 220;
  const H = marginTop + plotH + marginBottom;
  const dayW = plotW / sampled.length;

  const yTicks = buildYTicks(maxHeight);

  return (
    <div style={styles.card} aria-label={`Gráfico de ondas — ${beachName}`}>
      <header style={styles.header}>
        <span style={styles.title}>🌊 Altura e período das ondas</span>
        <span style={styles.badge}>Metros (m)</span>
      </header>

      <div style={{ overflowX: "auto" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W, display: "block" }}>
          {/* cabeçalhos dos dias */}
          {sampled.map((g, di) => (
            <g key={g.key}>
              <rect
                x={marginLeft + di * dayW}
                y={0}
                width={dayW - 1}
                height={22}
                fill={di === 0 ? "#00D4FF" : "rgba(255,255,255,0.06)"}
                rx={4}
              />
              <text
                x={marginLeft + di * dayW + dayW / 2}
                y={15}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={di === 0 ? "#031425" : "#cbd5e1"}
              >
                {g.label}
              </text>
            </g>
          ))}

          {/* grid + eixo Y */}
          {yTicks.map((y) => {
            const yy = marginTop + plotH - (y / maxHeight) * plotH;
            return (
              <g key={y}>
                <line x1={marginLeft} x2={W - marginRight} y1={yy} y2={yy} stroke="rgba(255,255,255,0.08)" strokeDasharray="3,3" />
                <text x={marginLeft - 6} y={yy + 3} textAnchor="end" fontSize={9} fill="#94a3b8">{y}m</text>
              </g>
            );
          })}

          {/* linha de ressaca */}
          {maxHeight > RESSACA_LIMIT && (
            <line
              x1={marginLeft} x2={W - marginRight}
              y1={marginTop + plotH - (RESSACA_LIMIT / maxHeight) * plotH}
              y2={marginTop + plotH - (RESSACA_LIMIT / maxHeight) * plotH}
              stroke="#ef4444" strokeDasharray="5,4" strokeWidth={1.5}
            />
          )}

          {/* barras */}
          {sampled.map((g, di) => {
            const slotW = dayW / g.points.length;
            return (
              <g key={g.key}>
                {g.points.map((p, pi) => {
                  const bh = (p.height / maxHeight) * plotH;
                  const x = marginLeft + di * dayW + pi * slotW + slotW * 0.12;
                  const bw = slotW * 0.76;
                  const y = marginTop + plotH - bh;
                  return <rect key={pi} x={x} y={y} width={bw} height={Math.max(1, bh)} fill={periodColor(p.period)} rx={1} />;
                })}
                {di > 0 && (
                  <line
                    x1={marginLeft + di * dayW} x2={marginLeft + di * dayW}
                    y1={marginTop} y2={marginTop + plotH}
                    stroke="#0d1526" strokeWidth={2}
                  />
                )}
              </g>
            );
          })}

          <line x1={marginLeft} x2={W - marginRight} y1={marginTop + plotH} y2={marginTop + plotH} stroke="rgba(255,255,255,0.15)" />

          {/* setas de direção por dia */}
          {sampled.map((g, di) => {
            const cx = marginLeft + di * dayW + dayW / 2;
            const cy = marginTop + plotH + 22;
            return (
              <g key={g.key} transform={`translate(${cx},${cy}) rotate(${g.dir})`}>
                <circle cx={0} cy={0} r={10} fill="rgba(0,212,255,0.15)" stroke="#00D4FF" strokeWidth={1} />
                <path d="M0,-5 L3.5,3 L0,0.5 L-3.5,3 Z" fill="#00D4FF" />
              </g>
            );
          })}
          {sampled.map((g, di) => (
            <text
              key={g.key + "-lbl"}
              x={marginLeft + di * dayW + dayW / 2}
              y={marginTop + plotH + 42}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="#00D4FF"
            >
              {toCardinal(g.dir)}
            </text>
          ))}
        </svg>
      </div>

      <Legend stops={PERIOD_STOPS} caption="cores do gráfico: período primário em segundos (s)" />
    </div>
  );
}

function buildYTicks(max: number) {
  const step = max <= 3 ? 0.5 : max <= 6 ? 1 : 2;
  const ticks: number[] = [];
  for (let v = 0; v <= max; v += step) ticks.push(+v.toFixed(1));
  return ticks;
}

function Legend({ stops, caption }: { stops: { v: number; c: string }[]; caption: string }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", borderRadius: 4, overflow: "hidden" }}>
        {stops.map((s, i) => (
          <div
            key={s.v}
            style={{
              flex: 1, background: s.c, color: "#031425", fontSize: 9, fontWeight: 800,
              textAlign: "center", padding: "3px 0",
            }}
          >
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
    <div style={{ ...styles.card, display: "flex", alignItems: "center", justifyContent: "center", height: 260 }}>
      <p style={{ color: "rgba(0,212,255,0.5)", fontFamily: "monospace", fontSize: 13 }}>{label}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "rgba(2, 6, 23, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(56, 201, 240, 0.15)",
    borderRadius: 20,
    padding: "20px 16px 16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { color: "#f8fafc", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" },
  badge: {
    padding: "3px 10px", borderRadius: 999, background: "rgba(0,212,255,0.1)",
    border: "1px solid rgba(0,212,255,0.25)", fontSize: 10, fontWeight: 800, color: "#00D4FF",
    textTransform: "uppercase",
  },
};

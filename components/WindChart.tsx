"use client";

import { useMemo } from "react";
import { groupHourlyByDay, toCardinal, dominantDirection } from "@/components/charts/surfChartUtils";
import { useT } from "@/lib/tideI18n";

interface HourlyWind {
  time: string[];
  windspeed_10m?: number[];
  winddirection_10m?: number[];
  windgusts_10m?: number[];
}

interface WindChartProps {
  hourly: HourlyWind | null;
  days?: number;
  beachName?: string;
}

interface Point {
  time: string;
  wind: number;
  gust: number;
  direction: number;
}

const WIND_COLOR = "#fbbf24";
const GUST_COLOR = "#ea580c";

export default function WindChart({ hourly, days = 5, beachName = "praia" }: WindChartProps) {
  const { lang, s } = useT();
  const groupOpts = { todayLabel: s.today, tomorrowLabel: s.tomorrow, locale: lang === 'en' ? 'en-US' : 'pt-BR' };

  const points: Point[] = useMemo(() => {
    if (!hourly?.time?.length) return [];
    return hourly.time.map((t, i) => {
      const wind = hourly.windspeed_10m?.[i] ?? 0;
      const gust = hourly.windgusts_10m?.[i] ?? wind;
      return { time: t, wind, gust: Math.max(wind, gust), direction: hourly.winddirection_10m?.[i] ?? 0 };
    });
  }, [hourly]);

  if (!points.length) return <ChartSkeleton label={s.loadingWind} />;

  const dayGroups = groupHourlyByDay(points, days, groupOpts);
  const sampled = dayGroups.map((g) => ({
    ...g,
    points: g.points.filter((_, i) => i % 3 === 0),
    dir: dominantDirection(g.points.map((p) => p.direction)),
  }));

  const maxWind = Math.max(20, ...points.map((p) => p.gust)) * 1.15;

  const W = 680;
  const marginLeft = 34, marginRight = 6, marginTop = 30, marginBottom = 50;
  const plotW = W - marginLeft - marginRight;
  const plotH = 190;
  const H = marginTop + plotH + marginBottom;
  const dayW = plotW / sampled.length;

  const yTicks = buildYTicks(maxWind);

  return (
    <div style={styles.card} aria-label={s.windChartAria(beachName)}>
      <header style={styles.header}>
        <span style={styles.title}>{s.windChartTitle}</span>
        <div style={{ display: "flex", gap: 12 }}>
          <LegendDot color={WIND_COLOR} label={s.windLegend} />
          <LegendDot color={GUST_COLOR} label={s.gusts} />
        </div>
      </header>

      <div style={{ overflowX: "auto" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W, display: "block" }}>
          {sampled.map((g, di) => (
            <g key={g.key}>
              <rect x={marginLeft + di * dayW} y={0} width={dayW - 1} height={22} fill={di === 0 ? "#fbbf24" : "rgba(255,255,255,0.06)"} rx={4} />
              <text x={marginLeft + di * dayW + dayW / 2} y={15} textAnchor="middle" fontSize={11} fontWeight={700} fill={di === 0 ? "#2b1600" : "#cbd5e1"}>
                {g.label}
              </text>
            </g>
          ))}

          {yTicks.map((y) => {
            const yy = marginTop + plotH - (y / maxWind) * plotH;
            return (
              <g key={y}>
                <line x1={marginLeft} x2={W - marginRight} y1={yy} y2={yy} stroke="rgba(255,255,255,0.08)" strokeDasharray="3,3" />
                <text x={marginLeft - 6} y={yy + 3} textAnchor="end" fontSize={9} fill="#94a3b8">{y}</text>
              </g>
            );
          })}

          {sampled.map((g, di) => {
            const slotW = dayW / g.points.length;
            return (
              <g key={g.key}>
                {g.points.map((p, pi) => {
                  const windH = (p.wind / maxWind) * plotH;
                  const gustH = (Math.max(0, p.gust - p.wind) / maxWind) * plotH;
                  const x = marginLeft + di * dayW + pi * slotW + slotW * 0.12;
                  const bw = slotW * 0.76;
                  const yWind = marginTop + plotH - windH;
                  return (
                    <g key={pi}>
                      <rect x={x} y={yWind} width={bw} height={Math.max(1, windH)} fill={WIND_COLOR} />
                      <rect x={x} y={yWind - gustH} width={bw} height={gustH} fill={GUST_COLOR} />
                    </g>
                  );
                })}
                {di > 0 && <line x1={marginLeft + di * dayW} x2={marginLeft + di * dayW} y1={marginTop} y2={marginTop + plotH} stroke="#0d1526" strokeWidth={2} />}
              </g>
            );
          })}

          <line x1={marginLeft} x2={W - marginRight} y1={marginTop + plotH} y2={marginTop + plotH} stroke="rgba(255,255,255,0.15)" />

          {sampled.map((g, di) => {
            const cx = marginLeft + di * dayW + dayW / 2;
            const cy = marginTop + plotH + 22;
            return (
              <g key={g.key} transform={`translate(${cx},${cy}) rotate(${g.dir})`}>
                <circle cx={0} cy={0} r={10} fill="rgba(251,191,36,0.15)" stroke={WIND_COLOR} strokeWidth={1} />
                <path d="M0,-5 L3.5,3 L0,0.5 L-3.5,3 Z" fill={WIND_COLOR} />
              </g>
            );
          })}
          {sampled.map((g, di) => (
            <text key={g.key + "-lbl"} x={marginLeft + di * dayW + dayW / 2} y={marginTop + plotH + 42} textAnchor="middle" fontSize={10} fontWeight={700} fill={WIND_COLOR}>
              {toCardinal(g.dir)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

function buildYTicks(max: number) {
  const step = max <= 30 ? 10 : max <= 60 ? 15 : 20;
  const ticks: number[] = [];
  for (let v = 0; v <= max; v += step) ticks.push(Math.round(v));
  return ticks;
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      <span style={{ color, fontSize: 11, fontWeight: 700 }}>{label}</span>
    </div>
  );
}

function ChartSkeleton({ label }: { label: string }) {
  return (
    <div style={{ ...styles.card, display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
      <p style={{ color: "rgba(251,191,36,0.5)", fontFamily: "monospace", fontSize: 13 }}>{label}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "rgba(2, 6, 23, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(251, 191, 36, 0.15)",
    borderRadius: 20,
    padding: "20px 16px 16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { color: "#f8fafc", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" },
};

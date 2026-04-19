"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface HourlyWind {
  time: string[];
  windspeed_10m?: number[];
  winddirection_10m?: number[];
}

interface WindChartProps {
  hourly: HourlyWind | null;
  days?: number;
  beachName?: string;
}

interface DataPoint {
  label: string;
  fullDate: string;
  speed: number | null;
  rawKmh: number;
  dir: number;
  cardinal: string;
  beaufort: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DataPoint }>;
}

export default function WindChart({ hourly, days = 7, beachName = "praia" }: WindChartProps) {
  if (!hourly?.time?.length) return <ChartSkeleton label="Carregando vento…" />;

  const limit = days * 24;
  const data: DataPoint[] = hourly.time.slice(0, limit).map((iso, i) => {
    const kmh = hourly.windspeed_10m?.[i] ?? 0;
    const dir = hourly.winddirection_10m?.[i] ?? 0;
    const date = new Date(iso);
    return {
      label: formatLabel(date),
      fullDate: formatFull(date),
      speed: roundOne(kmh),
      rawKmh: kmh,
      dir,
      cardinal: toCardinal(dir),
      beaufort: toBeaufort(kmh),
    };
  });

  const ticks = data
    .map((d, i) => ({ i, h: new Date(hourly.time[i]).getHours() }))
    .filter(({ h }) => h === 0 || h === 12)
    .map(({ i }) => data[i]?.label)
    .filter(Boolean) as string[];

  const maxSpeed = Math.max(...data.map((d) => d.speed ?? 0));
  const arrows = data.filter((_, i) => i % 6 === 0).slice(0, 14);

  return (
    <div style={styles.card} aria-label={`Gráfico de vento — ${beachName}`}>
      <header style={styles.header}>
        <span style={styles.title}>💨 Vento — 7 dias</span>
        <div style={styles.legend}>
          <LegendItem color={BEAUFORT_COLORS[1]} label="Fraco" />
          <LegendItem color={BEAUFORT_COLORS[5]} label="Moderado" />
          <LegendItem color={BEAUFORT_COLORS[8]} label="Forte" />
        </div>
      </header>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis
            dataKey="label"
            ticks={ticks}
            tick={styles.tick as any}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, Math.ceil(maxSpeed * 1.2) || 30]}
            tickFormatter={(v: number) => `${v}`}
            tick={styles.tick as any}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<WindTooltip />} />
          <Bar dataKey="speed" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={beaufortColor(entry.beaufort)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={styles.dirRow}>
        {arrows.map((d, i) => (
          <div key={i} style={styles.dirItem} title={`${d.cardinal} (${d.dir}°)`}>
            <svg width="18" height="18" viewBox="0 0 18 18"
              style={{ transform: `rotate(${d.dir}deg)`, transition: "transform 0.3s" }}>
              <polygon points="9,1 13,15 9,12 5,15" fill={beaufortColor(d.beaufort)} fillOpacity={0.9} />
            </svg>
            <span style={{ ...styles.dirLabel, color: beaufortColor(d.beaufort) }}>{d.cardinal}</span>
          </div>
        ))}
      </div>

      <div style={styles.bftScale}>
        {BEAUFORT_LEGEND.map(({ b, label }) => (
          <div key={b} style={styles.bftItem}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: BEAUFORT_COLORS[b] }} />
            <span style={styles.bftLabel}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WindTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={styles.tooltip}>
      <p style={styles.tooltipDate}>{d?.fullDate}</p>
      <div style={styles.tooltipRow}>
        <span style={{ color: "#22d3ee" }}>💨 Vel.</span>
        <span style={{ color: "#22d3ee", fontFamily: "monospace", fontWeight: "bold" }}>{d?.speed} km/h</span>
      </div>
      <div style={styles.tooltipRow}>
        <span style={{ color: "#cbd5e1" }}>🧭 Dir.</span>
        <span style={{ color: "#cbd5e1", fontFamily: "monospace" }}>{d?.cardinal} ({d?.dir}°)</span>
      </div>
      <p style={{ ...styles.tooltipCond, color: beaufortColor(d?.beaufort ?? 0) }}>
        Beaufort {d?.beaufort} — {BEAUFORT_LABELS[Math.min(d?.beaufort ?? 0, 12)]}
      </p>
    </div>
  );
}

function toBeaufort(kmh: number): number {
  if (kmh < 1) return 0; if (kmh < 6) return 1; if (kmh < 12) return 2;
  if (kmh < 20) return 3; if (kmh < 29) return 4; if (kmh < 39) return 5;
  if (kmh < 50) return 6; if (kmh < 62) return 7; if (kmh < 75) return 8;
  if (kmh < 89) return 9; if (kmh < 103) return 10; if (kmh < 118) return 11;
  return 12;
}

const BEAUFORT_COLORS: Record<number, string> = {
  0: "#2dd4bf", 1: "#2dd4bf", 2: "#2dd4bf", 3: "#22d3ee", 4: "#22d3ee",
  5: "#fbbf24", 6: "#fbbf24", 7: "#f87171", 8: "#f87171",
  9: "#ef4444", 10: "#ef4444", 11: "#ef4444", 12: "#ef4444",
};

const BEAUFORT_LABELS = [
  "Calmaria", "Aragem", "Brisa leve", "Brisa fraca", "Brisa mod.",
  "Brisa fresca", "Vento fresco", "Vento forte", "Vendaval",
  "Vendaval forte", "Tempestade", "Tempest. violenta", "Furacão",
];

const BEAUFORT_LEGEND = [
  { b: 1, label: "Calmaria" }, { b: 3, label: "Brisa" },
  { b: 5, label: "Moderado" }, { b: 7, label: "Forte" }, { b: 9, label: "Vendaval" },
];

function beaufortColor(b: number): string {
  return BEAUFORT_COLORS[Math.min(b ?? 0, 12)];
}

function toCardinal(deg: number): string {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function formatLabel(date: Date) {
  return date.toLocaleString("pt-BR", { weekday: "short", hour: "2-digit", minute: "2-digit" });
}
function formatFull(date: Date) {
  return date.toLocaleString("pt-BR", { weekday: "long", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
function roundOne(v: number | null | undefined): number | null {
  return v != null ? Math.round(v * 10) / 10 : null;
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      <span style={{ color, fontSize: 11, fontFamily: "monospace", fontWeight: "bold" }}>{label}</span>
    </div>
  );
}

function ChartSkeleton({ label }: { label: string }) {
  return (
    <div style={{ ...styles.card, display: "flex", alignItems: "center", justifyContent: "center", height: 260 }}>
      <p style={{ color: "rgba(34, 211, 238, 0.5)", fontFamily: "monospace", fontSize: 13 }}>{label}</p>
    </div>
  );
}

const styles = {
  card: {
    background: "transparent",
    padding: "0",
  } as React.CSSProperties,
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } as React.CSSProperties,
  title: { color: "#f8fafc", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const },
  legend: { display: "flex", gap: 12, alignItems: "center" } as React.CSSProperties,
  tick: { fill: "#cbd5e1", fontSize: 10, fontWeight: 600 },
  dirRow: { display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 12, padding: "8px 0", borderTop: "1px solid rgba(255, 255, 255, 0.1)" } as React.CSSProperties,
  dirItem: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3 },
  dirLabel: { fontSize: 8, letterSpacing: "0.05em", fontWeight: 700 },
  bftScale: { display: "flex", justifyContent: "space-between", marginTop: 12, padding: "10px 0 0", borderTop: "1px solid rgba(255, 255, 255, 0.1)" } as React.CSSProperties,
  bftItem: { display: "flex", alignItems: "center", gap: 6 } as React.CSSProperties,
  bftLabel: { color: "#94a3b8", fontSize: 9, fontWeight: 600 } as React.CSSProperties,
  tooltip: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  } as React.CSSProperties,
  tooltipDate: { color: "#94a3b8", fontSize: 10, marginBottom: 8, textTransform: "uppercase" as const } as React.CSSProperties,
  tooltipRow: { display: "flex", justifyContent: "space-between", gap: 30, marginBottom: 4 } as React.CSSProperties,
  tooltipCond: { marginTop: 8, fontSize: 11, fontWeight: 700, textAlign: "center" as const, textTransform: "uppercase" as const, letterSpacing: "0.05em" },
};

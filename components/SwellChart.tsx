"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlyMarine {
  time: string[];
  wave_height?: number[];
  wave_period?: number[];
  swell_wave_height?: number[];
  swell_wave_period?: number[];
}

interface SwellChartProps {
  hourly: HourlyMarine | null;
  days?: number;
  beachName?: string;
}

interface DataPoint {
  label: string;
  fullDate: string;
  altura: number | null;
  periodo: number | null;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DataPoint }>;
}

export default function SwellChart({ hourly, days = 7, beachName = "praia" }: SwellChartProps) {
  if (!hourly?.time?.length) return <ChartSkeleton label="Carregando ondas…" />;

  const limit = days * 24;
  const data: DataPoint[] = hourly.time.slice(0, limit).map((iso, i) => {
    const date = new Date(iso);
    return {
      label: formatLabel(date),
      fullDate: formatFull(date),
      altura: roundOne(hourly.wave_height?.[i] ?? hourly.swell_wave_height?.[i] ?? null),
      periodo: roundOne(hourly.wave_period?.[i] ?? hourly.swell_wave_period?.[i] ?? null),
    };
  });

  const ticks = data
    .map((d, i) => ({ i, h: new Date(hourly.time[i]).getHours() }))
    .filter(({ h }) => h === 0 || h === 12)
    .map(({ i }) => data[i]?.label)
    .filter(Boolean) as string[];

  const maxAltura = Math.max(...data.map((d) => d.altura ?? 0));
  const maxPeriodo = Math.max(...data.map((d) => d.periodo ?? 0));

  return (
    <div style={styles.card} aria-label={`Gráfico de swell — ${beachName}`}>
      <header style={styles.header}>
        <span style={styles.title}>🌊 Swell &amp; Período — 7 dias</span>
        <div style={styles.legend}>
          <LegendLine color="#00D4FF" label="Altura (m)" />
          <LegendLine color="#FFB700" label="Período (s)" dashed />
        </div>
      </header>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 8, right: 40, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="swellGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(0,212,255,0.07)" vertical={false} />

          <XAxis
            dataKey="label"
            ticks={ticks}
            tick={styles.tick as any}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            yAxisId="h"
            orientation="left"
            domain={[0, Math.ceil(maxAltura * 1.3) || 3]}
            tickFormatter={(v: number) => `${v}m`}
            tick={styles.tick as any}
            axisLine={false}
            tickLine={false}
            width={36}
          />

          <YAxis
            yAxisId="p"
            orientation="right"
            domain={[0, Math.ceil(maxPeriodo * 1.2) || 20]}
            tickFormatter={(v: number) => `${v}s`}
            tick={{ ...styles.tick, fill: "#FFB700" } as any}
            axisLine={false}
            tickLine={false}
            width={36}
          />

          <Tooltip content={<SwellTooltip />} />

          <Area
            yAxisId="h"
            type="monotone"
            dataKey="altura"
            stroke="#00D4FF"
            strokeWidth={2}
            fill="url(#swellGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#00D4FF", stroke: "#040E1F", strokeWidth: 2 }}
          />

          <Line
            yAxisId="p"
            type="monotone"
            dataKey="periodo"
            stroke="#FFB700"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 4, fill: "#FFB700", stroke: "#040E1F", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function SwellTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const cond = swellCondition(d?.altura);

  return (
    <div style={styles.tooltip}>
      <p style={styles.tooltipDate}>{d?.fullDate}</p>
      <div style={styles.tooltipRow}>
        <span style={{ color: "#00D4FF" }}>▲ Altura</span>
        <span style={{ color: "#00D4FF", fontFamily: "monospace" }}>{d?.altura ?? "—"} m</span>
      </div>
      <div style={styles.tooltipRow}>
        <span style={{ color: "#FFB700" }}>↺ Período</span>
        <span style={{ color: "#FFB700", fontFamily: "monospace" }}>{d?.periodo ?? "—"} s</span>
      </div>
      <p style={{ ...styles.tooltipCond, color: cond.color }}>{cond.label}</p>
    </div>
  );
}

function swellCondition(h: number | null | undefined) {
  if (!h) return { label: "—", color: "#888" };
  if (h < 0.5) return { label: "Plano", color: "#00FFB3" };
  if (h < 1.0) return { label: "Fraco", color: "#00FFB3" };
  if (h < 1.5) return { label: "Bom", color: "#00D4FF" };
  if (h < 2.5) return { label: "Moderado", color: "#FFB700" };
  if (h < 3.5) return { label: "Forte", color: "#FF8C42" };
  return { label: "Muito forte", color: "#FF4757" };
}

function formatLabel(date: Date) {
  return date.toLocaleString("pt-BR", { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

function formatFull(date: Date) {
  return date.toLocaleString("pt-BR", {
    weekday: "long", day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

function roundOne(v: number | null | undefined): number | null {
  return v != null ? Math.round(v * 10) / 10 : null;
}

function LegendLine({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg width="24" height="8">
        {dashed
          ? <line x1="0" y1="4" x2="24" y2="4" stroke={color} strokeWidth="2" strokeDasharray="5 3" />
          : <line x1="0" y1="4" x2="24" y2="4" stroke={color} strokeWidth="2" />}
      </svg>
      <span style={{ color, fontSize: 11, fontFamily: "monospace" }}>{label}</span>
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

const styles = {
  card: {
    background: "rgba(2, 6, 23, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(56, 201, 240, 0.15)",
    borderRadius: 20,
    padding: "24px 20px 16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  } as React.CSSProperties,
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } as React.CSSProperties,
  title: { color: "var(--white)", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "var(--font-fira-code)" } as React.CSSProperties,
  legend: { display: "flex", gap: 16, alignItems: "center" } as React.CSSProperties,
  tick: { fill: "rgba(248, 250, 252, 0.5)", fontSize: 10, fontFamily: "var(--font-fira-code)" },
  tooltip: {
    background: "rgba(2, 6, 23, 0.95)",
    border: "1px solid rgba(56, 201, 240, 0.3)",
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  } as React.CSSProperties,
  tooltipDate: { color: "rgba(248, 250, 252, 0.6)", fontSize: 10, marginBottom: 8, fontFamily: "var(--font-fira-code)", textTransform: "uppercase" as const } as React.CSSProperties,
  tooltipRow: { display: "flex", justifyContent: "space-between", gap: 30, marginBottom: 4 } as React.CSSProperties,
  tooltipCond: { marginTop: 8, fontSize: 11, fontWeight: 700, textAlign: "center" as const, textTransform: "uppercase" as const, letterSpacing: "0.05em" },
};

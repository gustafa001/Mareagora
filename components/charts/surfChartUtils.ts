// components/charts/surfChartUtils.ts
// Utilitários compartilhados pelos gráficos estilo "Surfguru": escala de cor
// por período/potência, agrupamento de dados horários por dia, direção cardeal.

export const DIRS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO",
];

export function toCardinal(deg: number): string {
  if (!Number.isFinite(deg)) return "--";
  return DIRS[Math.round(deg / 22.5) % 16];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export interface ColorStop {
  v: number;
  c: string;
}

/** Cria uma função que interpola cor a partir de uma lista ordenada de stops {valor, cor}. */
export function makeColorScale(stops: ColorStop[]) {
  return function scale(v: number): string {
    if (!Number.isFinite(v)) return stops[0].c;
    if (v <= stops[0].v) return stops[0].c;
    if (v >= stops[stops.length - 1].v) return stops[stops.length - 1].c;
    for (let i = 0; i < stops.length - 1; i++) {
      if (v >= stops[i].v && v <= stops[i + 1].v) {
        const t = (v - stops[i].v) / (stops[i + 1].v - stops[i].v);
        const [r1, g1, b1] = hexToRgb(stops[i].c);
        const [r2, g2, b2] = hexToRgb(stops[i + 1].c);
        return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
      }
    }
    return stops[stops.length - 1].c;
  };
}

// Escala de cor por período de onda (segundos) — tons frios (mar cru) a quentes/magenta (swell longo e potente)
export const PERIOD_STOPS: ColorStop[] = [
  { v: 4, c: "#5eb8e0" }, { v: 6, c: "#2dd4bf" }, { v: 8, c: "#22d3ee" },
  { v: 9, c: "#4ade80" }, { v: 10, c: "#a3e635" }, { v: 11, c: "#facc15" },
  { v: 12, c: "#fbbf24" }, { v: 13, c: "#fb923c" }, { v: 14, c: "#f97316" },
  { v: 15, c: "#ef4444" }, { v: 16, c: "#dc2626" }, { v: 17, c: "#b91c1c" },
  { v: 18, c: "#991b1b" }, { v: 19, c: "#a21caf" }, { v: 20, c: "#c026d3" },
  { v: 21, c: "#e879f9" },
];
export const periodColor = makeColorScale(PERIOD_STOPS);

// Escala de cor por potência da onda (kW/m)
export const POWER_STOPS: ColorStop[] = [
  { v: 0, c: "#5eb8e0" }, { v: 50, c: "#2dd4bf" }, { v: 100, c: "#4ade80" },
  { v: 200, c: "#a3e635" }, { v: 300, c: "#facc15" }, { v: 450, c: "#fb923c" },
  { v: 600, c: "#ef4444" }, { v: 750, c: "#b91c1c" }, { v: 850, c: "#e879f9" },
];
export const powerColor = makeColorScale(POWER_STOPS);

export interface DayGroup<T> {
  key: string;
  label: string;
  date: Date;
  points: T[];
}

/** Agrupa uma série horária (com campo `time` em ISO) em blocos de dia local (America/Sao_Paulo). */
export function groupHourlyByDay<T extends { time: string }>(
  items: T[],
  maxDays = 5
): DayGroup<T>[] {
  const groups = new Map<string, DayGroup<T>>();
  for (const item of items) {
    const date = new Date(item.time);
    const key = date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
    if (!groups.has(key)) {
      groups.set(key, { key, label: "", date, points: [] });
    }
    groups.get(key)!.points.push(item);
  }
  const arr = Array.from(groups.values()).slice(0, maxDays);
  const today = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  arr.forEach((g) => {
    if (g.key === today) g.label = "Hoje";
    else if (g.key === tomorrow) g.label = "Amanhã";
    else g.label = g.date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", timeZone: "America/Sao_Paulo" }).replace(".", "");
  });
  return arr;
}

/** Direção predominante do dia = moda simples dos octantes (N/NE/E/SE/S/SO/O/NO). */
export function dominantDirection(degrees: number[]): number {
  if (!degrees.length) return 0;
  let sumSin = 0, sumCos = 0;
  for (const d of degrees) {
    const rad = (d * Math.PI) / 180;
    sumSin += Math.sin(rad);
    sumCos += Math.cos(rad);
  }
  const avg = (Math.atan2(sumSin, sumCos) * 180) / Math.PI;
  return (avg + 360) % 360;
}

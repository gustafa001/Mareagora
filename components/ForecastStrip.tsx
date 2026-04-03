"use client";

import { useEffect, useState } from "react";

interface ForecastStripProps {
  lat: number;
  lon: number;
}

function waveIcon(maxW: number): string {
  if (maxW < 0.3) return "🏝️";
  if (maxW < 0.8) return "〰️";
  if (maxW < 1.5) return "🏄";
  if (maxW < 2.5) return "🌊";
  if (maxW < 3.5) return "⚠️";
  return "🚨";
}

function waveLabel(maxW: number): { text: string; color: string } {
  if (maxW < 0.3) return { text: "Plano", color: "#34d399" };
  if (maxW < 0.8) return { text: "Fraco", color: "#67e8f9" };
  if (maxW < 1.5) return { text: "Bom", color: "#38bdf8" };
  if (maxW < 2.5) return { text: "Mod.", color: "#fbbf24" };
  if (maxW < 3.5) return { text: "Forte", color: "#f97316" };
  return { text: "Perig.", color: "#f87171" };
}

export default function ForecastStrip({ lat, lon }: ForecastStripProps) {
  const [dayData, setDayData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecast() {
      const url =
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
        `&hourly=wave_height,wave_period&timezone=America%2FSao_Paulo&forecast_days=7`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (!json?.hourly?.time) return;
        const h = json.hourly;
        const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const seen = new Set<string>();
        const results: any[] = [];
        h.time.forEach((t: string, i: number) => {
          const d = new Date(t);
          const key = d.toDateString();
          if (!seen.has(key) && results.length < 7) {
            seen.add(key);
            const idxs = h.time
              .map((tt: string, ii: number) => new Date(tt).toDateString() === key ? ii : -1)
              .filter((x: number) => x >= 0);
            const heights = idxs.map((ii: number) => h.wave_height?.[ii] ?? 0);
            const periods = idxs.map((ii: number) => h.wave_period?.[ii] ?? 0);
            const maxW = heights.length > 0 ? Math.max(...heights) : 0;
            const minW = heights.length > 0 ? Math.min(...heights) : 0;
            const avgP = periods.length > 0 ? periods.reduce((a: number, b: number) => a + b, 0) / periods.length : 0;
            results.push({ label: days[d.getDay()], date: d.getDate(), maxW: maxW.toFixed(1), minW: minW.toFixed(1), avgP: avgP.toFixed(0) });
          }
        });
        setDayData(results);
      } catch {}
      setLoading(false);
    }
    fetchForecast();
  }, [lat, lon]);

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📅</div>
          <span style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>Próximos 7 dias</span>
        </div>
        <span style={{ color: "#64748b", fontSize: 10, fontFamily: "monospace" }}>onda · min</span>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 80, gap: 12 }}>
          <div className="w-5 h-5 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
          <span style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace" }}>Calculando…</span>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {dayData.map((d, i) => {
            const max = parseFloat(d.maxW);
            const { text, color } = waveLabel(max);
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "10px 4px",
                  borderRadius: 12,
                  border: isActive ? `1px solid ${color}50` : "1px solid rgba(255,255,255,0.05)",
                  background: isActive ? `${color}12` : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
              >
                <span style={{ color: "#64748b", fontSize: "0.6rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{d.label}</span>
                <span style={{ color: "#94a3b8", fontSize: "0.62rem", fontFamily: "monospace" }}>{d.date}</span>
                <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{waveIcon(max)}</span>
                <span style={{ color, fontFamily: "monospace", fontWeight: 800, fontSize: "0.82rem" }}>{d.maxW}m</span>
                <span style={{ color: "#f97316", fontFamily: "monospace", fontSize: "0.65rem" }}>{d.minW}m</span>
                <span style={{ color: color, background: color + "15", border: `1px solid ${color}30`, borderRadius: 6, padding: "1px 5px", fontSize: "0.55rem", fontFamily: "monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{text}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected day detail */}
      {dayData[activeIndex] && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#64748b", fontSize: "0.7rem", fontFamily: "monospace" }}>{dayData[activeIndex].label} — Período médio</span>
          <span style={{ color: "#67e8f9", fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem" }}>{dayData[activeIndex].avgP}s</span>
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(56,189,248,0.1)",
  borderRadius: 20,
  padding: "20px 18px",
  boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
};

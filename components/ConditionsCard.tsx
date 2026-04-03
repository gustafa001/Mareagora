"use client";

import { useEffect, useState } from "react";

interface ConditionsCardProps {
  lat: number;
  lon: number;
}

interface Condition {
  icon: string;
  label: string;
  desc: string;
  color: string;
  activities: { icon: string; label: string; ok: boolean }[];
  waveHeight: number;
  wavePeriod: number;
}

function getCondition(wh: number, wp: number): Condition {
  const activities = [
    { icon: "🏊", label: "Natação", ok: wh < 1.5 },
    { icon: "🤿", label: "Mergulho", ok: wh < 0.8 },
    { icon: "🏄", label: "Surf", ok: wh >= 0.8 && wh < 3.0 },
    { icon: "🚣", label: "Caiaque", ok: wh < 1.2 },
    { icon: "🎣", label: "Pesca", ok: true },
    { icon: "⛵", label: "Vela", ok: wh < 2.0 },
  ];
  if (wh < 0.3) return { icon: "🏝️", label: "Mar Plano", desc: "Condições calmas. Ideal para natação e mergulho.", color: "#34d399", activities, waveHeight: wh, wavePeriod: wp };
  if (wh < 0.8) return { icon: "🤿", label: "Condições Suaves", desc: "Ótimo para kayak, mergulho e pesca embarcada.", color: "#67e8f9", activities, waveHeight: wh, wavePeriod: wp };
  if (wh < 1.5) return { icon: "🏄", label: "Boas Condições", desc: "Ótimo para surf iniciante e intermediário.", color: "#38bdf8", activities, waveHeight: wh, wavePeriod: wp };
  if (wh < 2.5) return { icon: "🌊", label: "Ondas Fortes", desc: "Para surfistas experientes. Atenção no banho de mar.", color: "#fbbf24", activities, waveHeight: wh, wavePeriod: wp };
  return { icon: "⚠️", label: "Mar Agitado", desc: "Condições adversas. Evite atividades na água.", color: "#f87171", activities, waveHeight: wh, wavePeriod: wp };
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 1s ease" }} />
    </div>
  );
}

export default function ConditionsCard({ lat, lon }: ConditionsCardProps) {
  const [loading, setLoading] = useState(true);
  const [cond, setCond] = useState<Condition | null>(null);

  useEffect(() => {
    async function fetchConditions() {
      const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_period&timezone=America%2FSao_Paulo&forecast_days=1`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        const h = json.hourly;
        const now = new Date();
        const nowH = now.getHours();
        const idx = h.time.findIndex((t: string) => {
          const d = new Date(t);
          return d.getHours() === nowH && d.toDateString() === now.toDateString();
        });
        const i = idx >= 0 ? idx : 0;
        setCond(getCondition(h.wave_height[i], h.wave_period[i]));
      } catch {}
      setLoading(false);
    }
    fetchConditions();
  }, [lat, lon]);

  if (loading) return (
    <div style={cardStyle} className="flex items-center justify-center h-48">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        <span style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em" }}>CALCULANDO</span>
      </div>
    </div>
  );

  if (!cond) return null;

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: cond.color + "18", border: `1px solid ${cond.color}35`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🏄</div>
          <span style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>Condições da Água</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "20px 16px", background: `radial-gradient(ellipse at 50% 0%, ${cond.color}10 0%, transparent 70%)`, border: `1px solid ${cond.color}20`, borderRadius: 16, marginBottom: 14 }}>
        <div style={{ fontSize: "3rem", lineHeight: 1, marginBottom: 10, filter: `drop-shadow(0 0 12px ${cond.color}60)` }}>{cond.icon}</div>
        <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1.25rem", color: cond.color, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>{cond.label}</div>
        <div style={{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: 1.5, maxWidth: 200, margin: "0 auto" }}>{cond.desc}</div>

        {/* Wave metrics */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 14 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1.4rem", color: "#e2e8f0" }}>{cond.waveHeight.toFixed(1)}<span style={{ fontSize: "0.7rem", color: "#64748b", marginLeft: 2 }}>m</span></div>
            <div style={{ color: "#64748b", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Altura</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1.4rem", color: "#e2e8f0" }}>{cond.wavePeriod.toFixed(0)}<span style={{ fontSize: "0.7rem", color: "#64748b", marginLeft: 2 }}>s</span></div>
            <div style={{ color: "#64748b", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Período</div>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "12px 14px" }}>
        <div style={{ color: "#64748b", fontSize: "0.65rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Atividades agora</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {cond.activities.map((a) => (
            <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.95rem", width: 20 }}>{a.icon}</span>
              <span style={{ color: a.ok ? "#cbd5e1" : "#475569", fontSize: "0.75rem", fontFamily: "monospace", width: 68 }}>{a.label}</span>
              <MiniBar value={a.ok ? 85 : 20} max={100} color={a.ok ? cond.color : "#374151"} />
              <span style={{ color: a.ok ? cond.color : "#475569", fontSize: "0.65rem", fontFamily: "monospace", fontWeight: 700, width: 24, textAlign: "right" }}>{a.ok ? "✓" : "✗"}</span>
            </div>
          ))}
        </div>
      </div>
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

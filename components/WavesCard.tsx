"use client";

import { degToCompass } from "@/lib/tideUtils";
import { useEffect, useState } from "react";

interface WavesCardProps {
  lat: number;
  lon: number;
}

function StatRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
      <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
      <span style={{ color: accent ? "#67e8f9" : "#e2e8f0", fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem" }}>{value}</span>
    </div>
  );
}

function CompassRose({ deg }: { deg: number }) {
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full absolute inset-0">
        <circle cx="32" cy="32" r="30" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" fill="none" />
        <circle cx="32" cy="32" r="20" stroke="rgba(148,163,184,0.08)" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
        {["N","E","S","O"].map((d, i) => (
          <text key={d}
            x={32 + 25 * Math.sin(i * Math.PI / 2)}
            y={32 - 25 * Math.cos(i * Math.PI / 2) + 3.5}
            textAnchor="middle" fontSize="5.5" fill="rgba(148,163,184,0.5)" fontFamily="monospace">{d}</text>
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-xl text-cyan-300 transition-transform duration-700 ease-out"
          style={{ transform: `rotate(${deg}deg)`, filter: "drop-shadow(0 0 6px rgba(103,232,249,0.6))" }}
        >↑</span>
      </div>
    </div>
  );
}

function waveCondition(h: number) {
  if (h < 0.3) return { label: "Plano", color: "#34d399" };
  if (h < 0.8) return { label: "Fraco", color: "#67e8f9" };
  if (h < 1.5) return { label: "Bom", color: "#38bdf8" };
  if (h < 2.5) return { label: "Moderado", color: "#fbbf24" };
  if (h < 3.5) return { label: "Forte", color: "#f97316" };
  return { label: "Perigoso", color: "#f87171" };
}

export default function WavesCard({ lat, lon }: WavesCardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWaves() {
      const marineUrl =
        `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
        `&hourly=wave_height,wave_period,wave_direction,wind_wave_height` +
        `&wind_speed_unit=kn&timezone=America%2FSao_Paulo&forecast_days=7`;
      const windUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&hourly=wind_speed_10m,wind_direction_10m&wind_speed_unit=kn` +
        `&timezone=America%2FSao_Paulo&forecast_days=1`;
      try {
        const [mr, wr] = await Promise.all([fetch(marineUrl), fetch(windUrl)]);
        const marine = await mr.json();
        const wind = await wr.json();
        if (!marine?.hourly?.time) { setLoading(false); return; }
        const h = marine.hourly;
        const now = new Date();
        const nowPad = now.getHours().toString().padStart(2, "0");
        const todayStr = now.toLocaleDateString("en-CA");
        const idx = h.time.findIndex((t: string) => t.startsWith(todayStr) && t.includes(`T${nowPad}:`));
        const i = idx >= 0 ? idx : 0;
        let windSpeed = 0, windDir = 0;
        if (wind?.hourly?.time) {
          const wh = wind.hourly;
          const wi = wh.time.findIndex((t: string) => t.startsWith(todayStr) && t.includes(`T${nowPad}:`));
          const wIdx = wi >= 0 ? wi : 0;
          windSpeed = wh.wind_speed_10m?.[wIdx] ?? 0;
          windDir = wh.wind_direction_10m?.[wIdx] ?? 0;
        }
        if (h.wave_height?.[i] !== undefined) {
          setData({ height: h.wave_height[i], period: h.wave_period?.[i] ?? 0, direction: h.wave_direction?.[i] ?? 0, windSpeed, windDir });
        }
        setLoading(false);
      } catch { setLoading(false); }
    }
    fetchWaves();
  }, [lat, lon]);

  if (loading) return (
    <div style={cardStyle} className="flex items-center justify-center h-48">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        <span style={{ color: "#64748b", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em" }}>CARREGANDO ONDAS</span>
      </div>
    </div>
  );

  if (!data) return (
    <div style={cardStyle} className="flex items-center justify-center h-32">
      <span style={{ color: "#64748b", fontSize: 13 }}>Sem dados de ondas.</span>
    </div>
  );

  const cond = waveCondition(data.height);

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🌊</div>
          <span style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>Ondas &amp; Vento</span>
        </div>
        <span style={{ color: cond.color, background: cond.color + "18", border: `1px solid ${cond.color}35`, borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {cond.label}
        </span>
      </div>

      {/* Hero block */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 16px", marginBottom: 14 }}>
        <CompassRose deg={data.direction} />
        <div>
          <div style={{ fontFamily: "monospace", fontSize: "2.6rem", fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>
            {data.height.toFixed(1)}<span style={{ fontSize: "1rem", color: "#64748b", marginLeft: 4 }}>m</span>
          </div>
          <div style={{ color: "#64748b", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>
            {degToCompass(data.direction)} · {data.direction}°
          </div>
          <div style={{ color: "#67e8f9", fontSize: "0.7rem", fontFamily: "monospace", marginTop: 6 }}>
            💨 {data.windSpeed.toFixed(0)} kn · {degToCompass(data.windDir)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "2px 14px" }}>
        <StatRow label="Altura" value={`${data.height.toFixed(1)} m`} accent />
        <StatRow label="Período" value={`${data.period.toFixed(0)} s`} />
        <StatRow label="Direção" value={`${degToCompass(data.direction)} (${data.direction}°)`} />
        <StatRow label="Vento" value={`${data.windSpeed.toFixed(0)} kn · ${degToCompass(data.windDir)}`} />
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

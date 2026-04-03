"use client";

import { TideEvent, tideAtMinute, degToCompass } from "@/lib/tideUtils";
import { useEffect, useState } from "react";

interface DetailedForecastTableProps {
  lat: number;
  lon: number;
  todayTides: TideEvent[];
}

interface ForecastBlock {
  hour: string;
  windDir: number;
  windSpeed: number;
  windGust: number;
  temp: number;
  waveHeight: number;
  waveDir: number;
  wavePeriod: number;
  tideHeight: number;
}

function windColor(kmh: number): { bg: string; text: string; label: string } {
  if (kmh < 8)  return { bg: "rgba(139,92,246,0.25)",  text: "#c4b5fd", label: "Calmaria" };
  if (kmh < 15) return { bg: "rgba(99,102,241,0.3)",   text: "#a5b4fc", label: "Brisa leve" };
  if (kmh < 22) return { bg: "rgba(59,130,246,0.3)",   text: "#93c5fd", label: "Brisa" };
  if (kmh < 30) return { bg: "rgba(6,182,212,0.3)",    text: "#67e8f9", label: "Moderado" };
  if (kmh < 40) return { bg: "rgba(16,185,129,0.3)",   text: "#6ee7b7", label: "Forte" };
  if (kmh < 50) return { bg: "rgba(245,158,11,0.3)",   text: "#fcd34d", label: "Muito forte" };
  return         { bg: "rgba(239,68,68,0.3)",           text: "#fca5a5", label: "Tempestade" };
}

function waveColor(m: number): string {
  if (m < 0.5) return "#34d399";
  if (m < 1.0) return "#67e8f9";
  if (m < 1.5) return "#38bdf8";
  if (m < 2.5) return "#fbbf24";
  if (m < 3.5) return "#f97316";
  return "#f87171";
}

function tideColor(m: number): { bg: string; text: string } {
  if (m > 1.2) return { bg: "rgba(56,189,248,0.15)", text: "#38bdf8" };
  if (m > 0.6) return { bg: "rgba(99,102,241,0.15)", text: "#a5b4fc" };
  return { bg: "rgba(249,115,22,0.15)", text: "#fb923c" };
}

function WindArrow({ deg }: { deg: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <span style={{ color: "#64748b", fontSize: "0.6rem", fontFamily: "monospace", letterSpacing: "0.05em" }}>
        {degToCompass(deg)}
      </span>
      <span
        style={{
          fontSize: "1.1rem",
          color: "#94a3b8",
          display: "inline-block",
          transform: `rotate(${deg}deg)`,
          transition: "transform 0.4s ease",
          lineHeight: 1,
        }}
      >↑</span>
    </div>
  );
}

function Row({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "stretch" }}>
      <div style={{
        width: 148, minWidth: 148, padding: "12px 14px 12px 0",
        display: "flex", flexDirection: "column", justifyContent: "center",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        {sublabel && <span style={{ color: "#475569", fontSize: "0.6rem", fontFamily: "monospace", marginTop: 2 }}>{sublabel}</span>}
      </div>
      <div style={{ flex: 1, display: "flex" }}>{children}</div>
    </div>
  );
}

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div style={{
      flex: 1, minWidth: 72, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "10px 4px",
      borderRight: "1px solid rgba(255,255,255,0.03)",
      background: highlight ? "rgba(56,189,248,0.03)" : "transparent",
    }}>
      {children}
    </div>
  );
}

export default function DetailedForecastTable({ lat, lon, todayTides }: DetailedForecastTableProps) {
  const [data, setData] = useState<ForecastBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period&timezone=America%2FSao_Paulo&forecast_days=2`;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=America%2FSao_Paulo&forecast_days=2`;
      try {
        const [resMarine, resWeather] = await Promise.all([fetch(marineUrl), fetch(weatherUrl)]);
        const jsonMarine = await resMarine.json();
        const jsonWeather = await resWeather.json();
        const mw = jsonMarine.hourly;
        const hw = jsonWeather.hourly;
        const now = new Date();
        const nowH = now.getHours();
        let startIndex = hw.time.findIndex((t: string) => {
          const d = new Date(t);
          return d.getHours() >= nowH - 2 && d.toDateString() === now.toDateString();
        });
        if (startIndex < 0) startIndex = 0;
        startIndex = Math.floor(startIndex / 3) * 3;
        const blocks: ForecastBlock[] = [];
        for (let i = 0; i < 8; i++) {
          const idx = startIndex + i * 3;
          if (idx >= hw.time.length) break;
          const dateObj = new Date(hw.time[idx]);
          const blockHour = dateObj.getHours();
          const minuteOfDay = blockHour * 60;
          const tideH = tideAtMinute(minuteOfDay, todayTides);
          blocks.push({
            hour: `${String(blockHour).padStart(2, "0")}h`,
            temp: hw.temperature_2m[idx] || 0,
            windSpeed: hw.wind_speed_10m[idx] || 0,
            windDir: hw.wind_direction_10m[idx] || 0,
            windGust: hw.wind_gusts_10m[idx] || 0,
            waveHeight: mw.wave_height[idx] || 0,
            waveDir: mw.wave_direction[idx] || 0,
            wavePeriod: mw.wave_period[idx] || 0,
            tideHeight: tideH,
          });
        }
        setData(blocks);
      } catch (err) {
        console.error("Erro DetailedForecastTable", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [lat, lon, todayTides]);

  if (loading) return (
    <div style={cardStyle} className="my-8">
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div className="w-6 h-6 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        <span style={{ color: "#64748b", fontSize: 12, fontFamily: "monospace", letterSpacing: "0.1em" }}>CARREGANDO PREVISÃO DETALHADA…</span>
      </div>
      <div style={{ height: 280, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)" }} className="animate-pulse" />
    </div>
  );

  if (data.length === 0) return null;

  const nowIdx = 0;

  return (
    <div style={cardStyle} className="my-8">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>📊</div>
          <div>
            <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "monospace" }}>Previsão Detalhada</div>
            <div style={{ color: "#475569", fontSize: 10, fontFamily: "monospace", marginTop: 1 }}>Open-Meteo · atualizado a cada hora</div>
          </div>
        </div>
        <span style={{ color: "#67e8f9", background: "rgba(103,232,249,0.1)", border: "1px solid rgba(103,232,249,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 10, fontWeight: 700, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Próximas 24h
        </span>
      </div>

      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ minWidth: 700 }}>

          {/* Hora header */}
          <div style={{ display: "flex", marginBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 10 }}>
            <div style={{ width: 148, minWidth: 148 }} />
            {data.map((b, i) => (
              <div key={i} style={{ flex: 1, minWidth: 72, textAlign: "center" }}>
                <span style={{
                  fontFamily: "monospace", fontWeight: 800, fontSize: "1rem",
                  color: i === nowIdx ? "#67e8f9" : "#cbd5e1",
                  background: i === nowIdx ? "rgba(103,232,249,0.1)" : "transparent",
                  border: i === nowIdx ? "1px solid rgba(103,232,249,0.2)" : "1px solid transparent",
                  borderRadius: 8, padding: "2px 8px", display: "inline-block",
                }}>
                  {b.hour}
                </span>
              </div>
            ))}
          </div>

          {/* Dir. vento */}
          <Row label="Dir. do vento">
            {data.map((b, i) => (
              <Cell key={i} highlight={i === nowIdx}><WindArrow deg={b.windDir} /></Cell>
            ))}
          </Row>

          {/* Vento */}
          <Row label="Vento" sublabel="km/h">
            {data.map((b, i) => {
              const wc = windColor(b.windSpeed);
              return (
                <Cell key={i} highlight={i === nowIdx}>
                  <div style={{ background: wc.bg, border: `1px solid ${wc.text}30`, borderRadius: 8, padding: "5px 0", width: "80%", textAlign: "center" }}>
                    <span style={{ color: wc.text, fontFamily: "monospace", fontWeight: 800, fontSize: "0.88rem" }}>{Math.round(b.windSpeed)}</span>
                  </div>
                </Cell>
              );
            })}
          </Row>

          {/* Rajadas */}
          <Row label="Rajadas" sublabel="km/h">
            {data.map((b, i) => {
              const wc = windColor(b.windGust);
              return (
                <Cell key={i} highlight={i === nowIdx}>
                  <div style={{ background: wc.bg, border: `1px solid ${wc.text}30`, borderRadius: 8, padding: "5px 0", width: "80%", textAlign: "center", opacity: 0.85 }}>
                    <span style={{ color: wc.text, fontFamily: "monospace", fontWeight: 800, fontSize: "0.88rem" }}>{Math.round(b.windGust)}</span>
                  </div>
                </Cell>
              );
            })}
          </Row>

          {/* Temperatura */}
          <Row label="Temperatura" sublabel="°C">
            {data.map((b, i) => (
              <Cell key={i} highlight={i === nowIdx}>
                <span style={{ color: "#fb923c", fontFamily: "monospace", fontWeight: 700, fontSize: "0.9rem" }}>{Math.round(b.temp)}°</span>
              </Cell>
            ))}
          </Row>

          {/* Altura onda */}
          <Row label="Altura onda" sublabel="metros">
            {data.map((b, i) => {
              const color = waveColor(b.waveHeight);
              return (
                <Cell key={i} highlight={i === nowIdx}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <span style={{ color, fontFamily: "monospace", fontWeight: 800, fontSize: "1rem" }}>{b.waveHeight.toFixed(1)}</span>
                    <div style={{ width: 28, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, (b.waveHeight / 4) * 100)}%`, height: "100%", background: color, borderRadius: 99 }} />
                    </div>
                  </div>
                </Cell>
              );
            })}
          </Row>

          {/* Período / Dir. onda */}
          <Row label="Período" sublabel="s · dir. onda">
            {data.map((b, i) => (
              <Cell key={i} highlight={i === nowIdx}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <span style={{ color: "#cbd5e1", fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem" }}>{b.wavePeriod.toFixed(0)}s</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <span style={{ color: "#475569", fontSize: "0.58rem", fontFamily: "monospace" }}>{degToCompass(b.waveDir)}</span>
                    <span style={{ fontSize: "0.7rem", color: "#38bdf8", display: "inline-block", transform: `rotate(${b.waveDir}deg)` }}>↑</span>
                  </div>
                </div>
              </Cell>
            ))}
          </Row>

          {/* Maré */}
          <Row label="Maré" sublabel="altura (m)">
            {data.map((b, i) => {
              const tc = tideColor(b.tideHeight);
              return (
                <Cell key={i} highlight={i === nowIdx}>
                  <div style={{ background: tc.bg, border: `1px solid ${tc.text}30`, borderRadius: 8, padding: "5px 0", width: "80%", textAlign: "center" }}>
                    <span style={{ color: tc.text, fontFamily: "monospace", fontWeight: 800, fontSize: "0.88rem" }}>{b.tideHeight.toFixed(2)}</span>
                  </div>
                </Cell>
              );
            })}
          </Row>

        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, display: "flex", flexWrap: "wrap", gap: 16 }}>
        <span style={{ color: "#475569", fontSize: "0.65rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", alignSelf: "center" }}>Vento:</span>
        {[
          { label: "< 8 Calmaria", color: "#c4b5fd" },
          { label: "8–15 Leve", color: "#a5b4fc" },
          { label: "15–22 Brisa", color: "#93c5fd" },
          { label: "22–30 Mod.", color: "#67e8f9" },
          { label: "30+ Forte", color: "#fcd34d" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
            <span style={{ color: "#64748b", fontSize: "0.62rem", fontFamily: "monospace" }}>{l.label}</span>
          </div>
        ))}
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
  padding: "22px 20px",
  boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
};

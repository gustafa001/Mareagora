"use client";
import { getStateSlug } from "@/lib/states";
import { PORTS } from "@/lib/ports";

import { useMemo, useRef, useState } from "react";
import { TideDay } from "@/lib/tideUtils";
import { WEEKDAYS, MONTHS, coefColor, buildMonthRows } from "@/lib/monthlyTideCalc";
import { exportTidePdf } from "@/lib/exportTidePdf";

interface MonthlyTideTableProps {
  eventos: TideDay[];
  portName: string;
  lat: number;
  lon: number;
  state?: string;
  referencePort?: {
    name: string;
    slug: string;
    distanceKm: number;
  };
}

export default function MonthlyTideTable({ eventos, portName, lat, lon, state = "", referencePort }: MonthlyTideTableProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [exportando, setExportando] = useState<null | "pdf" | "imagem">(null);

  const tabelaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  }, []);

  const rows = useMemo(
    () => buildMonthRows(eventos, selectedYear, selectedMonth, lat, lon, today),
    [eventos, selectedMonth, selectedYear, lat, lon, today]
  );

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = new Set<number>([currentYear]);
    if (eventos) eventos.forEach(e => { const y = parseInt(e.data.split('-')[0], 10); if (!isNaN(y)) years.add(y); });
    return Array.from(years).sort();
  }, [eventos]);

  async function handleDownloadPdf() {
    if (exportando) return;
    setExportando("pdf");
    try {
      await exportTidePdf({
        portName,
        state,
        monthLabel: `${MONTHS[selectedMonth]} ${selectedYear}`,
        rows,
      });
    } catch (err) {
      console.error("[MonthlyTideTable] Erro ao gerar PDF:", err);
      alert("Não foi possível gerar o PDF agora. Tente novamente.");
    } finally {
      setExportando(null);
    }
  }

  async function handleDownloadImage() {
    if (exportando || !tabelaRef.current || !scrollRef.current) return;
    setExportando("imagem");

    const prevMaxHeight = scrollRef.current.style.maxHeight;
    const prevOverflowY = scrollRef.current.style.overflowY;
    scrollRef.current.style.maxHeight = "none";
    scrollRef.current.style.overflowY = "visible";

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(tabelaRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      const nome = `tabua-de-mare-${portName.toLowerCase().replace(/\s+/g, "-")}-${MONTHS[selectedMonth].toLowerCase()}-${selectedYear}.png`;
      link.download = nome;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("[MonthlyTideTable] Erro ao gerar imagem:", err);
      alert("Não foi possível gerar a imagem agora. Tente novamente.");
    } finally {
      scrollRef.current.style.maxHeight = prevMaxHeight;
      scrollRef.current.style.overflowY = prevOverflowY;
      setExportando(null);
    }
  }

  if (!rows.length) return (
    <div className="classic-card text-center text-gray-400 py-8">Dados indisponíveis para o período.</div>
  );

  return (
    <div ref={tabelaRef} style={{
      background: "linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%)",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Header */}
      <div style={{
        padding: "1.25rem 1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.75rem",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🌊</span>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#e2e8f0", letterSpacing: "-0.01em" }}>
            Tábua de Marés — {portName}
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "1rem", marginRight: "0.5rem" }}>
            <span style={{ color: "#60a5fa", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px" }}>▲ ALTA</span>
            <span style={{ color: "#fb923c", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px" }}>▼ BAIXA</span>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0", borderRadius: "8px", padding: "0.3rem 0.6rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", outline: "none",
            }}
          >
            {MONTHS.map((m, idx) => <option key={m} value={idx} style={{ background: "#1e293b" }}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0", borderRadius: "8px", padding: "0.3rem 0.6rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", outline: "none",
            }}
          >
            {availableYears.map(y => <option key={y} value={y} style={{ background: "#1e293b" }}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Barra de exportação */}
      <div
        data-html2canvas-ignore="true"
        style={{
          padding: "0.65rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.15)",
          display: "flex",
          gap: "0.6rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600, marginRight: "0.25rem" }}>
          Levar sem sinal:
        </span>
        <button
          onClick={handleDownloadPdf}
          disabled={exportando !== null}
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(96,165,250,0.3)",
            color: "#93c5fd", borderRadius: "999px", padding: "0.4rem 0.9rem",
            fontSize: "0.75rem", fontWeight: 700, cursor: exportando ? "wait" : "pointer",
            opacity: exportando && exportando !== "pdf" ? 0.5 : 1,
          }}
        >
          📄 {exportando === "pdf" ? "Gerando PDF…" : "Baixar PDF do mês"}
        </button>
        <button
          onClick={handleDownloadImage}
          disabled={exportando !== null}
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)",
            color: "#fdba74", borderRadius: "999px", padding: "0.4rem 0.9rem",
            fontSize: "0.75rem", fontWeight: 700, cursor: exportando ? "wait" : "pointer",
            opacity: exportando && exportando !== "imagem" ? 0.5 : 1,
          }}
        >
          🖼️ {exportando === "imagem" ? "Gerando imagem…" : "Baixar imagem (PNG)"}
        </button>
      </div>

      {referencePort && (
        <div style={{
          padding: "0.5rem 1.5rem",
          background: "rgba(59,130,246,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <span style={{ fontSize: "0.9rem" }}>ℹ️</span>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>
            Os dados de {portName} são referenciados pelo <a href={`/mare/${getStateSlug(PORTS.find(p => p.slug === referencePort.slug)?.state || "sp")}/${referencePort.slug}`} style={{ color: "#60a5fa", textDecoration: "underline", textUnderlineOffset: "3px" }}>{referencePort.name}</a> (~{referencePort.distanceKm} km).
            <span className="hidden sm:inline"> As diferenças de horário são inferiores a 2 minutos.</span>
          </p>
        </div>
      )}

      {/* Table */}
      <div ref={scrollRef} style={{ overflowX: "auto", overflowY: "auto", maxHeight: "75vh", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "520px" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#0f172a", boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", position: "sticky", left: 0, background: "#0f172a", zIndex: 11, minWidth: "64px" }}>DIA</th>
              {["1ª MARÉ","2ª MARÉ","3ª MARÉ","4ª MARÉ"].map(h => (
                <th key={h} style={{ padding: "0.65rem 0.5rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", minWidth: "90px" }}>{h}</th>
              ))}
              <th style={{ padding: "0.65rem 0.5rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", minWidth: "52px", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>COEF</th>
              <th style={{ padding: "0.65rem 0.5rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", minWidth: "64px" }}>☀ NASCE</th>
              <th style={{ padding: "0.65rem 0.5rem", textAlign: "center", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", color: "#64748b", textTransform: "uppercase", minWidth: "64px" }}>🌅 PÕE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSunday = WEEKDAYS[0] === row.weekday;
              const isSaturday = WEEKDAYS[6] === row.weekday;
              const coefStyle = row.coef !== null ? coefColor(row.coef) : null;

              return (
                <tr key={row.data} style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: row.isToday
                    ? "rgba(59,130,246,0.08)"
                    : isSunday || isSaturday
                    ? "rgba(255,255,255,0.015)"
                    : "transparent",
                  transition: "background 0.15s",
                }}>
                  {/* Day cell */}
                  <td style={{ padding: "0.5rem 1rem", position: "sticky", left: 0, background: row.isToday ? "rgba(30,50,100,0.95)" : "#0f172a", zIndex: 1, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "36px" }}>
                      <div style={{
                        width: "30px", height: "30px", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: row.isToday ? "#3b82f6" : "transparent",
                        fontWeight: 700, fontSize: "0.95rem",
                        color: row.isToday ? "#fff" : isSunday ? "#fb923c" : "#e2e8f0",
                      }}>{row.dia}</div>
                      <span style={{ fontSize: "0.6rem", fontWeight: 600, color: row.isToday ? "#93c5fd" : "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "1px" }}>{row.weekday}</span>
                      {row.isToday && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#60a5fa", marginTop: "2px" }} />}
                    </div>
                  </td>

                  {/* 4 tide columns */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const tide = row.mares[i];
                    if (!tide) return (
                      <td key={i} style={{ padding: "0.5rem", textAlign: "center", color: "#334155", fontSize: "0.85rem" }}>—</td>
                    );
                    return (
                      <td key={i} style={{ padding: "0.45rem 0.4rem", textAlign: "center", background: tide.alta ? "rgba(59,130,246,0.05)" : "rgba(251,146,60,0.05)" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                          <span style={{ fontSize: "0.5rem", color: tide.alta ? "#60a5fa" : "#fb923c" }}>{tide.alta ? "▲" : "▼"}</span>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#f1f5f9", fontVariantNumeric: "tabular-nums", letterSpacing: "0.3px" }}>{tide.hora}</span>
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: tide.alta ? "#60a5fa" : "#fb923c", fontVariantNumeric: "tabular-nums" }}>{tide.altura_m.toFixed(2)}m</span>
                        </div>
                      </td>
                    );
                  })}

                  {/* Coef */}
                  <td style={{ padding: "0.5rem 0.4rem", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
                    {row.coef !== null && coefStyle ? (
                      <span style={{
                        display: "inline-block", fontSize: "0.78rem", fontWeight: 800,
                        padding: "0.15rem 0.4rem", borderRadius: "20px",
                        color: coefStyle.text, background: coefStyle.bg,
                        border: `1px solid ${coefStyle.text}33`,
                        fontVariantNumeric: "tabular-nums",
                      }}>{row.coef}</span>
                    ) : <span style={{ color: "#334155" }}>—</span>}
                  </td>

                  {/* Sunrise */}
                  <td style={{ padding: "0.5rem 0.4rem", textAlign: "center", background: "rgba(251,191,36,0.03)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                      <span style={{ fontSize: "0.65rem" }}>☀</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fcd34d", fontVariantNumeric: "tabular-nums" }}>{row.sunrise}</span>
                    </div>
                  </td>

                  {/* Sunset */}
                  <td style={{ padding: "0.5rem 0.4rem", textAlign: "center", background: "rgba(251,191,36,0.03)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                      <span style={{ fontSize: "0.65rem" }}>🌅</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fb923c", fontVariantNumeric: "tabular-nums" }}>{row.sunset}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ padding: "0.65rem 1rem", borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)", textAlign: "center", fontSize: "0.65rem", color: "#475569", letterSpacing: "0.3px" }}>
        Fonte: Marinha do Brasil (CHM) · Horários em UTC-3 · ☀ calculado para {portName}
      </div>
    </div>
  );
}

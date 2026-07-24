import { TideEvent } from "@/lib/tideUtils";

interface TideTableProps {
  tides: TideEvent[];
  currentMin: number;
}

export default function TideTable({ tides, currentMin }: TideTableProps) {
  const sorted = [...tides].sort((a, b) => {
    const toMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    return toMin(a.hora) - toMin(b.hora);
  });
  
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  
  const nextIdx = sorted.findIndex(t => toMin(t.hora) > currentMin);
  const maxH = Math.max(...tides.map(t => t.altura_m));

  return (
    <div 
      className="overflow-x-auto rounded-[20px] shadow-2xl border border-white/10"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
      }}
    >
      <div style={{
        padding: "1.25rem 1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem"
      }}>
        <span style={{ fontSize: "1.2rem" }}>🌊</span>
        <span style={{ fontWeight: 700, fontSize: "1rem", color: "#e2e8f0", letterSpacing: "-0.01em" }}>
          Tábua de Marés
        </span>
      </div>

      <table className="w-full border-collapse">
        <thead style={{ background: "#0f172a" }}>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <th className="font-syne text-[0.65rem] font-bold tracking-[1.5px] uppercase text-[#64748b] py-3 px-4 text-left">Horário</th>
            <th className="font-syne text-[0.65rem] font-bold tracking-[1.5px] uppercase text-[#64748b] py-3 px-4 text-left">Tipo</th>
            <th className="font-syne text-[0.65rem] font-bold tracking-[1.5px] uppercase text-[#64748b] py-3 px-4 text-left">Altura</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => {
            const past = toMin(t.hora) < currentMin;
            const isNext = i === nextIdx;
            const pct = Math.round((Math.max(0, t.altura_m) / (maxH || 1)) * 100);
            const isAlta = t.tipo === "high" || (i > 0 && t.altura_m > sorted[i-1].altura_m) || (i === 0 && t.altura_m > sorted[sorted.length-1].altura_m);
            
            return (
              <tr 
                key={i} 
                className={`transition-colors border-b border-white/5 ${isNext ? 'bg-blue-900/30' : 'hover:bg-white/5'}`}
                style={{ opacity: past ? 0.4 : 1 }}
              >
                <td className="py-4 px-4 text-sm font-bold text-[#f1f5f9] font-mono">
                  {t.hora}
                  {isNext && <span className="text-blue-400 text-[0.65rem] ml-2 font-bold uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">← Próxima</span>}
                </td>
                <td className="py-4 px-4 text-sm font-bold">
                  <div className={`flex flex-col gap-1 items-start ${isAlta ? 'text-[#60a5fa]' : 'text-[#fb923c]'}`}>
                    <span className="text-[0.65rem] leading-none">{isAlta ? "▲" : "▼"}</span>
                    <span>{isAlta ? 'PREAMAR' : 'BAIXA-MAR'}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm font-bold text-[#f1f5f9] font-mono">
                  {t.altura_m.toFixed(2)} m
                </td>
                <td className="py-4 px-4 w-[120px]">
                  <div className="flex items-center">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${pct}%`, background: isAlta ? '#60a5fa' : '#fb923c' }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

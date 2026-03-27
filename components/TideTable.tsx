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
    <div className="card">
      <div className="card-title">Horários de hoje</div>
      <table className="tide-table">
        <thead>
          <tr>
            <th className="font-syne text-[0.75rem] tracking-[2.5px] uppercase text-[var(--muted)] p-2.5 text-left border-b border-[rgba(56,201,240,0.1)]">Horário</th>
            <th className="font-syne text-[0.75rem] tracking-[2.5px] uppercase text-[var(--muted)] p-2.5 text-left border-b border-[rgba(56,201,240,0.1)]">Tipo</th>
            <th className="font-syne text-[0.75rem] tracking-[2.5px] uppercase text-[var(--muted)] p-2.5 text-left border-b border-[rgba(56,201,240,0.1)]">Altura</th>
            <th className="border-b border-[rgba(56,201,240,0.1)]"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => {
            const past = toMin(t.hora) < currentMin;
            const isNext = i === nextIdx;
            const pct = Math.round((t.altura_m / maxH) * 100);
            const isAlta = t.tipo === "Alta" || (i > 0 && t.altura_m > sorted[i-1].altura_m) || (i === 0 && t.altura_m > sorted[sorted.length-1].altura_m);
            
            return (
              <tr key={i} className={`${past ? 'opacity-40' : ''} ${isNext ? 'bg-[rgba(56,201,240,0.06)]' : ''}`}>
                <td className="p-3.5 border-b border-[rgba(56,201,240,0.05)] text-sm">
                  <strong>{t.hora}</strong>
                  {isNext && <span className="text-[var(--sun)] text-[0.75rem] ml-2">← próxima</span>}
                </td>
                <td className={`p-3.5 border-b border-[rgba(56,201,240,0.05)] text-sm font-bold ${isAlta ? 'text-[var(--foam)]' : 'text-[var(--sun)]'}`}>
                  {isAlta ? '↑ Alta' : '↓ Baixa'}
                </td>
                <td className="p-3.5 border-b border-[rgba(56,201,240,0.05)] text-sm">
                  {t.altura_m.toFixed(2)} m
                </td>
                <td className="p-3.5 border-b border-[rgba(56,201,240,0.05)] text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-1 bg-[rgba(56,201,240,0.1)] rounded-sm max-w-[70px]">
                      <div 
                        className="h-full rounded-sm transition-all duration-700" 
                        style={{ width: `${pct}%`, background: isAlta ? 'var(--foam)' : 'var(--sun)' }}
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

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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="font-syne text-[0.7rem] tracking-[2px] uppercase text-gray-400 py-3 text-left border-b border-gray-100 italic">Horário</th>
            <th className="font-syne text-[0.7rem] tracking-[2px] uppercase text-gray-400 py-3 text-left border-b border-gray-100 italic">Tipo</th>
            <th className="font-syne text-[0.7rem] tracking-[2px] uppercase text-gray-400 py-3 text-left border-b border-gray-100 italic">Altura</th>
            <th className="border-b border-gray-100 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => {
            const past = toMin(t.hora) < currentMin;
            const isNext = i === nextIdx;
            const pct = Math.round((Math.max(0, t.altura_m) / (maxH || 1)) * 100);
            const isAlta = t.tipo === "Alta" || (i > 0 && t.altura_m > sorted[i-1].altura_m) || (i === 0 && t.altura_m > sorted[sorted.length-1].altura_m);
            
            return (
              <tr key={i} className={`${past ? 'opacity-30' : ''} ${isNext ? 'bg-blue-50/50' : ''} transition-colors`}>
                <td className="py-4 border-b border-gray-50 text-sm">
                  <strong className="text-gray-700">{t.hora}</strong>
                  {isNext && <span className="text-blue-500 text-[0.7rem] ml-2 font-bold uppercase tracking-tighter">← Próxima</span>}
                </td>
                <td className={`py-4 border-b border-gray-50 text-sm font-bold ${isAlta ? 'text-blue-600' : 'text-orange-500'}`}>
                  {isAlta ? '↑ Preamar' : '↓ Baixa-mar'}
                </td>
                <td className="py-4 border-b border-gray-50 text-sm text-gray-600 font-mono">
                  {t.altura_m.toFixed(2)} m
                </td>
                <td className="py-4 border-b border-gray-50 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[80px] overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${pct}%`, background: isAlta ? '#2a68f6' : '#ff914d' }}
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

'use client';

import { useMemo } from 'react';

interface TideEvent {
  data: string;   // 'YYYY-MM-DD'
  hora: string;   // 'HH:MM'
  altura_m: number;
  tipo?: string;  // 'Preamar' | 'Baixamar' (opcional, derivado da altura)
}

interface Props {
  eventos: TideEvent[];
}

const DIAS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function MonthlyTideTable({ eventos }: Props) {
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Agrupar eventos por data
    const grouped = new Map<string, TideEvent[]>();
    for (const e of eventos) {
      if (!grouped.has(e.data)) grouped.set(e.data, []);
      grouped.get(e.data)!.push(e);
    }

    // Pegar próximos 30 dias com dados
    return Array.from(grouped.entries())
      .filter(([dateStr]) => {
        const d = parseLocalDate(dateStr);
        const diffDays = Math.floor((d.getTime() - today.getTime()) / 86400000);
        return diffDays >= 0 && diffDays < 30;
      })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateStr, tides]) => {
        const date = parseLocalDate(dateStr);
        const isToday = dateStr === today.toISOString().slice(0, 10);

        // Calcular avg para determinar preamar/baixamar se tipo não vier
        const heights = tides.map(t => t.altura_m);
        const avg = (Math.max(...heights) + Math.min(...heights)) / 2;

        const sorted = [...tides].sort((a, b) => a.hora.localeCompare(b.hora));

        return { dateStr, date, isToday, tides: sorted, avg };
      });
  }, [eventos]);

  if (days.length === 0) {
    return (
      <div className="classic-card text-center text-gray-400 text-sm py-8">
        Dados mensais não disponíveis.
      </div>
    );
  }

  return (
    <div className="classic-card overflow-hidden">
      <h3 className="card-title mb-4">📅 Tábua de Marés — Próximos 30 dias</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide">
              <th className="text-left py-2 px-3 font-semibold w-20">Data</th>
              <th className="text-center py-2 px-2 font-semibold">1ª</th>
              <th className="text-center py-2 px-2 font-semibold">2ª</th>
              <th className="text-center py-2 px-2 font-semibold">3ª</th>
              <th className="text-center py-2 px-2 font-semibold">4ª</th>
            </tr>
          </thead>
          <tbody>
            {days.map(({ dateStr, date, isToday, tides, avg }) => {
              const dayNum = date.getDate();
              const weekday = DIAS_PT[date.getDay()];
              const month = MESES_PT[date.getMonth()];

              return (
                <tr
                  key={dateStr}
                  className={`border-t border-gray-100 transition-colors ${
                    isToday
                      ? 'bg-blue-50 font-semibold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Data */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col leading-tight">
                      <span className={`text-base font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                        {dayNum}
                      </span>
                      <span className="text-xs text-gray-400">{weekday} {month}</span>
                      {isToday && (
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wide">Hoje</span>
                      )}
                    </div>
                  </td>

                  {/* Eventos (até 4) */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const t = tides[i];
                    if (!t) return <td key={i} className="py-3 px-2" />;

                    const isPreamar = t.tipo
                      ? t.tipo.toLowerCase().includes('preamar') || t.tipo.toLowerCase().includes('alta')
                      : t.altura_m >= avg;

                    return (
                      <td key={i} className="py-3 px-2 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`font-mono font-semibold text-sm ${isPreamar ? 'text-blue-600' : 'text-orange-500'}`}>
                            {t.hora}
                          </span>
                          <span className={`text-xs font-medium ${isPreamar ? 'text-blue-400' : 'text-orange-400'}`}>
                            {isPreamar ? '▲' : '▼'} {t.altura_m.toFixed(1)}m
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Dados oficiais da Marinha do Brasil (CHM) · Horários em UTC-3
      </p>
    </div>
  );
}

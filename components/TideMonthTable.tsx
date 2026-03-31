'use client';

import { useState } from 'react';
import { TideDay, TideEvent } from '@/lib/tideUtils';

interface TideMonthTableProps {
  eventos: TideDay[];
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getWeekday(year: number, month: number, day: number): string {
  return WEEKDAYS[new Date(year, month, day).getDay()];
}

export default function TideMonthTable({ eventos }: TideMonthTableProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const todayStr = now.toISOString().split('T')[0];

  // Build lookup map: "2026-03-31" -> TideDay
  const lookup = new Map<string, TideDay>();
  for (const ev of eventos) {
    lookup.set(ev.data, ev);
  }

  const daysInMonth = getDaysInMonth(year, month);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function formatDay(d: number): string {
    return String(d).padStart(2, '0');
  }

  function getDateStr(d: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500">
        <button
          onClick={prevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          ‹
        </button>
        <h2 className="text-white font-bold text-lg tracking-wide">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          ›
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-semibold text-slate-600 w-20">Dia</th>
              <th className="text-center px-2 py-3 font-semibold text-blue-600">1ª Maré</th>
              <th className="text-center px-2 py-3 font-semibold text-blue-600">2ª Maré</th>
              <th className="text-center px-2 py-3 font-semibold text-blue-600">3ª Maré</th>
              <th className="text-center px-2 py-3 font-semibold text-blue-600">4ª Maré</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dateStr = getDateStr(day);
              const tideDay = lookup.get(dateStr);
              const weekday = getWeekday(year, month, day);
              const isToday = dateStr === todayStr;
              const mares = tideDay?.mares ?? [];

              // Sort by hora
              const sorted = [...mares].sort((a, b) => a.hora.localeCompare(b.hora));

              // Classify high/low
              const classified = sorted.map((event, idx, arr) => {
                const prev = arr[idx - 1];
                const next = arr[idx + 1];
                let tipo: 'high' | 'low';
                if (!prev && next) tipo = event.altura_m > next.altura_m ? 'high' : 'low';
                else if (prev && !next) tipo = event.altura_m > prev.altura_m ? 'high' : 'low';
                else if (prev && next) {
                  const isPeak = event.altura_m > prev.altura_m && event.altura_m > next.altura_m;
                  const isValley = event.altura_m < prev.altura_m && event.altura_m < next.altura_m;
                  tipo = isPeak ? 'high' : isValley ? 'low' : (event.altura_m > 1.0 ? 'high' : 'low');
                } else {
                  tipo = event.altura_m > 1.0 ? 'high' : 'low';
                }
                return { ...event, tipo };
              });

              // Fill up to 4 slots
              const slots: (typeof classified[0] | null)[] = [
                classified[0] ?? null,
                classified[1] ?? null,
                classified[2] ?? null,
                classified[3] ?? null,
              ];

              return (
                <tr
                  key={day}
                  className={`border-b border-slate-100 transition-colors hover:bg-blue-50/40 ${
                    isToday ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  {/* Day cell */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${isToday ? 'text-blue-600' : 'text-slate-800'}`}>
                        {formatDay(day)}
                      </span>
                      <span className={`text-xs font-medium ${
                        weekday === 'Dom' ? 'text-red-500' :
                        weekday === 'Sáb' ? 'text-orange-500' :
                        'text-slate-400'
                      }`}>
                        {weekday}
                      </span>
                    </div>
                  </td>

                  {/* Tide slots */}
                  {slots.map((slot, idx) => (
                    <td key={idx} className="px-2 py-3 text-center">
                      {slot ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-semibold text-slate-700 text-sm">{slot.hora}</span>
                          <div className="flex items-center gap-0.5">
                            <span className={`text-xs ${slot.tipo === 'high' ? 'text-blue-500' : 'text-orange-400'}`}>
                              {slot.tipo === 'high' ? '▲' : '▼'}
                            </span>
                            <span className={`text-xs font-medium ${slot.tipo === 'high' ? 'text-blue-600' : 'text-orange-500'}`}>
                              {slot.altura_m.toFixed(1)} m
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="text-blue-500 font-bold">▲</span>
          <span>Maré alta (preia-mar)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-orange-400 font-bold">▼</span>
          <span>Maré baixa (baixa-mar)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-100 border-l-2 border-blue-500 inline-block"></span>
          <span>Hoje</span>
        </div>
      </div>
    </div>
  );
}

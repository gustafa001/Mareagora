import type { DayForecastSummary } from '@/lib/portOperations';
import { statusMeta } from '@/lib/portOperations';
import OpsCard from './OpsCard';

interface ForecastCardProps {
  days: DayForecastSummary[];
}

export default function ForecastCard({ days }: ForecastCardProps) {
  return (
    <OpsCard title="Próximos Dias" icon="📅">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {days.map((day) => {
          const meta = statusMeta(day.status);
          return (
            <div key={day.date} className="rounded-xl bg-white/5 border border-white/5 p-3.5 flex flex-col gap-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-300 font-syne">{day.label}</p>
              <div className="flex items-center gap-1 text-[11px]">
                <span style={{ color: meta.color }}>{meta.icon}</span>
                <span className="text-slate-400">{meta.label}</span>
              </div>
              <div className="text-xs text-slate-400 space-y-0.5">
                <p>Maior maré: <span className="text-cyan-300 font-bold">{day.maxTide != null ? `${day.maxTide.toFixed(1)}m` : '--'}</span></p>
                <p>Menor maré: <span className="text-orange-300 font-bold">{day.minTide != null ? `${day.minTide.toFixed(1)}m` : '--'}</span></p>
                <p>Janela: <span className="text-slate-200 font-bold">{day.bestWindowLabel ?? '--'}</span></p>
              </div>
              <div className="mt-1">
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${day.operationalIndex}%`, background: meta.color }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Índice {day.operationalIndex}</p>
              </div>
            </div>
          );
        })}
      </div>
    </OpsCard>
  );
}

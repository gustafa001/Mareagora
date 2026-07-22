'use client';

import type { OperationalWindowSummary } from '@/lib/portOperations';
import { statusMeta } from '@/lib/portOperations';
import OpsCard from './OpsCard';

interface OperationalWindowCardProps {
  summary: OperationalWindowSummary;
}

export default function OperationalWindowCard({ summary }: OperationalWindowCardProps) {
  const meta = statusMeta(summary.currentStatus);

  return (
    <OpsCard title="Janela Operacional" icon="⛴️">
      <div className="flex flex-col gap-4">
        <div
          className="flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}55` }}
        >
          <span>{meta.icon}</span>
          {meta.label}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Melhor entrada</p>
            <p className="text-lg font-black font-syne text-white">{summary.bestEntryTime ?? '--:--'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Melhor saída</p>
            <p className="text-lg font-black font-syne text-white">{summary.bestExitTime ?? '--:--'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Duração da janela</p>
            <p className="text-sm font-bold text-slate-300">
              {summary.windowDurationMinutes != null ? `${Math.round(summary.windowDurationMinutes / 60 * 10) / 10}h` : '--'}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Tempo restante</p>
            <p className="text-sm font-bold text-slate-300">
              {summary.minutesRemainingInWindow != null ? `${summary.minutesRemainingInWindow} min` : '--'}
            </p>
          </div>
        </div>

        {summary.progressPercent != null && (
          <div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${summary.progressPercent}%`, background: meta.color }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">{summary.progressPercent}% da janela atual decorrida</p>
          </div>
        )}
      </div>
    </OpsCard>
  );
}

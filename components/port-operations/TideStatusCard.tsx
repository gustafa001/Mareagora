'use client';

import { useState, useEffect } from 'react';
import type { MareEvento } from '@/lib/mare';
import { getTideStatus, tideAtMinute, type TideEvent } from '@/lib/tideUtils';
import OpsCard from './OpsCard';
import TideChart from '@/components/TideChart';

interface TideStatusCardProps {
  todayTides: MareEvento[];
  onShowNextDays: () => void;
}

export default function TideStatusCard({ todayTides, onShowNextDays }: TideStatusCardProps) {
  const [mounted, setMounted] = useState(false);
  const [currentMinute, setCurrentMinute] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentMinute(now.getHours() * 60 + now.getMinutes());
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <OpsCard title="Situação da Maré" icon="🌊">
        <div className="h-[250px] bg-white/5 rounded-2xl animate-pulse" />
      </OpsCard>
    );
  }

  const hasTime = currentMinute !== null;
  const currentHeight = hasTime && todayTides.length ? tideAtMinute(currentMinute, todayTides as unknown as TideEvent[]) : null;
  const { rising } = hasTime && todayTides.length
    ? getTideStatus(currentMinute, todayTides as unknown as TideEvent[])
    : { rising: true };

  const nextHigh = hasTime
    ? (todayTides.find(t => t.tipo === 'high' && timeToMin(t.hora) > currentMinute) ?? todayTides.find(t => t.tipo === 'high'))
    : todayTides.find(t => t.tipo === 'high');
  const nextLow = hasTime
    ? (todayTides.find(t => t.tipo === 'low' && timeToMin(t.hora) > currentMinute) ?? todayTides.find(t => t.tipo === 'low'))
    : todayTides.find(t => t.tipo === 'low');

  return (
    <OpsCard title="Situação da Maré" icon="🌊" className="max-w-full overflow-hidden">
      <div className="grid sm:grid-cols-[minmax(0,1fr)_auto] gap-6 items-start">
        <div className="min-w-0">
          {todayTides.length > 0 ? (
            <TideChart tides={todayTides as unknown as TideEvent[]} />
          ) : (
            <p className="text-slate-400 text-sm break-words">Sem dados de maré para hoje.</p>
          )}
        </div>

        <div className="flex sm:flex-col gap-4 sm:gap-3 sm:w-44 flex-wrap min-w-0">
          <Metric label="Agora" value={currentHeight !== null ? `${currentHeight.toFixed(2)}m` : '--'} accent="text-cyan-300" />
          <Metric label="Tendência" value={rising ? '↑ Subindo' : '↓ Descendo'} accent={rising ? 'text-emerald-400' : 'text-orange-400'} />
          <Metric label="Próx. Alta" value={nextHigh ? `${nextHigh.hora} · ${nextHigh.altura_m.toFixed(2)}m` : '--'} accent="text-cyan-300" />
          <Metric label="Próx. Baixa" value={nextLow ? `${nextLow.hora} · ${nextLow.altura_m.toFixed(2)}m` : '--'} accent="text-orange-300" />
        </div>
      </div>

      <button
        onClick={onShowNextDays}
        className="mt-4 w-full sm:w-auto text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 text-blue-300 transition-all"
      >
        Ver próximos dias →
      </button>
    </OpsCard>
  );
}

function timeToMin(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex-1 min-w-[7rem] max-w-full break-words" suppressHydrationWarning>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold break-words">{label}</p>
      <p className={`text-base font-black font-syne break-words ${accent}`} suppressHydrationWarning>{value}</p>
    </div>
  );
}

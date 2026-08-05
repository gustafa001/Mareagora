'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { MareEvento } from '@/lib/mare';
import { getTideStatus, tideAtMinute, type TideEvent } from '@/lib/tideUtils';
import OpsCard from './OpsCard';

// Reaproveita o componente de gráfico já existente, sem qualquer alteração.
const TideChart = dynamic(() => import('@/components/TideChart'), { ssr: false });

interface TideStatusCardProps {
  todayTides: MareEvento[];
  onShowNextDays: () => void;
}

export default function TideStatusCard({ todayTides, onShowNextDays }: TideStatusCardProps) {
  // `currentMinute` só é calculado depois de montar no cliente (pós-hidratação).
  // Calcular `new Date()` direto no render fazia o horário do servidor (SSR)
  // divergir do horário do navegador na hidratação, quebrando "Agora",
  // "Tendência", "Próx. Alta/Baixa" e disparando os erros #418/#423/#425.
  const [currentMinute, setCurrentMinute] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentMinute(now.getHours() * 60 + now.getMinutes());
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

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
    <OpsCard title="Situação da Maré" icon="🌊">
      <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-start">
        <div>
          {todayTides.length > 0 ? (
            <TideChart tides={todayTides as unknown as TideEvent[]} />
          ) : (
            <p className="text-slate-400 text-sm">Sem dados de maré para hoje.</p>
          )}
        </div>

        <div className="flex sm:flex-col gap-4 sm:gap-3 sm:w-44 flex-wrap">
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
    <div className="flex-1 min-w-[7rem]">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</p>
      <p className={`text-base font-black font-syne ${accent}`}>{value}</p>
    </div>
  );
}

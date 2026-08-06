'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { MareDia } from '@/lib/mare';
import { getTideStatus, tideAtMinute, type TideEvent } from '@/lib/tideUtils';
import OpsCard from './port-operations/OpsCard';

import TideChart7Days from './TideChart7Days';

interface TideWeekCardProps {
  /** 7 dias de eventos de maré, começando por hoje */
  days: MareDia[];
}

export default function TideWeekCard({ days }: TideWeekCardProps) {
  const [mounted, setMounted] = useState(false);
  const todayTides = days[0]?.mares ?? [];
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
        <div className="h-[300px] bg-white/5 rounded-2xl animate-pulse" />
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
    <OpsCard title="Situação da Maré" icon="🌊">
      <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-start">
        <div>
          {days.length > 0 ? (
            <TideChart7Days days={days} />
          ) : (
            <p className="text-slate-400 text-sm">Sem dados de maré para os próximos dias.</p>
          )}
        </div>

        <div className="flex sm:flex-col gap-4 sm:gap-3 sm:w-44 flex-wrap">
          <Metric label="Agora" value={currentHeight !== null ? `${currentHeight.toFixed(2)}m` : '--'} accent="text-cyan-300" />
          <Metric label="Tendência" value={rising ? '↑ Subindo' : '↓ Descendo'} accent={rising ? 'text-emerald-400' : 'text-orange-400'} />
          <Metric label="Próx. Alta" value={nextHigh ? `${nextHigh.hora} · ${nextHigh.altura_m.toFixed(2)}m` : '--'} accent="text-cyan-300" />
          <Metric label="Próx. Baixa" value={nextLow ? `${nextLow.hora} · ${nextLow.altura_m.toFixed(2)}m` : '--'} accent="text-orange-300" />
        </div>
      </div>
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

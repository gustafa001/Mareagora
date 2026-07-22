'use client';

import type { ReactNode } from 'react';
import { Waves, Timer, Navigation, Activity } from 'lucide-react';
import type { SeaState } from '@/lib/portOperations';
import { classifySeaState } from '@/lib/portOperations';
import { degToCompass } from '@/lib/tideUtils';
import OpsCard from './OpsCard';

interface SeaConditionsCardProps {
  sea: SeaState;
  loading: boolean;
}

export default function SeaConditionsCard({ sea, loading }: SeaConditionsCardProps) {
  const state = classifySeaState(sea.waveHeight);

  if (loading) return <OpsCard title="Condições do Mar" icon="🌊"><SkeletonGrid /></OpsCard>;

  return (
    <OpsCard
      title="Condições do Mar"
      icon="🌊"
      action={
        <span
          className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: `${state.color}22`, color: state.color, border: `1px solid ${state.color}55` }}
        >
          {state.label}
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Metric icon={<Waves className="w-5 h-5 text-blue-400" />} label="Altura das ondas" value={sea.waveHeight != null ? `${sea.waveHeight.toFixed(1)}m` : '--'} />
        <Metric icon={<Timer className="w-5 h-5 text-cyan-400" />} label="Período" value={sea.wavePeriod != null ? `${sea.wavePeriod.toFixed(0)}s` : '--'} />
        <Metric icon={<Navigation className="w-5 h-5 text-indigo-400" />} label="Direção das ondas" value={sea.waveDirectionDeg != null ? degToCompass(sea.waveDirectionDeg) : '--'} />
        <Metric icon={<Activity className="w-5 h-5 text-teal-400" />} label="Corrente marítima" value={sea.currentSpeed != null ? `${sea.currentSpeed.toFixed(1)} nós` : '--'} />
      </div>
    </OpsCard>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none">{label}</p>
        <p className="text-sm font-black font-syne text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-9 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

import { classifyOperationalIndex } from '@/lib/portOperations';
import OpsCard from './OpsCard';

interface OperationalIndexGaugeProps {
  index: number;
}

/** Velocímetro SVG simples (semicírculo) — sem dependência externa de gráficos. */
export default function OperationalIndexGauge({ index }: OperationalIndexGaugeProps) {
  const clamped = Math.max(0, Math.min(100, index));
  const { label, color } = classifyOperationalIndex(clamped);

  const radius = 80;
  const circumference = Math.PI * radius; // semicírculo
  const offset = circumference * (1 - clamped / 100);

  return (
    <OpsCard title="Índice Operacional" icon="📊">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 110" className="w-full max-w-[220px]">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
          />
          <text x="100" y="88" textAnchor="middle" fontSize="34" fontWeight="900" fill="white" className="font-syne">
            {clamped}
          </text>
        </svg>
        <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color }}>{label}</p>

        <div className="grid grid-cols-5 gap-1 w-full mt-4 text-center text-[9px] font-bold uppercase tracking-wider text-slate-500">
          <span>Crítica<br/>0-29</span>
          <span>Ruim<br/>30-49</span>
          <span>Regular<br/>50-69</span>
          <span>Boa<br/>70-89</span>
          <span>Excel.<br/>90-100</span>
        </div>
      </div>
    </OpsCard>
  );
}

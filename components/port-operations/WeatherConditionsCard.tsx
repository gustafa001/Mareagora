'use client';

import type { ReactNode } from 'react';
import { Thermometer, Wind, CloudRain, Droplets, Gauge, Eye } from 'lucide-react';
import type { WeatherSnapshot } from '@/lib/portOperations';
import { degToCompass } from '@/lib/tideUtils';
import OpsCard from './OpsCard';

interface WeatherConditionsCardProps {
  weather: WeatherSnapshot;
  loading: boolean;
}

export default function WeatherConditionsCard({ weather, loading }: WeatherConditionsCardProps) {
  if (loading) return <OpsCard title="Condições Meteorológicas" icon="☁️"><SkeletonGrid /></OpsCard>;

  return (
    <OpsCard title="Condições Meteorológicas" icon="☁️">
      <div className="grid grid-cols-2 gap-4">
        <Metric icon={<Thermometer className="w-5 h-5 text-orange-400" />} label="Temperatura" value={weather.temperature != null ? `${Math.round(weather.temperature)}°C` : '--'} />
        <Metric icon={<Wind className="w-5 h-5 text-cyan-400" />} label="Vento" value={weather.windSpeed != null ? `${Math.round(weather.windSpeed)} km/h` : '--'} />
        <Metric icon={<Wind className="w-5 h-5 text-cyan-300 rotate-45" />} label="Direção" value={weather.windDirectionDeg != null ? degToCompass(weather.windDirectionDeg) : '--'} />
        <Metric icon={<CloudRain className="w-5 h-5 text-blue-400" />} label="Chuva" value={weather.precipitationProbability != null ? `${weather.precipitationProbability}%` : '--'} />
        <Metric icon={<Droplets className="w-5 h-5 text-sky-400" />} label="Umidade" value={weather.humidity != null ? `${weather.humidity}%` : '--'} />
        <Metric icon={<Gauge className="w-5 h-5 text-purple-400" />} label="Pressão" value={weather.pressure != null ? `${Math.round(weather.pressure)} hPa` : '--'} />
        <Metric icon={<Eye className="w-5 h-5 text-emerald-400" />} label="Visibilidade" value={weather.visibility != null ? `${weather.visibility.toFixed(1)} km` : '--'} />
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
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-9 rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

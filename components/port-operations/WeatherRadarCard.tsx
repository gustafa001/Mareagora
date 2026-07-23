'use client';

import OpsCard from './OpsCard';

interface WeatherRadarCardProps {
  lat: number;
  lon: number;
}

export default function WeatherRadarCard({ lat, lon }: WeatherRadarCardProps) {
  // URL do Windy Embed configurada para Radar de Chuva (overlay=radar)
  // zoom=8 para visão regional do porto
  const windyUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=8&level=surface&overlay=radar&product=radar&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

  return (
    <OpsCard title="Radar de Chuva (Tempo Real)" icon="📡">
      <div className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-inner">
        <iframe
          src={windyUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          className="grayscale-[20%] brightness-[90%] contrast-[110%]"
          title="Radar de Chuva em Tempo Real"
        />
        
        {/* Overlay sutil para indicar que é interativo */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] text-cyan-400 font-bold uppercase tracking-widest pointer-events-none border border-cyan-500/20">
          Live Radar
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-slate-500 font-medium">Dados via Windy.com</span>
        </div>
        <span className="text-slate-600 italic">Interaja com o mapa para zoom</span>
      </div>
    </OpsCard>
  );
}

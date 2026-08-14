'use client';

import { useT } from '@/lib/tideI18n';

interface WindRadarCardProps {
  lat: number;
  lon: number;
}

export default function WindRadarCard({ lat, lon }: WindRadarCardProps) {
  const { s } = useT();
  // URL do Windy Embed configurada para Vento (overlay=wind)
  const windyUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

  return (
    <div className="bg-[#0d1526] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative h-full flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <span className="text-xl">💨</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-none">{s.windRadarTitle}</h3>
            <p className="text-slate-500 text-xs mt-1 font-medium uppercase tracking-widest">{s.windRadarSubtitle}</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-tighter">
          KM/H
        </div>
      </div>
      
      <div className="flex-1 relative w-full min-h-[280px] rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-inner">
        <iframe
          src={windyUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          className="grayscale-[20%] brightness-[90%] contrast-[110%]"
          title={s.windRadarFrameTitle}
        />
        
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] text-cyan-400 font-bold uppercase tracking-widest pointer-events-none border border-cyan-500/20">
          Live Wind
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-slate-500 font-medium">{s.particleMap}</span>
        </div>
        <span className="text-slate-600 italic">{s.interactiveZoom}</span>
      </div>
    </div>
  );
}

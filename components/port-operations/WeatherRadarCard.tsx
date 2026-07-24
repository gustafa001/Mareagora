'use client';

import { useEffect, useRef, useState } from 'react';
import OpsCard from './OpsCard';

interface Props {
  lat: number;
  lon: number;
}

interface RainStatus {
  icon: string;
  label: string;
  detail: string;
  color: string;
  bgColor: string;
}

interface SeaTemp {
  temp: number | null;
  icon: string;
  label: string;
  color: string;
}

function getRainStatus(precipNext6h: number[], probNext6h: number[]): RainStatus {
  const maxPrecip = Math.max(...precipNext6h.map(v => v ?? 0));
  const maxProb = Math.max(...probNext6h.map(v => v ?? 0));

  if (maxPrecip >= 10 || maxProb >= 80) {
    return {
      icon: '⛈',
      label: 'Tempestade prevista nas próximas horas',
      detail: `Acumulado previsto: ~${maxPrecip.toFixed(0)}mm`,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/30',
    };
  }
  if (maxPrecip >= 3 || maxProb >= 50) {
    return {
      icon: '🌧',
      label: 'Pancadas isoladas próximas da costa',
      detail: `Probabilidade: ${maxProb.toFixed(0)}%`,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
    };
  }
  if (maxPrecip >= 0.5 || maxProb >= 25) {
    return {
      icon: '🌦',
      label: 'Chuva fraca possível',
      detail: `Probabilidade: ${maxProb.toFixed(0)}%`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 border-yellow-500/30',
    };
  }
  return {
    icon: '✅',
    label: 'Sem chuva prevista nas próximas 6h',
    detail: 'Condições favoráveis',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
  };
}

function getSeaTempStatus(temp: number | null): SeaTemp {
  if (temp === null) return { temp: null, icon: '🌊', label: 'Carregando...', color: 'text-slate-400' };
  if (temp < 15) return { temp, icon: '🥶', label: 'Muito fria — não recomendada para banho', color: 'text-blue-300' };
  if (temp < 18) return { temp, icon: '❄️', label: 'Fria — adequada para surfistas com roupa', color: 'text-cyan-400' };
  if (temp < 22) return { temp, icon: '🌊', label: 'Agradável para esportes aquáticos', color: 'text-sky-400' };
  if (temp < 26) return { temp, icon: '😊', label: 'Boa para banho', color: 'text-emerald-400' };
  return { temp, icon: '🔥', label: 'Quente — ótima para banho', color: 'text-orange-400' };
}

export default function WeatherRadarCard({ lat, lon }: Props) {
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const [rainStatus, setRainStatus] = useState<RainStatus | null>(null);
  const [seaTemp, setSeaTemp] = useState<SeaTemp>({ temp: null, icon: '🌊', label: 'Carregando...', color: 'text-slate-400' });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const windyUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=8&level=surface&overlay=radar&product=radar&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;

  // Fetch precipitation + SST
  useEffect(() => {
    const tz = 'auto';
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=precipitation,precipitation_probability&forecast_days=1&timezone=${tz}`;
    const marineUrl =
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
      `&hourly=sea_surface_temperature&forecast_days=1&timezone=${tz}`;

    Promise.all([
      fetch(weatherUrl).then(r => r.json()).catch(() => null),
      fetch(marineUrl).then(r => r.json()).catch(() => null),
    ]).then(([weatherData, marineData]) => {
      // Rain: next 6 hours from now
      const nowH = new Date().getHours();
      const precip: number[] = weatherData?.hourly?.precipitation?.slice(nowH, nowH + 6) ?? [];
      const prob: number[] = weatherData?.hourly?.precipitation_probability?.slice(nowH, nowH + 6) ?? [];
      setRainStatus(getRainStatus(precip, prob));

      // SST: current hour
      const sst: number | null = marineData?.hourly?.sea_surface_temperature?.[nowH] ?? null;
      setSeaTemp(getSeaTempStatus(sst));
    });
  }, [lat, lon]);

  // Fullscreen handler
  const handleFullscreen = () => {
    const el = iframeContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <OpsCard
      title="Radar de Chuva (Tempo Real)"
      icon="📡"
      action={
        <button
          onClick={handleFullscreen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-all"
          title="Abrir radar em tela cheia"
        >
          <span>{isFullscreen ? '✖ Fechar' : '⛶ Tela cheia'}</span>
        </button>
      }
    >
      {/* ── 1. Resumo de chuva ── */}
      {rainStatus ? (
        <div className={`mb-4 flex items-start gap-3 px-4 py-3 rounded-2xl border ${rainStatus.bgColor}`}>
          <span className="text-2xl leading-none mt-0.5">{rainStatus.icon}</span>
          <div>
            <p className={`text-sm font-bold ${rainStatus.color}`}>{rainStatus.label}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{rainStatus.detail}</p>
          </div>
        </div>
      ) : (
        <div className="mb-4 h-16 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />
      )}

      {/* ── 2. Radar com botão de tela cheia ── */}
      <div
        ref={iframeContainerRef}
        className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-inner"
      >
        <iframe
          src={windyUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          className="grayscale-[20%] brightness-[90%] contrast-[110%]"
          title="Radar de Chuva em Tempo Real"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] text-cyan-400 font-bold uppercase tracking-widest pointer-events-none border border-cyan-500/20">
          Live Radar
        </div>
        {/* Botão mobile de tela cheia (dentro do radar) */}
        <button
          onClick={handleFullscreen}
          className="absolute bottom-3 right-3 md:hidden px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[11px] font-bold text-white border border-white/20 flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <span>⛶</span>
          <span>Ampliar</span>
        </button>
      </div>

      {/* ── 3. Temperatura da água ── */}
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{seaTemp.icon}</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Temperatura da Água</p>
            <p className={`text-sm font-bold mt-0.5 ${seaTemp.color}`}>
              {seaTemp.temp !== null ? `${seaTemp.temp.toFixed(1)}°C — ${seaTemp.label}` : seaTemp.label}
            </p>
          </div>
        </div>
        {seaTemp.temp !== null && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border"
            style={{
              background: `hsl(${Math.max(0, Math.min(240, 240 - (seaTemp.temp - 10) * 10))}, 70%, 20%)`,
              borderColor: `hsl(${Math.max(0, Math.min(240, 240 - (seaTemp.temp - 10) * 10))}, 70%, 40%)`,
              color: `hsl(${Math.max(0, Math.min(240, 240 - (seaTemp.temp - 10) * 10))}, 90%, 75%)`,
            }}
          >
            {seaTemp.temp.toFixed(0)}°
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-slate-500 font-medium">Radar via Windy.com • SST via Open-Meteo</span>
        </div>
      </div>
    </OpsCard>
  );
}

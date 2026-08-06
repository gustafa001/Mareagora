'use client';

import { useEffect, useRef, useState } from 'react';
import OpsCard from './port-operations/OpsCard';

interface Props {
  /** Latitude do centro do mapa (padrão: litoral do Brasil) */
  lat?: number;
  /** Longitude do centro do mapa */
  lon?: number;
  /** Nível de zoom inicial do mapa (3 = país inteiro, 7 = cidade/região) */
  zoom?: number;
  /** Altura do card em pixels */
  height?: number;
}

/**
 * Mapa de raios em tempo real via Blitzortung.org (rede colaborativa gratuita).
 * Dados reais — não é simulação. O mapa é embutido via iframe oficial deles,
 * então não depende de backend próprio nem de chave de API.
 *
 * Fonte: https://map.blitzortung.org — uso livre para embed, ver
 * https://www.lightningmaps.org/doc/integration
 */
export default function LightningMapCard({
  lat = -14.5,
  lon = -50,
  zoom = 4,
  height = 420,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const src =
    `https://map.blitzortung.org/index.php` +
    `?interactive=1` +
    `&NavigationControl=1` +
    `&FullScreenControl=0` +
    `&Cookies=0` +
    `&InfoDiv=0` +
    `&MenuButtonDiv=0` +
    `&ScaleControl=0` +
    // Camada de raios propriamente dita — sem isso o mapa fica "vazio"
    `&LightningCheckboxChecked=1` +
    `&LightningRangeValue=8` +
    // Círculos concêntricos ao redor de cada raio — gera o efeito de
    // "mancha"/heatmap quando há vários raios próximos, como na TV
    `&CirclesCheckboxChecked=1` +
    `&CirclesRangeValue=6` +
    // Contador de raios por região
    `&CountingCheckboxChecked=1` +
    `&CountingRangeValue=5` +
    `&MapStyle=2` +
    `&MapStyleRangeValue=10` +
    `&Advertisment=0` +
    `#${zoom}/${lat}/${lon}`;

  const handleFullscreen = () => {
    const el = containerRef.current;
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
      title="Raios em Tempo Real"
      icon="⚡"
      action={
        <button
          onClick={handleFullscreen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-amber-400 transition-all"
          title="Abrir mapa em tela cheia"
        >
          <span>{isFullscreen ? '✖ Fechar' : '⛶ Tela cheia'}</span>
        </button>
      }
    >
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-inner"
        style={{ height }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl animate-pulse">⚡</span>
              <span className="text-[11px] text-slate-500 font-medium">Carregando raios ao vivo...</span>
            </div>
          </div>
        )}
        <iframe
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Mapa de Raios em Tempo Real — Blitzortung.org"
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] text-amber-400 font-bold uppercase tracking-widest pointer-events-none border border-amber-500/20">
          Live
        </div>
        <button
          onClick={handleFullscreen}
          className="absolute bottom-3 right-3 md:hidden px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[11px] font-bold text-white border border-white/20 flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <span>⛶</span>
          <span>Ampliar</span>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-slate-500 font-medium">
            Dados reais via{' '}
            <a
              href="https://www.blitzortung.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-400"
            >
              Blitzortung.org
            </a>{' '}
            • rede colaborativa gratuita
          </span>
        </div>
      </div>
    </OpsCard>
  );
}

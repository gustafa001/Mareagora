import Link from 'next/link';
import { getLiveCameras, type LiveCamera } from '@/lib/live-cameras';

/**
 * Vitrine de câmeras ao vivo na home. Server Component, sem iframe:
 * só miniaturas (carregamento lazy) que levam para /cameras, então não pesa
 * no LCP nem no JS da página. Até 3 câmeras do Brasil, de cidades diferentes.
 */
function pickCameras(max: number): LiveCamera[] {
  const seen = new Set<string>();
  const picked: LiveCamera[] = [];
  for (const cam of getLiveCameras()) {
    if (!cam.videoId || cam.href) continue; // só Brasil, só vídeos com ID fixo
    if (seen.has(cam.cityName)) continue;
    seen.add(cam.cityName);
    picked.push(cam);
    if (picked.length === max) break;
  }
  return picked;
}

export default function LiveCamerasStrip() {
  const cameras = pickCameras(3);
  if (cameras.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto px-6 pb-12" aria-labelledby="home-cameras-title">
      <div className="flex items-baseline justify-between mb-4">
        <h2 id="home-cameras-title" className="font-syne text-xl font-bold text-white">
          Praias ao vivo
        </h2>
        <Link href="/cameras" className="text-xs font-semibold uppercase tracking-widest text-cyan-300 hover:text-cyan-200">
          Ver todas →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cameras.map((cam) => (
          <Link
            key={cam.id}
            href="/cameras"
            className="group block overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-900/60 hover:border-cyan-400/60 transition-colors"
          >
            <div className="relative aspect-video bg-slate-800">
              <img
                src={`https://i.ytimg.com/vi/${cam.videoId}/hqdefault.jpg`}
                alt={`Câmera ao vivo: ${cam.title}`}
                width={480}
                height={360}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                ● Ao vivo
              </span>
            </div>
            <p className="px-3 py-3 text-sm font-medium text-white">{cam.cityName}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

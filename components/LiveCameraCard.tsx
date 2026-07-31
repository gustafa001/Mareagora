import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LiveCamera } from '@/lib/live-cameras';
import { getStateSlug } from '@/lib/states';

export default function LiveCameraCard({ camera }: { camera: LiveCamera }) {
  // Câmeras com channelId usam o embed "live_stream", que sempre aponta pra
  // transmissão ativa do canal no momento — não quebra se o dono da câmera
  // reiniciar a live (o que troca o videoId). Preferimos isso quando disponível;
  // videoId fixo fica como alternativa pra canais que não têm live constante.
  const embedUrl = camera.channelId
    ? `https://www.youtube.com/embed/live_stream?channel=${camera.channelId}&autoplay=0&mute=1`
    : `https://www.youtube.com/embed/${camera.videoId}?autoplay=0&mute=1`;
  const mareHref = `/mare/${getStateSlug(camera.state)}/${camera.portSlug}`;

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={embedUrl}
          title={`Câmera ao vivo - ${camera.title}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <h3 className="mt-3 text-lg font-bold font-syne text-slate-800">{camera.title}</h3>

      {camera.description && (
        <p className="mt-1 text-sm text-slate-600">{camera.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <a
          href={camera.sourceUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="underline"
        >
          Fonte: {camera.sourceName}
        </a>
        <Link
          href={mareHref}
          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
        >
          Ver maré de {camera.cityName}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

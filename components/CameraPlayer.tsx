'use client';

import { useState } from 'react';
import { LiveCamera } from '@/lib/cameras-data';

interface CameraPlayerProps {
  camera: LiveCamera;
}

export default function CameraPlayer({ camera }: CameraPlayerProps) {
  const [hasError, setHasError] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${camera.videoId}?autoplay=0&mute=1`;

  if (hasError) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg bg-slate-100 p-6 text-center">
        <p className="text-sm text-slate-600">
          Esta câmera está temporariamente indisponível.
        </p>
        {camera.sourceUrl && (
          <a
            href={camera.sourceUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-2 text-sm text-blue-600 underline"
          >
            Ver no site original
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={embedUrl}
          title={`Câmera ao vivo - ${camera.title}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{camera.description}</span>
        {camera.sourceUrl ? (
          <a
            href={camera.sourceUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="underline"
          >
            Fonte: {camera.sourceName}
          </a>
        ) : (
          <span>Fonte: {camera.sourceName}</span>
        )}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: `Câmera ao vivo - ${camera.title}`,
            description: camera.description,
            thumbnailUrl: `https://mareagora.com.br/icon-512x512.png`,
            uploadDate: '2026-01-01',
            embedUrl: embedUrl,
            publisher: {
              '@type': 'Organization',
              name: camera.sourceName,
              url: camera.sourceUrl || 'https://mareagora.com.br'
            }
          })
        }}
        suppressHydrationWarning
      />
    </div>
  );
}

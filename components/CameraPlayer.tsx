'use client';

import { useState } from 'react';
import { BeachCamera } from '@/lib/cameras-data';

interface CameraPlayerProps {
  camera: BeachCamera;
}

export default function CameraPlayer({ camera }: CameraPlayerProps) {
  const [hasError, setHasError] = useState(false);

  const embedUrl =
    camera.source === 'youtube'
      ? `https://www.youtube.com/embed/${camera.embedId}?autoplay=0&mute=1`
      : `https://player.twitch.tv/?channel=${camera.embedId}&parent=mareagora.com.br&autoplay=false`;

  if (hasError || camera.status === 'inactive') {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg bg-slate-100 p-6 text-center">
        <p className="text-sm text-slate-600">
          Esta câmera está temporariamente indisponível.
        </p>
        {camera.creditUrl && (
          <a
            href={camera.creditUrl}
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
          title={`Câmera ao vivo - ${camera.name}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{camera.description}</span>
        {camera.creditUrl ? (
          <a
            href={camera.creditUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="underline"
          >
            Fonte: {camera.credit}
          </a>
        ) : (
          <span>Fonte: {camera.credit}</span>
        )}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: `Câmera ao vivo - ${camera.name}`,
            description: camera.description,
            thumbnailUrl: `https://mareagora.com.br/icon-512x512.png`,
            uploadDate: new Date().toISOString(),
            embedUrl: embedUrl,
            publisher: {
              '@type': 'Organization',
              name: camera.credit,
              url: camera.creditUrl || 'https://mareagora.com.br'
            }
          })
        }}
        suppressHydrationWarning
      />
    </div>
  );
}

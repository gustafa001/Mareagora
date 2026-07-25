import React from 'react';

interface LiveCameraEmbedProps {
  title: string;
  sourceName: string;
  sourceUrl: string;
  videoId?: string;
  channelId?: string;
}

export default function LiveCameraEmbed({ title, sourceName, sourceUrl, videoId, channelId }: LiveCameraEmbedProps) {
  let embedUrl = '';
  if (channelId) {
    embedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1`;
  } else if (videoId) {
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
  } else {
    return null;
  }

  return (
    <div className="classic-card flex flex-col gap-3">
      <h3 className="text-xl font-bold font-syne text-slate-800">{title}</h3>
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-900" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          title={title}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="text-sm text-slate-500 text-right">
        Câmera: <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{sourceName}</a>
      </div>
    </div>
  );
}

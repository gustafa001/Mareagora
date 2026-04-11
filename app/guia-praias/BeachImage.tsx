'use client'

interface BeachImageProps {
  query: string
  alt: string
}

export default function BeachImage({ query, alt }: BeachImageProps) {
  return (
    <img
      src={`https://loremflickr.com/600/340/${encodeURIComponent(query.replace(/ /g, ','))}`}
      alt={alt}
      loading="lazy"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      onError={(e) => {
        const t = e.target as HTMLImageElement
        t.src = 'https://loremflickr.com/600/340/beach,brazil,ocean'
      }}
    />
  )
}

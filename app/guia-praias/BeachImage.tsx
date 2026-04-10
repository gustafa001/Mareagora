'use client'

interface BeachImageProps {
  query: string
  alt: string
}

export default function BeachImage({ query, alt }: BeachImageProps) {
  return (
    <img
      src={`https://source.unsplash.com/600x340/?${encodeURIComponent(query)}`}
      alt={alt}
      loading="lazy"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      onError={(e) => {
        const t = e.target as HTMLImageElement
        t.src = 'https://source.unsplash.com/600x340/?beach,brazil,ocean'
      }}
    />
  )
}

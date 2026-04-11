'use client'

interface BeachImageProps {
  query: string
  alt: string
  random?: string | number
}

export default function BeachImage({ query, alt, random }: BeachImageProps) {
  // Adicionando um parâmetro de randomização para o LoremFlickr (lock)
  // O parâmetro 'random' no final da URL ajuda a garantir que imagens diferentes sejam retornadas
  const seed = random ? `&random=${random}` : ''
  // Gerar um lock determinístico baseado no 'random' (slug) para que a imagem seja consistente mas única por praia
  const lockValue = typeof random === 'string' 
    ? random.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) 
    : (Number(random) || Math.floor(Math.random() * 1000))

  const dynamicUrl = `https://loremflickr.com/600/340/${encodeURIComponent(query.replace(/ /g, ','))}?lock=${lockValue}${seed}`

  return (
    <div style={{ width: '100%', height: '100%', background: '#0a1e35' }}>
      <img
        src={dynamicUrl}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={(e) => {
          const t = e.target as HTMLImageElement
          t.src = `https://loremflickr.com/600/340/beach,ocean?lock=${random || 99}`
        }}
      />
    </div>
  )
}

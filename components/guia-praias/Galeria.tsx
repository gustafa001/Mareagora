import Image from 'next/image'
import ConditionalSection from './ConditionalSection'

export interface FotoGaleria {
  url: string
  alt: string
}

/**
 * Nenhuma praia tem fotos reais cadastradas hoje (o campo `unsplashQuery`
 * existente em app/guia-praias/page.tsx é só uma busca textual, nunca foi
 * ligado a um provedor de imagens — por isso não usamos aqui, para não
 * exibir fotos que não são realmente daquela praia). Quando houver fotos
 * reais, popular `galeria` na praia correspondente ativa este bloco.
 */
export default function Galeria({ fotos, nome }: { fotos?: FotoGaleria[]; nome: string }) {
  return (
    <ConditionalSection data={fotos}>
      <section className="pp-section" aria-labelledby="galeria-heading">
        <h2 className="pp-section-title" id="galeria-heading">
          Galeria
        </h2>
        <div className="pp-galeria-grid">
          {fotos?.map((foto) => (
            <div key={foto.url} className="pp-galeria-item">
              <Image
                src={foto.url}
                alt={foto.alt || `Foto de ${nome}`}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </section>
    </ConditionalSection>
  )
}

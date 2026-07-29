import Link from 'next/link'
import ConditionalSection from './ConditionalSection'

export interface LugarProximo {
  tipo: 'mirante' | 'parque' | 'marina' | 'molhe' | 'pier' | 'farol' | 'outro'
  nome: string
  slug?: string
  url?: string
}

const TIPO_ICON: Record<LugarProximo['tipo'], string> = {
  mirante: '🔭',
  parque: '🌳',
  marina: '⚓',
  molhe: '🌊',
  pier: '🎣',
  farol: '🗼',
  outro: '📍',
}

export default function LugaresProximos({ lugares }: { lugares?: LugarProximo[] }) {
  return (
    <ConditionalSection data={lugares}>
      <section className="pp-section" aria-labelledby="lugares-proximos-heading">
        <h2 className="pp-section-title" id="lugares-proximos-heading">
          Lugares próximos
        </h2>
        <ul className="pp-nearby-list">
          {lugares?.map((lugar) => {
            const href = lugar.slug ? `/guia-praias/${lugar.slug}` : lugar.url
            const content = (
              <>
                <span aria-hidden="true">{TIPO_ICON[lugar.tipo]}</span> {lugar.nome}
              </>
            )
            return (
              <li key={lugar.nome}>
                {href ? (
                  <Link href={href} className="pp-affiliate-link">
                    {content}
                  </Link>
                ) : (
                  <span className="pp-affiliate-link">{content}</span>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </ConditionalSection>
  )
}

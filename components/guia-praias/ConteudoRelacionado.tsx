import Link from 'next/link'
import { getStateName, getStateSlug } from '@/lib/states'

export default function ConteudoRelacionado({
  nome,
  uf,
  portoSlug,
}: {
  nome: string
  uf: string
  portoSlug: string
}) {
  const stateSlug = getStateSlug(uf)
  const stateName = getStateName(uf)

  return (
    <section className="pp-section" aria-labelledby="relacionados-heading">
      <h2 className="pp-section-title" id="relacionados-heading">
        Conteúdo relacionado
      </h2>
      <ul className="pp-related-list">
        <li>
          <Link href={`/mare/${stateSlug}/${portoSlug}`} className="pp-affiliate-link">
            📊 Tábua de marés completa de {nome}
          </Link>
        </li>
        <li>
          <Link href={`/estados/${stateSlug}`} className="pp-affiliate-link">
            🗺️ Todas as praias e portos de {stateName}
          </Link>
        </li>
        <li>
          <Link href="/guia-praias" className="pp-affiliate-link">
            🏖️ Voltar ao Guia de Praias
          </Link>
        </li>
        <li>
          <Link href="/pesca" className="pp-affiliate-link">
            🎣 Guia de pesca
          </Link>
        </li>
      </ul>
    </section>
  )
}

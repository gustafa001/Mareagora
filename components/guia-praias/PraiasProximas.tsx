import Link from 'next/link'
import ConditionalSection from './ConditionalSection'
import type { PraiaProxima } from '@/lib/guia-praias/getPraiasProximas'

export default function PraiasProximas({ praias }: { praias: PraiaProxima[] }) {
  return (
    <ConditionalSection data={praias}>
      <section className="pp-section" aria-labelledby="praias-proximas-heading">
        <h2 className="pp-section-title" id="praias-proximas-heading">
          Praias próximas
        </h2>
        <ul className="pp-nearby-list">
          {praias.map((p) => (
            <li key={p.slug}>
              <Link href={`/guia-praias/${p.slug}`} className="pp-other-link">
                <span>{p.nome}</span>
                <span className="pp-other-uf">
                  {p.uf} · {p.distanciaKm} km
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </ConditionalSection>
  )
}

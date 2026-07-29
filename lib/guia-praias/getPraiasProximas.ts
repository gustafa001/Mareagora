import { getPortosProximos } from '@/lib/ports'

export interface PraiaComSlug {
  slug: string
  nome: string
  uf: string
  porto: { slug: string }
}

export interface PraiaProxima {
  slug: string
  nome: string
  uf: string
  distanciaKm: number
}

/**
 * Reaproveita getPortosProximos() (lib/ports.ts), que já calcula distância real
 * via haversine entre as coordenadas oficiais dos pontos de maré. Filtra o
 * resultado para manter somente portos que também têm uma página de Guia de
 * Praia (evita linkar para portos comerciais sem guia).
 */
export function getPraiasProximas(
  praiaAtual: PraiaComSlug,
  todasPraias: PraiaComSlug[],
  limit = 6
): PraiaProxima[] {
  const slugsComGuia = new Set(
    todasPraias.filter((p) => p.slug !== praiaAtual.slug).map((p) => p.porto.slug)
  )

  const proximos = getPortosProximos(praiaAtual.porto.slug, 30) // pega mais candidatos p/ depois filtrar

  const comGuia = proximos.filter((p) => slugsComGuia.has(p.slug))

  return comGuia.slice(0, limit).map((p) => {
    const praia = todasPraias.find((tp) => tp.porto.slug === p.slug)!
    return {
      slug: praia.slug,
      nome: praia.nome,
      uf: praia.uf,
      distanciaKm: p.distanciaKm,
    }
  })
}

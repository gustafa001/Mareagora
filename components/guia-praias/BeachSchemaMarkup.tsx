import type { Port } from '@/lib/ports'
import { getStateName } from '@/lib/states'

interface BeachSchemaMarkupProps {
  nome: string
  descricao: string
  url: string
  port: Port
  faq?: { pergunta: string; resposta: string }[]
}

/**
 * O componente components/seo/SchemaGenerator.tsx existente gera um
 * BreadcrumbList fixo para a hierarquia /mare/[estado]/[slug] (Tábua de
 * Marés), que não é a hierarquia desta página. Em vez de reaproveitá-lo
 * (o que produziria um breadcrumb tecnicamente incorreto), este componente
 * gera o BreadcrumbList, TouristDestination e FAQPage corretos para
 * /guia-praias/[slug], seguindo o mesmo padrão de schema.org já usado
 * no restante do site.
 */
export default function BeachSchemaMarkup({ nome, descricao, url, port, faq }: BeachSchemaMarkupProps) {
  const base = 'https://mareagora.com.br'
  const schemas: Record<string, unknown>[] = []

  schemas.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: base },
      { '@type': 'ListItem', position: 2, name: 'Guia de Praias', item: `${base}/guia-praias` },
      { '@type': 'ListItem', position: 3, name: nome, item: url },
    ],
  })

  schemas.push({
    '@type': 'TouristDestination',
    '@id': `${url}#place`,
    name: nome,
    description: descricao,
    url,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: port.lat,
      longitude: port.lon,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: port.cityName || port.name,
      addressRegion: getStateName(port.state),
      addressCountry: 'BR',
    },
  })

  if (faq && faq.length > 0) {
    schemas.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: item.resposta },
      })),
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas }),
      }}
      suppressHydrationWarning
    />
  )
}

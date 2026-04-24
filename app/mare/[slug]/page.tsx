import { notFound } from 'next/navigation';
import { getPortBySlug, getAllSlugs } from '@/lib/ports';
import type { Metadata } from 'next';
import PortPageContent from '@/components/PortPageContent';
import PortoFAQ from '@/components/PortoFAQ';
import { portosConfig, categoryDefaults } from '@/data/porto-seo-config';
import { getPostsByPort } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';
import { getPortoDescription } from '@/lib/porto-descriptions';

function getRegionContext(region: string, state: string): string {
  const map: Record<string, string> = {
    norte: `O litoral da região Norte, que abrange estados como ${state}, é marcado por uma das maiores amplitudes de maré do Brasil. As marés amazônicas são influenciadas diretamente pela morfologia dos estuários e pela descarga dos grandes rios, podendo variar vários metros entre a preamar e a baixamar. Esse comportamento extremo exige atenção redobrada de pescadores, navegadores e moradores ribeirinhos.`,
    nordeste: `O litoral do Nordeste brasileiro, onde ${state} está inserido, apresenta características únicas de maré devido à posição geográfica próxima à linha do Equador. As variações de maré são moderadas, com influência direta dos ventos alísios e das correntes do Atlântico Sul. A região é famosa por praias de águas mornas, recifes de coral e condições favoráveis para mergulho e kitesurf em determinados períodos do ano.`,
    sudeste: `O litoral do Sudeste, região onde ${state} se localiza, é um dos mais movimentados do Brasil — tanto em termos de tráfego marítimo quanto em atividades recreativas. As marés dessa região são do tipo semidiurno, com dois ciclos completos de preamar e baixamar a cada 24 horas. A variação costuma ser moderada, mas pode ser amplificada em baías e enseadas fechadas, como ocorre em Angra dos Reis e na Baía de Guanabara.`,
    sul: `O litoral Sul do Brasil, onde ${state} está situado, possui marés com características bem definidas e influência marcante dos sistemas de frentes frias vindas do sul do continente. As ondas de tempestade (ressacas) são frequentes no inverno e podem elevar temporariamente o nível do mar acima do previsto na tábua oficial. Surfe, pesca embarcada e navegação costeira são atividades muito praticadas na região.`,
  };
  return map[region] ?? `O litoral de ${state} apresenta condições de maré características da costa brasileira, com variações influenciadas pela posição geográfica e pela morfologia costeira local.`;
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const port = getPortBySlug(params.slug);
  if (!port) return { title: 'Porto não encontrado' };

  const slug = params.slug;
  const config = portosConfig[slug];
  const ano = new Date().getFullYear();
  const url = `https://mareagora.com.br/mare/${slug}`;
  const ogImage = `https://mareagora.com.br/mare/${slug}/opengraph-image`;

  const seoName = port.cityName;

  const isCommercial = port.name.toLowerCase().includes('porto') || port.name.toLowerCase().includes('terminal') || config?.category === 'industrial';

  let defaultSuffix = isCommercial 
    ? 'Horários e Coeficientes Oficiais' 
    : 'Surf, Pesca e Praia';
  
  let defaultDesc = isCommercial
    ? `Tábua de marés de ${seoName}, ${port.state} para ${ano}. Previsão de maré alta e baixa, horários e coeficientes oficiais com dados da Marinha do Brasil (CHM).`
    : `Tábua de marés de ${seoName}, ${port.state} para ${ano}. Horários de maré alta e baixa para surf, pesca e atividades na praia. Fonte: Marinha do Brasil.`;

  // Use the default dynamic suffix directly, unless specifically overridden
  const suffix = config?.titleSuffix ?? defaultSuffix;
  
  // Actually, the user instruction says: 
  // Para páginas de portos COMERCIAIS: título deve ser "Tábua de Maré [Porto] — Horários e Coeficientes Oficiais"
  // Para páginas de PRAIAS: manter "Tábua de Maré [Praia] — Surf, Pesca e Praia"
  // So let's override it directly if it's not explicitly matching to avoid issues where config has wrong title.
  // We'll let config override, but the fallback handles all ports/beaches correctly now.
  const title = `Tábua de Maré ${seoName} — ${isCommercial && !config ? 'Horários e Coeficientes Oficiais' : (!isCommercial && !config ? 'Surf, Pesca e Praia' : suffix)} | MaréAgora`;

  const description = config?.description ?? defaultDesc;

  const keywords = config?.keywords
    ?? [
      `maré ${seoName.toLowerCase()}`,
      `tabua maré ${seoName.toLowerCase()} ${ano}`,
      `tábua de maré ${seoName.toLowerCase()}`,
    ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'MaréAgora',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Tábua de Maré ${seoName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PortPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const port = getPortBySlug(slug);
  if (!port) notFound();

  const regionContext = getRegionContext(port.region, port.state);
  const portDescription = getPortoDescription(slug);
  const ano = new Date().getFullYear();

  const config = portosConfig[slug];
  const categoria = config?.category ?? 'turismo';

  const blogPosts: BlogPost[] = getPostsByPort(slug);

  const seoName = port.cityName;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://mareagora.com.br/' },
          { '@type': 'ListItem', position: 2, name: 'Portos', item: 'https://mareagora.com.br/portos' },
          { '@type': 'ListItem', position: 3, name: port.name, item: `https://mareagora.com.br/mare/${slug}` },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `https://mareagora.com.br/mare/${slug}`,
        url: `https://mareagora.com.br/mare/${slug}`,
        name: `Tábua de Maré ${seoName} ${ano} — MaréAgora`,
        description: `Horários e alturas das marés em ${seoName} (${port.state}) para ${ano}.`,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': 'https://mareagora.com.br/' },
      },
      {
        '@type': 'Dataset',
        name: `Tábua de Marés ${seoName} ${ano}`,
        description: `Horários de maré alta e baixa em ${seoName}, ${port.state} para o ano de ${ano}. Fonte oficial: Marinha do Brasil (CHM).`,
        url: `https://mareagora.com.br/mare/${slug}`,
        creator: {
          '@type': 'Organization',
          name: 'MaréAgora',
          url: 'https://mareagora.com.br',
        },
        temporalCoverage: `${ano}-01-01/${ano}-12-31`,
        spatialCoverage: `${seoName}, ${port.state}, Brasil`,
        license: 'https://www.gov.br/marinha/pt-br',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      <PortPageContent
        slug={slug}
        regionContext={regionContext}
        portDescription={portDescription}
        blogPosts={blogPosts}
      />
      <div className="container pb-16">
        <PortoFAQ slug={slug} categoria={categoria} />
      </div>
    </>
  );
}

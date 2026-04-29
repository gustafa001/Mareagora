import { notFound } from 'next/navigation';
import { getPortBySlug, getAllSlugs } from '@/lib/ports';
import type { Metadata } from 'next';
import PortPageContent from '@/components/PortPageContent';
import PortoFAQ from '@/components/PortoFAQ';
import PortosProximos from '@/components/PortosProximos';
import { portosConfig, categoryDefaults } from '@/data/porto-seo-config';
import { getPostsByPort } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';
import { getPortoDescription } from '@/lib/porto-descriptions';

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
        portDescription={portDescription}
        blogPosts={blogPosts}
      />
      <div className="container pb-16">
        <PortoFAQ slug={slug} categoria={categoria} />
        <PortosProximos slug={slug} />
      </div>
    </>
  );
}

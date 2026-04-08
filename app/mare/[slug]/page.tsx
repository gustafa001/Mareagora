import { notFound } from 'next/navigation';
import { getPortBySlug, getAllSlugs } from '@/lib/ports';
import type { Metadata } from 'next';
import PortPageContent from '@/components/PortPageContent';

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

  const ano = new Date().getFullYear();
  const url = `https://www.mareagora.com.br/mare/${params.slug}`;
  const title = `Tábua de Maré ${port.name} ${ano} — MaréAgora`;
  const description = `Horários e alturas das marés em ${port.name} (${port.state}) hoje e para os próximos dias. Dados oficiais da Marinha do Brasil + ondas e vento em tempo real.`;
  const ogImage = `https://www.mareagora.com.br/mare/${params.slug}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'MaréAgora',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Tábua de Maré ${port.name}` }],
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
  const ano = new Date().getFullYear();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.mareagora.com.br/' },
          { '@type': 'ListItem', position: 2, name: 'Portos', item: 'https://www.mareagora.com.br/portos' },
          { '@type': 'ListItem', position: 3, name: port.name, item: `https://www.mareagora.com.br/mare/${slug}` },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `https://www.mareagora.com.br/mare/${slug}`,
        url: `https://www.mareagora.com.br/mare/${slug}`,
        name: `Tábua de Maré ${port.name} ${ano} — MaréAgora`,
        description: `Horários e alturas das marés em ${port.name} (${port.state}) para ${ano}.`,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': 'https://www.mareagora.com.br/' },
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
      <PortPageContent slug={slug} regionContext={regionContext} />
    </>
  );
}

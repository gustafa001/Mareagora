import { notFound } from 'next/navigation';
import { getPortBySlug, getAllSlugs, PORTS } from '@/lib/ports';
import { getStateSlug, getStateName } from '@/lib/states';
import type { Metadata } from 'next';
import PortPageContent from '@/components/PortPageContent';
import PortoFAQ from '@/components/PortoFAQ';
import PortosProximos from '@/components/PortosProximos';
import ExploreCTA from '@/components/ExploreCTA';
import { portosConfig, categoryDefaults } from '@/data/porto-seo-config';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';
import { getPostsByPort } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';
import { getPortoDescription } from '@/lib/porto-descriptions';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import { generateSEOContent } from '@/lib/seo/content-generator';

export const revalidate = 3600; // regenera a página a cada 1h (ISR), evita data congelada do build

export async function generateStaticParams() {
  return PORTS.map(port => ({
    slug: getStateSlug(port.state),
    cidade: port.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string, cidade: string } }): Promise<Metadata> {
  const estado = params.slug;
  const slug = params.cidade;
  const port = getPortBySlug(slug);
  if (!port || getStateSlug(port.state) !== estado) return { title: 'Local não encontrado' };

  const config = portosConfig[slug];
  const ano = new Date().getFullYear();
  const url = `https://mareagora.com.br/mare/${estado}/${slug}`;
  const ogImage = `https://mareagora.com.br/mare/${estado}/${slug}/opengraph-image`;

  const isCommercial = !port.referencePortSlug && (port.name.toLowerCase().includes('porto') || port.name.toLowerCase().includes('terminal') || config?.category === 'industrial');

  // Portos/terminais comerciais usam o nome do terminal no título (bate com a busca do usuário);
  // praias continuam usando o nome da cidade.
  const seoName = isCommercial ? port.name : port.cityName;

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

export default async function PortPage({ params }: { params: { slug: string, cidade: string } }) {
  const estado = params.slug;
  const slug = params.cidade;
  const port = getPortBySlug(slug);
  if (!port || getStateSlug(port.state) !== estado) notFound();

  const portDescription = getPortoDescription(slug);
  const ano = new Date().getFullYear();
  // Data de "hoje" no fuso de Brasília, calculada uma única vez aqui no
  // servidor e repassada como prop (ver comentário em PortPageContent.tsx).
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

  const config = portosConfig[slug];
  const categoria = config?.category ?? 'turismo';

  const { posts: blogPosts, strategy: blogStrategy } = getPostsByPort(port);

  const seoName = port.cityName;
  
  // Data de hoje (para AI Overview, SEO)
  const dataHoje = new Date().toISOString().split('T')[0];
  const { text: seoText, faq: seoFaq } = generateSEOContent(port, dataHoje);

  return (
    <>
      <SchemaGenerator 
        port={port} 
        type={categoria === 'industrial' || port.name.toLowerCase().includes('porto') ? 'Port' : 'Beach'} 
        url={`https://mareagora.com.br/mare/${estado}/${slug}`} 
        title={`Tábua de Maré ${seoName} ${ano} — MaréAgora`}
        description={`Horários e alturas das marés em ${seoName} (${port.state}) para ${ano}.`}
        faq={seoFaq}
      />
      
      {/* Resumo Gerado (AI Overview Target) */}
      <div className="bg-slate-900/50 border-b border-slate-800 py-6">
        <div className="container">
          <h2 className="text-xl font-bold text-white mb-2">Visão Geral Hoje ({dataHoje.split('-').reverse().join('/')})</h2>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            {seoText}
          </p>
        </div>
      </div>
      <PortPageContent
        slug={slug}
        portDescription={portDescription}
        blogPosts={blogPosts}
        blogStrategy={blogStrategy}
        todayStr={todayStr}
      />
      <div className="container pb-16">
        <PortoFAQ slug={slug} categoria={categoria} />
        <PortosProximos slug={slug} />
        <ExploreCTA />
        
        {/* AdSense Rodapé */}
        <div className="mt-12 flex justify-center">
          <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
        </div>
      </div>
    </>
  );
}

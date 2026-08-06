import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortBySlug, getAllSlugs, PORTS } from '@/lib/ports';
import { portosConfig } from '@/data/porto-seo-config';
import { getStateSlug, getStateName } from '@/lib/states';
import PortOperationsPage from '@/components/port-operations/PortOperationsPage';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import { generateSEOContent } from '@/lib/seo/content-generator';

/** Apenas portos comerciais/industriais fazem sentido para este dashboard.
 *  Praias que usam a maré de outro porto como referência (referencePortSlug)
 *  nunca são o porto comercial em si, mesmo quando o nome contém "porto"
 *  (ex.: Porto de Galinhas é uma praia, não um porto industrial). */
function isCommercialPort(slug: string): boolean {
  const port = getPortBySlug(slug);
  if (!port) return false;
  if (port.referencePortSlug) return false;
  const config = portosConfig[slug];
  return (
    port.name.toLowerCase().includes('porto') ||
    port.name.toLowerCase().includes('terminal') ||
    config?.category === 'industrial'
  );
}

export async function generateStaticParams() {
  return PORTS.filter(p => isCommercialPort(p.slug)).map(port => ({
    slug: getStateSlug(port.state),
    cidade: port.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string, cidade: string } }): Promise<Metadata> {
  const estado = params.slug;
  const slug = params.cidade;
  const port = getPortBySlug(slug);
  if (!port || getStateSlug(port.state) !== estado) return { title: 'Local não encontrado' };

  const title = `Operações Portuárias — ${port.name} | MaréAgora`;
  const description = `Painel operacional em tempo real de ${port.name} (${port.state}): janela operacional, maré, clima, condições do mar, restrições e alertas.`;
  const url = `https://mareagora.com.br/operacoes-portuarias/${estado}/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'pt_BR', siteName: 'MaréAgora' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function Page({ params }: { params: { slug: string, cidade: string } }) {
  const estado = params.slug;
  const slug = params.cidade;
  const port = getPortBySlug(slug);
  if (!port || !isCommercialPort(slug) || getStateSlug(port.state) !== estado) notFound();

  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const dataHoje = new Date().toISOString().split('T')[0];
  const { text: seoText, faq: seoFaq } = generateSEOContent(port, dataHoje);

  return (
    <>
      <SchemaGenerator 
        port={port} 
        type="Port" 
        url={`https://mareagora.com.br/operacoes-portuarias/${estado}/${slug}`} 
        title={`Operações Portuárias — ${port.name} | MaréAgora`}
        description={`Painel operacional em tempo real de ${port.name} (${port.state}): janela operacional, maré, clima, condições do mar, restrições e alertas.`}
        faq={seoFaq}
      />
      
      {/* Resumo Operacional (AI Overview Target) */}
      <div className="bg-slate-900/80 border-b border-slate-800 py-6">
        <div className="container">
          <h2 className="text-lg md:text-xl font-bold text-white mb-2">Visão Geral das Operações ({dataHoje.split('-').reverse().join('/')})</h2>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            {seoText}
          </p>
        </div>
      </div>

      <PortOperationsPage slug={slug} todayStr={todayStr} />
    </>
  );
}

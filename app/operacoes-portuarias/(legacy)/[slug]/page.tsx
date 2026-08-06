import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortBySlug, getAllSlugs } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';
import { portosConfig } from '@/data/porto-seo-config';
import PortOperationsPage from '@/components/port-operations/PortOperationsPage';

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
  return getAllSlugs().filter(isCommercialPort).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const port = getPortBySlug(slug);
  if (!port) return { title: 'Porto não encontrado' };

  const estadoSlug = getStateSlug(port.state);
  const title = `Operações Portuárias — ${port.name} | MaréAgora`;
  const description = `Painel operacional em tempo real de ${port.name} (${port.state}): janela operacional, maré, clima, condições do mar, restrições e alertas.`;
  const seoUrl = `https://mareagora.com.br/operacoes-portuarias/${estadoSlug}/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: seoUrl },
    openGraph: { title, description, url: seoUrl, type: 'website', locale: 'pt_BR', siteName: 'MaréAgora' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const port = getPortBySlug(slug);
  if (!port || !isCommercialPort(slug)) notFound();

  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

  return <PortOperationsPage slug={slug} todayStr={todayStr} />;
}

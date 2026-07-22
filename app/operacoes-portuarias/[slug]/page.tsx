import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortBySlug, getAllSlugs } from '@/lib/ports';
import { portosConfig } from '@/data/porto-seo-config';
import PortOperationsPage from '@/components/port-operations/PortOperationsPage';

/** Apenas portos comerciais/industriais fazem sentido para este dashboard. */
function isCommercialPort(slug: string): boolean {
  const port = getPortBySlug(slug);
  if (!port) return false;
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
  const port = getPortBySlug(params.slug);
  if (!port) return { title: 'Porto não encontrado' };

  const title = `Operações Portuárias — ${port.name} | MaréAgora`;
  const description = `Painel operacional em tempo real de ${port.name} (${port.state}): janela operacional, maré, clima, condições do mar, restrições e alertas.`;
  const url = `https://mareagora.com.br/operacoes-portuarias/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'pt_BR', siteName: 'MaréAgora' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const port = getPortBySlug(params.slug);
  if (!port || !isCommercialPort(params.slug)) notFound();

  return <PortOperationsPage slug={params.slug} />;
}

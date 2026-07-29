import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PORTS } from '@/lib/ports';
import { getStateCodeFromSlug, getStateName, getStateSlug, STATE_MAP } from '@/lib/states';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';

// Gera uma página estática para cada estado que tenha ao menos um porto/cidade cadastrado
export async function generateStaticParams() {
  const estadosComPortos = new Set(PORTS.map((port) => getStateSlug(port.state)));
  return Array.from(estadosComPortos).map((estado) => ({ estado }));
}

export async function generateMetadata({ params }: { params: { estado: string } }): Promise<Metadata> {
  const stateCode = getStateCodeFromSlug(params.estado);
  if (!stateCode) return { title: 'Estado não encontrado' };

  const stateName = getStateName(stateCode);
  const ano = new Date().getFullYear();
  const cidades = PORTS.filter((p) => p.state === stateCode);
  const url = `https://mareagora.com.br/estados/${params.estado}`;

  const title = `Tábua de Maré ${stateName} ${ano} — Todas as Cidades e Portos | MaréAgora`;
  const description = `Previsão de maré em ${cidades.length} cidades e portos de ${stateName}. Horários de maré alta e baixa, coeficientes e dados oficiais da Marinha do Brasil.`;

  return {
    title,
    description,
    keywords: [
      `tábua de maré ${stateName.toLowerCase()}`,
      `maré ${stateName.toLowerCase()}`,
      `previsão de maré ${stateName.toLowerCase()} ${ano}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'MaréAgora',
    },
  };
}

export default function EstadoPage({ params }: { params: { estado: string } }) {
  const stateCode = getStateCodeFromSlug(params.estado);
  if (!stateCode) notFound();

  const stateName = getStateName(stateCode);
  const cidades = PORTS.filter((p) => p.state === stateCode).sort((a, b) =>
    a.cityName.localeCompare(b.cityName, 'pt-BR')
  );

  if (cidades.length === 0) notFound();

  const url = `https://mareagora.com.br/estados/${params.estado}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://mareagora.com.br/' },
      { '@type': 'ListItem', position: 2, name: 'Estados', item: 'https://mareagora.com.br/estados' },
      { '@type': 'ListItem', position: 3, name: stateName, item: url },
    ],
  };

  return (
    <main className="min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SchemaGenerator
        type="State"
        url={url}
        title={`Tábua de Maré ${stateName} — MaréAgora`}
        description={`Previsão de maré em ${cidades.length} cidades e portos de ${stateName}, com dados oficiais da Marinha do Brasil.`}
      />

      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/80 to-slate-950/85" />

      <div className="relative z-10">
        <NavBar />

        <section className="px-4 max-w-6xl mx-auto">
          <div className="pt-20 pb-2">
            <Link
              href="/estados"
              className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
            >
              ← Todos os estados
            </Link>
          </div>

          {/* Breadcrumb visual */}
          <nav aria-label="breadcrumb" className="mb-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-blue-400">Início</Link>
            {' / '}
            <Link href="/estados" className="hover:text-blue-400">Estados</Link>
            {' / '}
            <span className="text-slate-200">{stateName}</span>
          </nav>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-syne tracking-tighter">
              Tábua de Maré — {stateName}
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Previsão de maré para {cidades.length}{' '}
              {cidades.length === 1 ? 'cidade/porto' : 'cidades e portos'} do litoral de{' '}
              {stateName}, com dados oficiais da Diretoria de Hidrografia e Navegação (DHN)
              da Marinha do Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {cidades.map((porto) => (
              <Link
                key={porto.slug}
                href={`/mare/${params.estado}/${porto.slug}`}
                className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {porto.cityName}
                  </h2>
                  <svg
                    className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-all group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400">{porto.name}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Ver tábua de maré
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center pb-16">
            <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { PORTS, getAllRegions } from '@/lib/ports';
import { getStateSlug, getStateName } from '@/lib/states';
import NavBar from '@/components/NavBar';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';

export const metadata: Metadata = {
  title: 'Tábua de Marés por Estado | MaréAgora',
  description: 'Navegue pelas previsões de maré de todos os estados costeiros do Brasil, com dados oficiais da Marinha do Brasil.',
  alternates: { canonical: 'https://mareagora.com.br/estados' },
};

// Agrupa os estados (a partir dos portos cadastrados) por região,
// reaproveitando a mesma taxonomia de região já usada em /portos
function getEstadosPorRegiao() {
  const regioes = getAllRegions();

  return regioes
    .map((regiao) => {
      const portosDaRegiao = PORTS.filter((p) => p.region === regiao.id);

      const estadosMap = new Map<string, { code: string; nome: string; slug: string; total: number }>();
      for (const porto of portosDaRegiao) {
        const existing = estadosMap.get(porto.state);
        if (existing) {
          existing.total += 1;
        } else {
          estadosMap.set(porto.state, {
            code: porto.state,
            nome: getStateName(porto.state),
            slug: getStateSlug(porto.state),
            total: 1,
          });
        }
      }

      const estados = Array.from(estadosMap.values()).sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR')
      );

      return { regiao, estados };
    })
    .filter((grupo) => grupo.estados.length > 0);
}

export default function EstadosPage() {
  const grupos = getEstadosPorRegiao();
  const totalEstados = grupos.reduce((acc, g) => acc + g.estados.length, 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://mareagora.com.br/' },
      { '@type': 'ListItem', position: 2, name: 'Estados', item: 'https://mareagora.com.br/estados' },
    ],
  };

  const colors = [
    'from-blue-400 to-cyan-400',
    'from-cyan-400 to-teal-400',
    'from-teal-400 to-emerald-400',
    'from-emerald-400 to-green-400',
    'from-green-400 to-blue-400',
  ];

  return (
    <main className="min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SchemaGenerator
        type="WebPage"
        url="https://mareagora.com.br/estados"
        title="Tábua de Marés por Estado | MaréAgora"
        description="Navegue pelas previsões de maré de todos os estados costeiros do Brasil."
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
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
            >
              ← Início
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-syne tracking-tighter">
              Tábua de Marés por Estado
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Navegue pelas previsões de maré dos {totalEstados} estados costeiros do Brasil
              cobertos pelo MaréAgora, com dados oficiais da Marinha do Brasil.
            </p>
          </div>

          <div className="space-y-16 mb-16">
            {grupos.map((grupo, idx) => (
              <div key={grupo.regiao.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-1 h-8 bg-gradient-to-b ${colors[idx % colors.length]} rounded-full`} />
                  <h2 className="text-2xl font-bold text-white">{grupo.regiao.name}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {grupo.estados.map((estado) => (
                    <Link
                      key={estado.code}
                      href={`/estados/${estado.slug}`}
                      className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {estado.nome}
                        </h3>
                        <svg
                          className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-all group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-400">
                        {estado.total} {estado.total === 1 ? 'cidade/porto' : 'cidades e portos'}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
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

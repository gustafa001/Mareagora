import Link from 'next/link';
import type { Metadata } from 'next';
import { PORTS, getPortBySlug } from '@/lib/ports';
import { portosConfig } from '@/data/porto-seo-config';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Operações Portuárias — Painel em Tempo Real | MaréAgora',
  description: 'Painel operacional para portos brasileiros: janela operacional, maré, clima, condições do mar, restrições e alertas em tempo real.',
  alternates: { canonical: 'https://mareagora.com.br/operacoes-portuarias' },
};

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

export default function OperacoesPortuariasIndexPage() {
  const commercialPorts = PORTS.filter(p => isCommercialPort(p.slug));

  return (
    <main className="min-h-screen bg-[#060b14] relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <NavBar />

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-black font-syne text-white uppercase">
            Operações Portuárias
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Painel em tempo real com janela operacional, maré, clima, condições do mar, restrições e alertas para portos comerciais brasileiros.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {commercialPorts.map((port) => (
              <Link
                key={port.id}
                href={`/operacoes-portuarias/${port.slug}`}
                className="rounded-2xl border border-white/10 bg-[#0d1526]/80 p-5 hover:border-blue-400/50 hover:bg-[#0d1526] transition-all group"
              >
                <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">{port.state}</p>
                <h2 className="text-lg font-black font-syne text-white group-hover:text-blue-300 transition-colors">
                  {port.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{port.cityName}</p>
                <span className="mt-3 inline-block text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  Ver painel →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

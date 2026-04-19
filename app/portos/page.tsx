import Link from 'next/link';
import { PORTS } from '@/lib/ports';
import NavBar from '@/components/NavBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tábua de Marés de Todos os Portos e Praias do Brasil 2026 | MaréAgora',
  description: 'Consulte a tábua de marés para 122 portos e praias do Brasil em 2026. Do Pará à Antártida, dados oficiais da Marinha do Brasil para surf, pesca, mergulho e navegação.',
  keywords: [
    'tabua de mares brasil',
    'tabua de mares 2026',
    'maré brasil portos',
    'tábua de maré todas praias brasil',
    'tábua de maré litoral brasileiro',
    'previsão maré brasil',
  ],
  alternates: {
    canonical: 'https://www.mareagora.com.br/portos',
  },
  openGraph: {
    title: 'Tábua de Marés — 122 Portos do Brasil 2026 | MaréAgora',
    description: 'Consulte a tábua de marés para 122 portos e praias do Brasil em 2026. Dados oficiais da Marinha do Brasil.',
    url: 'https://www.mareagora.com.br/portos',
    type: 'website',
  },
};

export default function PortosPage() {
  return (
    <main className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/80 to-slate-950/85" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <NavBar />

        <section className="py-16 px-4 max-w-6xl mx-auto">

          {/* Norte */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
              <h2 className="text-3xl font-bold text-white">Região Norte</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PORTS.filter(p => p.region === 'norte').map((port) => (
                <Link key={port.slug} href={`/mare/${port.slug}`}
                  className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{port.name}</h4>
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">{port.state}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Ver previsão
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Nordeste */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-teal-400 rounded-full" />
              <h2 className="text-3xl font-bold text-white">Região Nordeste</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PORTS.filter(p => p.region === 'nordeste').map((port) => (
                <Link key={port.slug} href={`/mare/${port.slug}`}
                  className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">{port.name}</h4>
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">{port.state}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Ver previsão
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sudeste */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-full" />
              <h2 className="text-3xl font-bold text-white">Região Sudeste</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PORTS.filter(p => p.region === 'sudeste').map((port) => (
                <Link key={port.slug} href={`/mare/${port.slug}`}
                  className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-teal-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-white group-hover:text-teal-300 transition-colors">{port.name}</h4>
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">{port.state}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Ver previsão
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sul */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-green-400 rounded-full" />
              <h2 className="text-3xl font-bold text-white">Região Sul</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PORTS.filter(p => p.region === 'sul').map((port) => (
                <Link key={port.slug} href={`/mare/${port.slug}`}
                  className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">{port.name}</h4>
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">{port.state}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Ver previsão
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </section>


      </div>
    </main>
  );
}

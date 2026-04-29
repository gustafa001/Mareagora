import Link from 'next/link';
import { PORTS, getAllRegions } from '@/lib/ports';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';
import NavBar from '@/components/NavBar';
import dynamic from 'next/dynamic';
import PortosListClient from '@/components/PortosListClient';

const MapaInterativo = dynamic(() => import('@/components/MapaInterativo'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 520, background: '#0f172a', borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#94a3b8', fontSize: 14 }}>
      Carregando mapa...
    </div>
  )
});
import type { Metadata } from 'next';

const PORT_COUNT = PORTS.length;

export const metadata: Metadata = {
  title: 'Todos os Portos — Tábua de Marés Brasil | MaréAgora',
  description: `Previsão de marés para ${PORT_COUNT} portos brasileiros. Dados oficiais da Marinha do Brasil. Encontre maré alta, baixa e coeficientes para qualquer porto do litoral brasileiro.`,
  alternates: {
    canonical: 'https://www.mareagora.com.br/portos',
  },
};

export default function PortosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.mareagora.com.br/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Portos",
        "item": "https://www.mareagora.com.br/portos"
      }
    ]
  };

  return (
    <main className="min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

        <section className="px-4 max-w-6xl mx-auto">
          {/* Botão Voltar */}
          <div className="pt-20 pb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
            >
              ← Início
            </Link>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-syne tracking-tighter">
              Tábua de Marés — Todos os Portos do Brasil
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              O MaréAgora reúne a tábua de marés completa de {PORT_COUNT} portos e estações
              costeiras do Brasil, com dados oficiais da Diretoria de Hidrografia e
              Navegação (DHN) da Marinha do Brasil. Navegue por região para encontrar
              a previsão de marés alta e baixa, coeficientes, horários de nascer e
              pôr do sol e condições de vento e ondas para o seu porto mais próximo.
            </p>
          </div>

          <section style={{ marginBottom: '4rem' }}>
            <h2 className="text-2xl font-bold text-white mb-6 font-syne">Mapa Interativo</h2>
            <MapaInterativo />
          </section>

          {/* Componente de Busca e Listagem Client-side */}
          <PortosListClient 
            initialRegions={getAllRegions()} 
            allPorts={PORTS} 
          />

          {/* AdSense Rodapé */}
          <div className="mt-20 flex justify-center border-t border-white/10 pt-12">
            <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
          </div>
        </section>
      </div>
    </main>
  );
}

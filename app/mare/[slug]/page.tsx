import { notFound } from 'next/navigation';
import { PORTS, getPortBySlug, getNearbySlugs } from '@/lib/ports';
import { getTodayTides, getTideStatus, tideAtMinute } from '@/lib/tideUtils';
import { getPortData } from '@/lib/tideData';
import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TideChart from '@/components/TideChart';
import TideTable from '@/components/TideTable';
import WavesCard from '@/components/WavesCard';
import ForecastStrip from '@/components/ForecastStrip';
import ConditionsCard from '@/components/ConditionsCard';
import SummaryCards from '@/components/SummaryCards';
import DetailedForecastTable from '@/components/DetailedForecastTable';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const port = getPortBySlug(params.slug);
  if (!port) return { title: 'Porto não encontrado' };
  return {
    title: `Tábua de Maré ${port.name} ${new Date().getFullYear()} — MaréAgora`,
    description: `Horários e alturas das marés em ${port.name} (${port.state}) hoje e para os próximos dias. Dados oficiais da Marinha do Brasil + ondas e vento em tempo real.`,
  };
}

export default async function PortPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const port = getPortBySlug(slug);
  if (!port) notFound();

  const id = port.dataFile.replace('.json', '');
  const portData = await getPortData(id);
  const { tides: todayTides, date: closestDate } = getTodayTides(portData ?? { eventos: [] });
  
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  
  // Lógica para os Summary Cards (Picos e Vales)
  const heights = todayTides.map(t => t.altura_m);
  const maxH = Math.max(...heights);
  const minH = Math.min(...heights);
  const avgH = (maxH + minH) / 2;
  
  const nextHigh = todayTides.find(t => {
    const [h, m] = t.hora.split(':').map(Number);
    const min = (h || 0) * 60 + (m || 0);
    return min > currentMin && t.altura_m >= avgH;
  }) || todayTides.find(t => t.altura_m >= avgH);

  const nextLow = todayTides.find(t => {
    const [h, m] = t.hora.split(':').map(Number);
    const min = (h || 0) * 60 + (m || 0);
    return min > currentMin && t.altura_m < avgH;
  }) || todayTides.find(t => t.altura_m < avgH);

  // A data atual está a ser tratada dentro dos componentes dinâmicos no cliente

  return (
    <main className="min-h-screen pb-20">
      <NavBar />
      
      {/* HERO SECTION - LEGACY LOOK */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container relative z-10 text-white text-center pt-24 md:pt-16">
          <div className="flex flex-col gap-3 items-center px-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl">
              {port.name}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl opacity-90 font-medium font-syne hidden sm:block">
              {port.name} - 2026 | Estado do {port.state}
            </p>
            <p className="text-sm opacity-90 font-medium font-syne sm:hidden">
              Estado do {port.state}
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs sm:text-sm opacity-80 font-mono">
              <span>Lat: {port.lat.toFixed(4)}°</span>
              <span>Lon: {port.lon.toFixed(4)}°</span>
              <span>Fuso: UTC-3</span>
              <span>Nível Médio: {portData?.nivel_medio || "--"} m</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* SUMMARY CARDS - FLOATING */}
        <SummaryCards 
          nextHigh={nextHigh || null} 
          nextLow={nextLow || null} 
          lat={port.lat}
          lon={port.lon}
        />

        <div className="mt-12 flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-8">
          {/* Lado Esquerdo: Principais Dados */}
          <div className="flex flex-col gap-8">
            <div className="classic-card">
              <TideChart tides={todayTides} />
            </div>

            <div className="classic-card overflow-hidden">
              <h3 className="card-title">Tabela de Marés</h3>
              <TideTable tides={todayTides} currentMin={currentMin} />
            </div>

            {/* BURACO VISUAL PREENCHIDO COM A NOVA MEGATABELA WINDFINDER-STYLE */}
            <DetailedForecastTable lat={port.lat} lon={port.lon} todayTides={todayTides} />

            {/* SEO Content */}
            <section className="classic-card prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold mb-4 font-syne tracking-tight">Guia de Maré em {port.name}</h2>
              <p className="text-gray-600 leading-relaxed text-sm">A tábua de maré de {port.name} é essencial para pescadores, surfistas, mergulhadores e navegantes que frequentam o litoral de {port.state}. Os dados apresentados pelo MaréAgora são baseados nas tábuas oficiais publicadas pelo Centro de Hidrografia da Marinha do Brasil (CHM) para o <strong>ano de 2026</strong>.</p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h3 className="text-base font-bold mb-2 text-gray-800">🎣 Como usar a tábua?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Ela indica os horários e alturas das marés altas e baixas ao longo do dia. Para a pesca, os momentos de virada (quando a maré muda de direção) costumam ser muito produtivos.</p>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2 text-gray-800">📏 Nível Médio</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">O nível médio ({portData?.nivel_medio || "--"}m) é a referência. Alturas positivas indicam quanto a água estará acima deste nível para que você possa atracar em segurança.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Lado Direito: Condições e Extras */}
          <aside className="flex flex-col gap-8">
            <WavesCard lat={port.lat} lon={port.lon} />
            <ForecastStrip lat={port.lat} lon={port.lon} />
            <ConditionsCard lat={port.lat} lon={port.lon} />
            
            <div className="classic-card">
              <h3 className="card-title mb-4">📍 Cidades Próximas</h3>
              <div className="flex flex-col gap-3">
                {getNearbySlugs(port).map(p => {
                  return (
                    <Link 
                      key={p.slug} 
                      href={`/mare/${p.slug}`}
                      className="group flex flex-col p-3.5 rounded-xl border border-gray-100 hover:border-[#2a68f6] hover:bg-gray-50 transition-all"
                    >
                      <span className="font-bold text-gray-800 group-hover:text-[#2a68f6]">{p.name}</span>
                      <span className="text-xs text-gray-400 capitalize">{p.state} • Ver tábua de maré</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}

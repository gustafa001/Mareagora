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
import NearbyPorts from '@/components/NearbyPorts';
import WindWaveCharts from '@/components/WindWaveCharts';
import Link from 'next/link';

// Gera todas as rotas estáticas em build time
export async function generateStaticParams() {
  return PORTS.map(p => ({ slug: p.slug }));
}

// SEO dinâmico por porto
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const port = getPortBySlug(params.slug);
  if (!port) return {};

  const title = `Tábua de Maré ${port.name} ${port.state} 2026 — MaréAgora`;
  const description = `Horários e alturas das marés em ${port.name} (${port.state}) hoje e para os próximos dias. Dados oficiais da Marinha do Brasil + ondas e vento em tempo real.`;
  const url = `https://mareagora.com.br/mare/${port.slug}`;

  return {
    title,
    description,
    keywords: `tábua de maré, maré hoje, ${port.name}, ${port.state}, Marinha do Brasil, previsão maré 2026`,
    alternates: { canonical: url },
    openGraph: {
      title: `Maré em ${port.name} hoje — MaréAgora`,
      description,
      url,
      type: 'website',
      images: [{ url: 'https://mareagora.com.br/og-image.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url,
        publisher: { '@type': 'Organization', name: 'MaréAgora' },
        geo: { '@type': 'GeoCoordinates', latitude: port.lat, longitude: port.lon },
      }),
    },
  };
}

// Página principal
export default async function PortPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const port = getPortBySlug(slug);
  if (!port) notFound();

  // Lê o JSON estático DIRETAMENTE no servidor (evita falhas de fetch)
  const id = port.dataFile.replace('.json', '');
  const portData = await getPortData(id);
  
  if (!portData) {
    console.error(`Falha crítica ao carregar dados de ${port.name} (${id})`);
  }
  
  const { tides: todayTides, date: closestDate } = getTodayTides(portData ?? { eventos: [] });
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const isToday = closestDate === today;

  const currentMin = now.getHours() * 60 + now.getMinutes();
  const { rising, next } = getTideStatus(currentMin, todayTides);
  const currentHeight = tideAtMinute(currentMin, todayTides);

  const nearby = getNearbySlugs(port);

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <main className="container pt-24 pb-12">
        {/* BREADCRUMB */}
        <div className="text-[0.82rem] text-[var(--muted)] mb-6">
          <Link href="/" className="hover:text-[var(--foam)]">MaréAgora</Link>
          <span className="mx-2">›</span>
          <span className="hover:text-[var(--foam)]">Portos</span>
          <span className="mx-2">›</span>
          <span className="text-[var(--white)] font-medium">{port.name} — {port.state}</span>
        </div>

        {/* HERO */}
        <div className="mb-10">
          {!isToday && (
            <div className="mb-6 p-4 bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.3)] rounded-2xl flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="text-sm text-[var(--sun)] leading-relaxed">
                <strong>Nota:</strong> Hoje não é dia de sizígia. Exibindo dados de <strong>{new Date(closestDate).toLocaleDateString('pt-BR')}</strong>, a sizígia mais próxima disponível.
              </div>
            </div>
          )}
          <h1 className="font-syne font-extrabold text-[clamp(2rem,6vw,3.5rem)] tracking-[-1.5px] leading-[1.1] text-[var(--white)] mb-4">
            Maré em <em className="not-italic text-[var(--foam)]">{port.name}</em>
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-[rgba(56,201,240,0.08)] border border-[rgba(56,201,240,0.15)] rounded-full px-3.5 py-1 text-[0.8rem] text-[var(--muted)]">
              <div className="live-dot"></div> Ao vivo
            </div>
            <div className="flex items-center gap-2 bg-[rgba(56,201,240,0.08)] border border-[rgba(56,201,240,0.15)] rounded-full px-3.5 py-1 text-[0.8rem] text-[var(--muted)]">
              ⚓ {Math.abs(port.lat).toFixed(2)}°{port.lat < 0 ? 'S' : 'N'} {Math.abs(port.lon).toFixed(2)}°{port.lon < 0 ? 'W' : 'E'}
            </div>
            <div className="flex items-center gap-2 bg-[rgba(56,201,240,0.08)] border border-[rgba(56,201,240,0.15)] rounded-full px-3.5 py-1 text-[0.8rem] text-[var(--muted)]">
              🗓 {now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="flex items-center gap-2 bg-[rgba(56,201,240,0.08)] border border-[rgba(56,201,240,0.15)] rounded-full px-3.5 py-1 text-[0.8rem] text-[var(--muted)]">
              ⚓ Dados: Marinha do Brasil
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">
            {/* NOW CARD */}
            <div className="card">
              <div className="card-title">Altura atual</div>
              <div className="font-syne font-extrabold text-[clamp(3.5rem,10vw,5.5rem)] leading-none tracking-[-3px] text-[var(--foam)]">
                {currentHeight.toFixed(2)}<span className="text-2xl text-[var(--muted)] font-normal ml-2">m</span>
              </div>
              <div className="mt-2 text-base text-[var(--sand)] flex items-center gap-2">
                {rising ? '⬆️ Maré subindo' : '⬇️ Maré descendo'}
              </div>
              <div className="mt-1 text-[0.85rem] text-[var(--muted)]">
                Próxima: {next?.tipo || 'Maré'} de {next?.altura_m ? next.altura_m.toFixed(2) : '--'}m às {next?.hora || '--:--'}
              </div>

              <TideChart tides={todayTides} />
            </div>

            {/* TIDE TABLE */}
            <TideTable tides={todayTides} currentMin={currentMin} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5">
            <WavesCard lat={port.lat} lon={port.lon} />
            <ForecastStrip lat={port.lat} lon={port.lon} />
            <ConditionsCard lat={port.lat} lon={port.lon} />
          </div>
        </div>

        {/* NEARBY PORTS */}
        <NearbyPorts ports={nearby} />

        {/* SEO TEXT */}
        <div className="mt-16 text-[var(--muted)] text-[0.9rem] leading-[1.8]">
          <h2 className="font-syne font-bold text-[1.1rem] text-[var(--sand)] mb-3 mt-8">Tábua de Maré em {port.name} ({port.state}) — 2026</h2>
          <p>A tábua de maré de {port.name} é essencial para pescadores, surfistas, mergulhadores e navegantes que frequentam o litoral de {port.state}. Os dados apresentados pelo MaréAgora são baseados nas tábuas oficiais publicadas pelo Centro de Hidrografia da Marinha do Brasil (CHM) para o ano de 2026.</p>
          <h2 className="font-syne font-bold text-[1.1rem] text-[var(--sand)] mb-3 mt-8">Como usar a tábua de maré</h2>
          <p>A tábua de maré indica os horários e alturas das marés altas (preamar) e baixas (baixa-mar) ao longo do dia. Para pesca, os momentos de virada — quando a maré muda de direção — costumam ser os mais produtivos. Para surfe, marés de meio ciclo com bom período de ondas tendem a oferecer as melhores condições.</p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="container py-10 mt-10 border-t border-[rgba(56,201,240,0.07)] flex flex-wrap justify-between items-center gap-4">
        <p className="text-[var(--muted)] text-[0.8rem]">© 2026 MaréAgora · Todos os direitos reservados</p>
        <div className="flex items-center gap-2 bg-[rgba(56,201,240,0.07)] border border-[rgba(56,201,240,0.12)] rounded-full px-3.5 py-1 text-[var(--muted)] text-[0.75rem]">
          ⚓ Dados: Marinha do Brasil 2026
        </div>
      </footer>
    </div>
  );
}

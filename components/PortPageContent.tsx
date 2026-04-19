'use client';

import { getPortBySlug, PORTS } from '@/lib/ports';
import { getEventosDia, getEventosAno } from '@/lib/mare';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';
const TideChart = dynamic(() => import('@/components/TideChart'), { ssr: false });
import MonthlyTideTable from '@/components/MonthlyTideTable';
import SummaryCards from '@/components/SummaryCards';
import WindWaveCharts from '@/components/WindWaveCharts';
import SearchPorts from '@/components/SearchPorts';
import PortStatistics from '@/components/PortStatistics';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import PortBlogSection from '@/components/PortBlogSection';
import { useSeaConditions } from '@/hooks/useSeaConditions';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/lib/blog';

interface PortPageContentProps {
  slug: string;
  regionContext: string;
  portDescription: string;
  blogPosts: BlogPost[];
}

export default function PortPageContent({ slug, regionContext, portDescription, blogPosts }: PortPageContentProps) {
  const port = getPortBySlug(slug);
  if (!port) notFound();

  const seoName = port.cityName;

  const { waveHeight } = useSeaConditions(port.lat, port.lon);

  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayTides = getEventosDia(port, todayStr);
  const ano = new Date().getFullYear();
  const dataAno = getEventosAno(port, ano);

  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const currentTimeBR = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });

  const heights = todayTides.length > 0 ? todayTides.map(t => t.altura_m) : [0];
  const maxH = Math.max(...heights);
  const minH = Math.min(...heights);
  const avgH = (maxH + minH) / 2;

  const nextHigh = todayTides.find(t => {
    const [h, m] = t.hora.split(':').map(Number);
    return (h || 0) * 60 + (m || 0) > currentMin && t.altura_m >= avgH;
  }) ?? todayTides.find(t => t.altura_m >= avgH) ?? null;

  const nextLow = todayTides.find(t => {
    const [h, m] = t.hora.split(':').map(Number);
    return (h || 0) * 60 + (m || 0) > currentMin && t.altura_m < avgH;
  }) ?? todayTides.find(t => t.altura_m < avgH) ?? null;

  return (
    <main className="min-h-screen pb-20">
      <NavBar />

      <section className="hero-section relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://res.cloudinary.com/dhnzzduzc/video/upload/lc5nufwye2fh6zpb2df0.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/55 z-10" />
        <div className="hero-overlay" />

        <div className="container relative z-30 text-white text-center pt-24 md:pt-16">
          <div className="flex flex-col gap-3 items-center px-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl">
              Tábua de Maré {seoName} — {ano}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl opacity-90 font-medium font-syne hidden sm:block">
              {seoName} - {ano} | Estado do {port.state}
            </p>
            <p className="text-sm opacity-90 font-medium font-syne sm:hidden">
              Estado do {port.state}
            </p>

            <div className="mt-6 mb-24 w-full max-w-md static z-40">
              <SearchPorts ports={PORTS} />
            </div>

            <p className="mt-4 text-xs opacity-70" suppressHydrationWarning>
              Horário local: {currentTimeBR}
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <SummaryCards
          nextHigh={nextHigh}
          nextLow={nextLow}
          lat={port.lat}
          lon={port.lon}
        />

        <div className="mt-12 flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-8">
          <div className="flex flex-col gap-8">
            <div className="classic-card">
              <TideChart tides={todayTides} />
            </div>

            <MonthlyTideTable
              eventos={dataAno}
              portName={seoName}
              lat={port.lat}
              lon={port.lon}
            />

            <WindWaveCharts lat={port.lat} lon={port.lon} />

            <ActivityRecommendations
              todayTides={todayTides}
              nextHigh={nextHigh}
              nextLow={nextLow}
              waveHeight={waveHeight ?? undefined}
            />

            <PortStatistics
              eventos={dataAno}
              portName={seoName}
            />

            <section className="classic-card prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold mb-4 font-syne">Sobre as Marés em {seoName}</h2>
              {/* Descrição única por porto — diferencia no Google */}
              {portDescription && (
                <p className="text-slate-600 leading-relaxed mb-4">
                  {portDescription}
                </p>
              )}
              {/* Contexto regional genérico como complemento */}
              <p className="text-slate-600 leading-relaxed">
                {regionContext}
              </p>
            </section>

            <PortBlogSection
              portSlug={slug}
              portName={seoName}
              posts={blogPosts}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

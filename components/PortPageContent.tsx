'use client';

import { getPortBySlug, PORTS, haversineDistance } from '@/lib/ports';
import { getEventosDia, getEventosAno, getEventosRange } from '@/lib/mare';
import { portosConfig } from '@/data/porto-seo-config';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';
const TideWeekCard = dynamic(() => import('@/components/TideWeekCard'), { ssr: false });

import MonthlyTideTable from '@/components/MonthlyTideTable';
import SummaryCards from '@/components/SummaryCards';
import WindWaveCharts from '@/components/WindWaveCharts';
import SearchPorts from '@/components/SearchPorts';
import PortStatistics from '@/components/PortStatistics';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import SolunarTable from '@/components/SolunarTable';
import PortBlogSection from '@/components/PortBlogSection';
import NotificationCTA from '@/components/NotificationCTA';
import WeatherRadarCard from '@/components/port-operations/WeatherRadarCard';
const DailyScoreCard = dynamic(() => import('@/components/DailyScoreCard'), { ssr: false });
import TideSchemaMarkup from '@/components/TideSchemaMarkup';
import { getStateSlug } from '@/lib/states';
import ShareButton from '@/components/ShareButton';
import { useSeaConditions } from '@/hooks/useSeaConditions';
import { getNextHighAndLow } from '@/lib/tideUtils';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/lib/blog';

interface PortPageContentProps {
  slug: string;
  portDescription: string;
  blogPosts: BlogPost[];
  blogStrategy: 'specific' | 'generic';
}

export default function PortPageContent({ slug, portDescription, blogPosts, blogStrategy }: PortPageContentProps) {
  const port = getPortBySlug(slug);
  if (!port) notFound();

  const seoName = port.cityName;

  const { waveHeight, loading: seaLoading } = useSeaConditions(port.lat, port.lon);
  const config = portosConfig[slug];
  const categoria = config?.category ?? 'turismo';

  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayTides = getEventosDia(port, todayStr);
  const weekTides = getEventosRange(port, todayStr, 7);
  const ano = new Date().getFullYear();
  const dataAno = getEventosAno(port, ano);

  const now = new Date();

  const currentTimeBR = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });

  const [brH, brM] = currentTimeBR.split(':').map(Number);
  const currentMin = (brH || 0) * 60 + (brM || 0);

  const { nextHigh, nextLow } = getNextHighAndLow(todayTides, currentMin);

  const referencePort = port.referencePortSlug ? getPortBySlug(port.referencePortSlug) : null;
  const referenceData = referencePort ? {
    name: referencePort.cityName || referencePort.name,
    slug: referencePort.slug,
    distanceKm: Math.round(haversineDistance(port.lat, port.lon, referencePort.lat, referencePort.lon))
  } : undefined;

  return (
    <main className="min-h-screen pb-20">
      <TideSchemaMarkup
        locationName={seoName || port.name}
        countryOrStateName={port.state}
        lat={port.lat}
        lon={port.lon}
        nextHigh={nextHigh ? { hora: nextHigh.hora, altura_m: nextHigh.altura_m } : null}
        nextLow={nextLow ? { hora: nextLow.hora, altura_m: nextLow.altura_m } : null}
        pageUrl={`https://mareagora.com.br/mare/${getStateSlug(port.state)}/${port.slug}`}
        parentUrl="https://mareagora.com.br/estados"
        parentName={port.state}
        locale="pt"
      />
      <NavBar />

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 pt-24 pb-16 border-b border-white/5">
        <div className="container relative z-10">

          {/* Botão Voltar */}
          <div className="absolute top-0 left-4 md:left-0 pt-4 md:pt-0">
            <a 
              href="/portos" 
              className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
            >
              ← Portos
            </a>
          </div>

          <div className="flex flex-col gap-3 items-center px-2 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl text-white drop-shadow-md">
              Tábua de Maré {seoName} — {ano}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl opacity-90 font-medium font-syne hidden sm:block text-white/90">
              {seoName} - {ano} | Estado do {port.state}
            </p>
            <p className="text-sm opacity-90 font-medium font-syne sm:hidden text-white/90">
              Estado do {port.state}
            </p>

            <div className="mt-6 mb-6 w-full max-w-md static z-40">
              <SearchPorts ports={PORTS} />
            </div>

            <ShareButton
              title={`Tábua de Maré ${seoName} ${ano} | MaréAgora`}
              text={`🌊 Confira a previsão de marés em ${seoName} — MaréAgora`}
            />

            <p className="mt-4 mb-20 text-xs opacity-70 text-white/70" suppressHydrationWarning>
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
          todayTides={todayTides}
        />

        {/* AdSense Leaderboard — abaixo do resumo, acima da dobra */}
        <div className="mt-8 flex justify-center">
          <AdSlot slotId={AD_SLOTS.LEADERBOARD_NAV} format="horizontal" />
        </div>

        {/* Score do Dia */}
        <div className="mt-8">
          <DailyScoreCard
            lat={port.lat}
            lon={port.lon}
            todayTides={todayTides}
            utcOffsetMin={-180}
          />
        </div>

        <div className="mt-12 flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-8">
          <div className="flex flex-col gap-8">
            <TideWeekCard days={weekTides} />

            <div className="my-8">
              <WeatherRadarCard lat={port.lat} lon={port.lon} />
            </div>

            <MonthlyTideTable
              eventos={dataAno}
              portName={seoName}
              lat={port.lat}
              lon={port.lon}
              referencePort={referenceData}
            />

            {/* AdSense Pós-Tabela */}
            <div className="my-8 flex justify-center">
              <AdSlot slotId={AD_SLOTS.POS_TABELA} format="auto" />
            </div>

            {/* AdSense In-Content */}
            <div className="my-8 flex justify-center">
              <AdSlot slotId={AD_SLOTS.INCONTENT_RECT} format="auto" />
            </div>

            <WindWaveCharts lat={port.lat} lon={port.lon} />

            <ActivityRecommendations
              todayTides={todayTides}
              nextHigh={nextHigh}
              nextLow={nextLow}
              waveHeight={waveHeight ?? undefined}
              loading={seaLoading}
              slug={slug}
              categoria={categoria}
            />

            <SolunarTable
              lat={port.lat}
              lon={port.lon}
              offsetMinutes={port.offsetMinutes}
              weekTides={weekTides}
            />

            <PortStatistics
              eventos={dataAno}
              portName={seoName}
            />

            <section className="classic-card prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold mb-4 font-syne">Sobre as Marés em {seoName}</h2>
              {portDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-slate-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </section>

            <PortBlogSection
              portSlug={slug}
              portName={seoName}
              posts={blogPosts}
              strategy={blogStrategy}
            />

            {/* Aviso Legal de Isenção de Responsabilidade Náutica */}
            <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-xl">
              <h3 className="flex items-center gap-2 text-red-800 font-bold mb-2">
                <span className="text-xl">⚠️</span> Aviso Importante de Navegação
              </h3>
              <p className="text-red-700/90 text-sm leading-relaxed">
                As previsões de marés, ventos e ondas exibidas no MaréAgora têm finalidade exclusivamente <strong>informativa e recreativa</strong>. 
                Nossos dados são baseados em fontes públicas e modelos matemáticos. 
                <br className="mb-1" />
                <strong>Em nenhuma hipótese</strong> estas informações devem ser utilizadas para navegação, planejamento de operações portuárias oficiais ou qualquer atividade que envolva risco de vida ou de patrimônio. Para tais fins, consulte <strong>sempre</strong> as Tábuas das Marés oficiais e cartas náuticas certificadas pela Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil.
              </p>
            </div>
          </div>

          {/* Sidebar — coluna reservada pelo grid, antes sem conteúdo */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <AdSlot slotId={AD_SLOTS.SIDEBAR_STICKY} format="vertical" style={{ minHeight: 600 }} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

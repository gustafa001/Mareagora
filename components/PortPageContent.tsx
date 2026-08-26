'use client';

import { useState, useEffect } from 'react';
import { getPortBySlug, PORTS, haversineDistance } from '@/lib/ports';
import { getEventosDia, getEventosAno, getEventosRange } from '@/lib/mare';
import { portosConfig } from '@/data/porto-seo-config';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';
import dynamic from 'next/dynamic';
import NavBar from '@/components/NavBar';
import TideWeekCard from '@/components/TideWeekCard';

import MonthlyTideTable from '@/components/MonthlyTideTable';
import SummaryCards from '@/components/SummaryCards';
import WindWaveCharts from '@/components/WindWaveCharts';
import LiveCameraEmbed from '@/components/LiveCameraEmbed';
import SearchPorts from '@/components/SearchPorts';
import PortStatistics from '@/components/PortStatistics';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import SolunarTable from '@/components/SolunarTable';
import BarometerCard from '@/components/BarometerCard';
import PortBlogSection from '@/components/PortBlogSection';
import NotificationCTA from '@/components/NotificationCTA';
import WeatherRadarCard from '@/components/port-operations/WeatherRadarCard';
import DailyScoreCard from '@/components/DailyScoreCard';
import TideSchemaMarkup from '@/components/TideSchemaMarkup';
import { getStateSlug, getStateName } from '@/lib/states';
import ShareButton from '@/components/ShareButton';
import { useSeaConditions } from '@/hooks/useSeaConditions';
import RessacaAlert from '@/components/RessacaAlert';
import { getNextHighAndLow } from '@/lib/tideUtils';
import { classifyToday } from '@/lib/tideQuality';
import TideQualityBadge from '@/components/TideQualityBadge';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/lib/blog';
import { useRecentPorts } from '@/hooks/useRecentPorts';
import { ClientOnly } from '@/components/ClientOnly';
import { exportTidePdf } from '@/lib/exportTidePdf';
import { WEEKDAYS, MONTHS, buildMonthRows } from '@/lib/monthlyTideCalc';

interface PortPageContentProps {
  slug: string;
  portDescription: string;
  blogPosts: BlogPost[];
  blogStrategy: 'specific' | 'generic';
  /**
   * Data de "hoje" (formato en-CA, ex: 2026-08-06) calculada UMA VEZ no
   * servidor (Server Component pai) e passada como prop. Calcular
   * `new Date()` aqui dentro (Client Component) fazia o servidor usar o
   * horário de quando a página foi gerada/publicada e o navegador usar o
   * horário real da visita — como a página é estática, essas datas podem
   * divergir por dias, mudando quais marés são "hoje" e derrubando a
   * hidratação (#418/#423/#425). Recebendo a data pronta do servidor, o
   * cliente nunca recalcula: não tem como divergir.
   */
  todayStr: string;
}

export default function PortPageContent({ slug, portDescription, blogPosts, blogStrategy, todayStr }: PortPageContentProps) {
  const port = getPortBySlug(slug);
  if (!port) notFound();

  const seoName = port.cityName;

  const { waveHeight, windSpeed, swellHeight, swellPeriod, swellDirection, forecast: swellForecast, hourlyToday, loading: seaLoading, error: seaError } = useSeaConditions(port.lat, port.lon);

  // registra o porto como "visto recentemente" pro menu de navegação
  const { addRecentPort } = useRecentPorts();
  useEffect(() => {
    addRecentPort(port.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [port.slug]);

  const config = portosConfig[slug];
  const categoria = config?.category ?? 'turismo';

  const todayTides = getEventosDia(port, todayStr);
  const weekTides = getEventosRange(port, todayStr, 7);
  const ano = Number(todayStr.slice(0, 4));
  const dataAno = getEventosAno(port, ano);

  // Relógio "vivo": só passa a existir depois de montar no cliente
  // (pós-hidratação). Antes disso usamos um placeholder fixo — igual no
  // servidor e no primeiro render do cliente — em vez de recalcular
  // `new Date()` de novo (que ainda divergiria por segundos e continuaria
  // causando os erros de hidratação #418/#423/#425).
  const [liveNow, setLiveNow] = useState<Date | null>(null);

  useEffect(() => {
    setLiveNow(new Date());
    const timer = setInterval(() => setLiveNow(new Date()), 30_000); // atualiza a cada 30s
    return () => clearInterval(timer);
  }, []);

  const currentTimeBR = liveNow
    ? liveNow.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo',
      })
    : '--:--';

  const [brH, brM] = currentTimeBR.split(':').map(Number);
  const currentMin = liveNow ? (brH || 0) * 60 + (brM || 0) : null;

  const [pdfExporting, setPdfExporting] = useState(false);

  async function handleExportPdf() {
    if (pdfExporting || !port) return;
    setPdfExporting(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const rows = buildMonthRows(dataAno, year, month, port.lat, port.lon, todayStr, WEEKDAYS);
      await exportTidePdf({
        portName: seoName,
        state: port.state,
        monthLabel: `${MONTHS[month]} ${year}`,
        rows,
        lang: 'pt',
      });
    } catch (err) {
      console.error('[PortPageContent] Erro ao gerar PDF:', err);
    } finally {
      setPdfExporting(false);
    }
  }

  const { nextHigh, nextLow } = currentMin !== null
    ? getNextHighAndLow(todayTides, currentMin)
    : { nextHigh: null, nextLow: null };

  const tideQuality = classifyToday(todayTides, currentMin);

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
        parentUrl={`https://mareagora.com.br/estados/${getStateSlug(port.state)}`}
        parentName={getStateName(port.state)}
        locale="pt"
      />
      <NavBar />

      <section className="relative overflow-hidden hero-section pt-24 pb-16 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/70 to-slate-950" />
        <div className="container relative z-10">

          {/* Botão Voltar */}
          <div className="absolute top-0 left-4 md:left-0 pt-4 md:pt-0">
            <a 
              href={`/estados/${getStateSlug(port.state)}`}
              className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
            >
              ← {getStateName(port.state)}
            </a>
          </div>

          <div className="flex flex-col gap-3 items-center px-2 text-center pt-14 md:pt-0">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-syne leading-tight max-w-4xl text-white drop-shadow-md">
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

            {tideQuality && (
              <div className="mt-2">
                <TideQualityBadge result={tideQuality} />
              </div>
            )}

            <p className="mt-4 mb-20 text-xs opacity-70 text-white/70" suppressHydrationWarning>
              Horário local: {currentTimeBR}
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <ClientOnly fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 relative z-20 min-h-[160px]">
            <div className="glass-card h-[160px] bg-white/5 rounded-2xl animate-pulse" />
            <div className="glass-card h-[160px] bg-white/5 rounded-2xl animate-pulse" />
            <div className="glass-card h-[160px] bg-white/5 rounded-2xl animate-pulse" />
          </div>
        }>
          <SummaryCards
            nextHigh={nextHigh}
            nextLow={nextLow}
            lat={port.lat}
            lon={port.lon}
            todayTides={todayTides}
          />
        </ClientOnly>

        {/* AdSense Leaderboard — abaixo do resumo, acima da dobra */}
        <div className="mt-8 flex justify-center">
          <AdSlot slotId={AD_SLOTS.LEADERBOARD_NAV} format="horizontal" />
        </div>

        {/* Score do Dia */}
        <div className="mt-8">
          <ClientOnly fallback={
            <div className="rounded-[24px] overflow-hidden shadow-2xl p-6 bg-[#0d1b2e] border border-white/5 animate-pulse min-h-[260px] flex items-center justify-center">
              <div className="text-slate-500 font-syne text-xs uppercase tracking-widest">Carregando score do dia...</div>
            </div>
          }>
            <DailyScoreCard
              lat={port.lat}
              lon={port.lon}
              todayTides={todayTides}
              utcOffsetMin={-180}
            />
          </ClientOnly>
        </div>

        <div className="mt-12 flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-8">
          <div className="flex flex-col gap-8">
            <ClientOnly fallback={
              <div className="rounded-2xl bg-[#0d1b2e] border border-white/5 p-6 min-h-[300px] animate-pulse">
                <div className="h-[300px] bg-white/5 rounded-2xl" />
              </div>
            }>
              <TideWeekCard days={weekTides} />
            </ClientOnly>

            <div className="my-8">
              <WeatherRadarCard lat={port.lat} lon={port.lon} />
            </div>

            {/* AdSense — no lugar do antigo mapa de raios */}
            <div className="my-8 flex justify-center">
              <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
            </div>

            <button
              onClick={handleExportPdf}
              disabled={pdfExporting}
              className="my-6 block w-full bg-gradient-to-r from-[#0d1526] to-[#1a3a5c] rounded-2xl p-5 text-center border border-blue-500/20 hover:border-blue-400/40 transition-all hover:shadow-lg hover:shadow-blue-500/10 disabled:opacity-50 cursor-pointer"
            >
              <p className="text-base font-bold font-syne text-white">
                {pdfExporting ? '⏳ Gerando PDF...' : '📄 Exporte a tábua de maré em PDF'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {pdfExporting ? 'Aguarde um momento' : 'Baixe a tabela completa do mês para consultar offline'}
              </p>
            </button>

            <div id="tabela-mensal">
              <MonthlyTideTable
                eventos={dataAno}
                portName={seoName}
                lat={port.lat}
                lon={port.lon}
                state={port.state}
                referencePort={referenceData}
                initialDateStr={todayStr}
              />
            </div>

            <a href="#graficos-meteorologia" className="my-6 block bg-gradient-to-r from-[#0d1526] to-[#1a3a5c] rounded-2xl p-5 text-center border border-cyan-500/20 hover:border-cyan-400/40 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
              <p className="text-base font-bold font-syne text-white">📈 Veja a previsão detalhada dos próximos 7 dias</p>
              <p className="text-xs text-slate-400 mt-1">Gráficos de ondas, vento e temperatura da água</p>
            </a>

            {port.cameras && port.cameras.filter((c) => c.active !== false).length > 0 && (
              <div className="my-8 flex flex-col gap-6">
                <div className="bg-gradient-to-r from-[#0d1526] to-[#1a3a5c] rounded-2xl p-5 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <div>
                      <p className="text-base font-bold font-syne text-white">📹 Veja a praia ao vivo agora</p>
                      <p className="text-xs text-slate-400">Câmeras ao Vivo em {seoName}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {port.cameras.filter((cam) => cam.active !== false).map((cam, idx) => (
                    <LiveCameraEmbed
                      key={idx}
                      title={cam.title}
                      sourceName={cam.sourceName}
                      sourceUrl={cam.sourceUrl}
                      videoId={cam.videoId}
                      channelId={cam.channelId}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* AdSense Pós-Tabela */}
            <div className="my-8 flex justify-center">
              <AdSlot slotId={AD_SLOTS.POS_TABELA} format="auto" />
            </div>

            {/* AdSense In-Content */}
            <div className="my-8 flex justify-center">
              <AdSlot slotId={AD_SLOTS.INCONTENT_RECT} format="auto" />
            </div>

            <RessacaAlert
              swellHeight={swellHeight}
              swellPeriod={swellPeriod}
              swellDirection={swellDirection}
              windSpeed={windSpeed}
              forecast={swellForecast}
              hourlyToday={hourlyToday}
              loading={seaLoading}
              error={seaError}
            />

            {/* AdSense Pós-Ressaca — usuário já engajado com o gráfico, retângulo elegível a vídeo */}
            <div className="my-8 flex justify-center">
              <AdSlot slotId={AD_SLOTS.POS_RESSACA} format="auto" />
            </div>

            <div id="graficos-meteorologia">
              <WindWaveCharts lat={port.lat} lon={port.lon} />
            </div>

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
              offsetMinutes={-180}
              weekTides={weekTides}
            />

            <BarometerCard lat={port.lat} lon={port.lon} />

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
            <div className="mt-8 p-6 bg-slate-50 border border-slat-200 rounded-xl">
              <h3 className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                <span className="text-xl">⚠️</span> Isenção de Responsabilidade
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Os dados de maré exibidos no MaréAgora têm como fonte a Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil. O MaréAgora não se responsabiliza por eventuais falhas, atrasos ou imprecisões na disponibilização desses dados pela fonte oficial, nem pelo uso que for feito das informações aqui apresentadas.
                <br className="mb-1" />
                <strong>Em nenhuma hipótese</strong> estas informações devem ser utilizadas para navegação, planejamento de operações portuárias oficiais ou qualquer atividade que envolva risco de vida ou de patrimônio. Para tais fins, consulte <strong>sempre</strong> as Tábuas das Marés oficiais e cartas náuticas certificadas pela Diretoria de Hidrografia e Navegação (DHN) da Marinha do Brasil.
                {' '}Consulte nossos <a href="/termos" className="underline hover:text-slate-800">Termos de Uso</a> para mais detalhes.
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

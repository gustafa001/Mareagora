'use client';

import { useState, useEffect } from 'react';
import { getPortBySlug, PORTS, haversineDistance } from '@/lib/ports';
import { getEventosDia, getEventosAno, getEventosRange } from '@/lib/mare';
import { portosConfig } from '@/data/porto-seo-config';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';
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
import WeatherRadarCard from '@/components/port-operations/WeatherRadarCard';
import DailyScoreCard from '@/components/DailyScoreCard';
import TideSchemaMarkup from '@/components/TideSchemaMarkup';
import { getStateSlug, getStateName } from '@/lib/states';
import TideTodayCard from '@/components/TideTodayCard';
import { useSeaConditions } from '@/hooks/useSeaConditions';
import RessacaAlert from '@/components/RessacaAlert';
import { getTideNow, formatCountdown, addDays } from '@/lib/tideNow';
import { classifyToday } from '@/lib/tideQuality';
import TideQualityBadge from '@/components/TideQualityBadge';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/lib/blog';
import { useRecentPorts } from '@/hooks/useRecentPorts';
import { ClientOnly } from '@/components/ClientOnly';
import { exportTidePdf } from '@/lib/exportTidePdf';
import { WEEKDAYS, MONTHS, buildMonthRows } from '@/lib/monthlyTideCalc';
import type { MarineHourly, WindHourly } from '@/lib/seo/sea-conditions';

/** Minutos desde 00:00 de um horário "HH:MM". */
function timeToMinutes(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

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
  /**
   * Dados de ondas/vento já buscados no SERVIDOR (page.tsx), via
   * getSeaConditionsSummary. Passados como estado inicial para o
   * WindWaveCharts não precisar refazer o fetch no primeiro render do
   * cliente — melhora LCP/CLS e evita o "flash" do skeleton de loading.
   * `null` quando a busca no servidor falhou; nesse caso o componente
   * cai para o comportamento antigo (fetch 100% client-side).
   */
  initialMarineHourly?: MarineHourly | null;
  initialWindHourly?: WindHourly | null;
  highlight?: React.ReactNode;
}

export default function PortPageContent({ slug, portDescription, blogPosts, blogStrategy, todayStr, initialMarineHourly, initialWindHourly, highlight }: PortPageContentProps) {
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

  // Maré "agora" com ontem+hoje+amanhã (fuso de Brasília): corrige a altura e o
  // enchendo/vazando entre a última maré do dia e a primeira do dia seguinte.
  const tideNow = liveNow ? getTideNow(port, liveNow) : null;
  const nextHigh = tideNow?.nextHigh ?? null;
  const nextLow = tideNow?.nextLow ?? null;

  // Última preamar que já passou: prioriza hoje; se ainda não houve nenhuma
  // e já estamos no cliente (currentMin !== null), usa a última de ontem.
  // No SSR (currentMin === null) retorna null para evitar mostrar dado de ontem
  // sob a data de hoje — o cliente recalcula corretamente após a hidratação.
  const lastHighToday = currentMin !== null
    ? [...todayTides]
      .filter(t => t.tipo === 'high' && timeToMinutes(t.hora) <= currentMin)
      .sort((a, b) => timeToMinutes(a.hora) - timeToMinutes(b.hora))
      .pop() ?? null
    : null;
  const lastHigh = lastHighToday !== null
    ? lastHighToday
    : (currentMin !== null // só no cliente, nunca no SSR
      ? ([...getEventosDia(port, addDays(todayStr, -1))]
        .filter(t => t.tipo === 'high')
        .sort((a, b) => timeToMinutes(a.hora) - timeToMinutes(b.hora))
        .pop() ?? null)
      : null);

  const tideQuality = classifyToday(todayTides, currentMin);

  const currentHeight = tideNow?.height ?? null;
  const isRising = tideNow?.rising ?? true;
  const countdownLabel = tideNow?.next ? formatCountdown(tideNow.next.minutesFromNow) : null;

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

      <section className="relative overflow-hidden hero-section pt-10 pb-6 border-b border-white/5">
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

          <div className="flex flex-col gap-2 items-center px-2 text-center pt-12 md:pt-0">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold font-syne leading-tight max-w-4xl text-white drop-shadow-md">
              Tábua de Maré {seoName} — {ano}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/85 font-normal leading-relaxed max-w-2xl px-2">
              Dados oficiais da Marinha do Brasil (DHN)
              {referenceData ? ` · Estação de referência: ${referenceData.name}` : ''}
              {` · Tábua ${ano} oficial`}
            </p>
            <p className="text-sm sm:text-base md:text-lg opacity-90 font-medium font-syne hidden sm:block text-white/90">
              {seoName} - {ano} | Estado do {port.state}
            </p>
            <p className="text-xs sm:hidden opacity-90 font-medium font-syne text-white/90">
              Estado do {port.state}
            </p>

            {/* placeholder de altura para a barra de busca (renderizada fora da section) */}
            <div className="mt-2 mb-2 h-[52px] w-full max-w-md" aria-hidden />

            <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {tideQuality && <TideQualityBadge result={tideQuality} />}
            </div>
          </div>
        </div>
      </section>

      {/* Barra de busca fora da section para que o dropdown não fique preso no
          stacking context do hero e possa sobrepor o TideTodayCard abaixo. */}
      <div className="container relative z-50 -mt-[72px] mb-[20px] flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto">
          <SearchPorts ports={PORTS} />
        </div>
      </div>

      <div className="container">
        {highlight && (
          <div className="relative z-20 -mt-10 md:-mt-12 mb-4">
            {highlight}
          </div>
        )}
        <div className={highlight ? "[&>section]:!mt-4" : ""}>
          <TideTodayCard
            portName={seoName}
            stateSlug={getStateSlug(port.state)}
            portSlug={port.slug}
            todayStr={todayStr}
            currentHeight={currentHeight}
            isRising={isRising}
            nextHigh={nextHigh}
            nextLow={nextLow}
            lastHigh={lastHigh}
            currentMin={currentMin}
            countdownLabel={countdownLabel}
          />
        </div>

        <div id="tabela-mensal" className="mt-6">
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

        <div className="mt-6">
          <ClientOnly fallback={
            <div className="grid grid-cols-2 gap-3 sm:gap-6 min-h-[110px]">
              <div className="rounded-2xl bg-white/5 animate-pulse" />
              <div className="rounded-2xl bg-white/5 animate-pulse" />
            </div>
          }>
            <SummaryCards
              nextHigh={nextHigh}
              nextLow={nextLow}
              lat={port.lat}
              lon={port.lon}
              todayTides={todayTides}
              currentMin={currentMin}
              showMainCards={false}
            />
          </ClientOnly>
        </div>

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
              todayStr={todayStr}
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
              <WindWaveCharts
                lat={port.lat}
                lon={port.lon}
                initialMarineHourly={initialMarineHourly}
                initialWindHourly={initialWindHourly}
              />
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

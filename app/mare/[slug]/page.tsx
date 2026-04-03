import { notFound } from 'next/navigation';
import { getPortBySlug, getNearbySlugs, PORTS } from '@/lib/ports';
import { getTodayTides } from '@/lib/tideUtils';
import { getPortData } from '@/lib/tideData';
import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TideChart from '@/components/TideChart';
import MonthlyTideTable from '@/components/MonthlyTideTable';
import WavesCard from '@/components/WavesCard';
import ForecastStrip from '@/components/ForecastStrip';
import ConditionsCard from '@/components/ConditionsCard';
import SummaryCards from '@/components/SummaryCards';
import DetailedForecastTable from '@/components/DetailedForecastTable';
import Footer from '@/components/Footer';
import Link from 'next/link';
import SearchPorts from '@/components/SearchPorts';
import PortStatistics from '@/components/PortStatistics';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import ShareButton from '@/components/ShareButton';
import AdBanner from '@/components/AdBanner';

function getRegionContext(region: string, state: string): string {
  const map: Record<string, string> = {
    Norte: `O litoral da região Norte, que abrange estados como ${state}, é marcado por uma das maiores amplitudes de maré do Brasil.`,
    Nordeste: `O litoral do Nordeste brasileiro, onde ${state} está inserido, apresenta características únicas de maré.`,
    Sudeste: `O litoral do Sudeste, região onde ${state} se localiza, é um dos mais movimentados do Brasil.`,
    Sul: `O litoral Sul do Brasil, onde ${state} está situado, possui marés com características bem definidas.`,
  };
  return map[region] ?? `O litoral de ${state} apresenta condições de maré características da costa brasileira.`;
}

function getActivityTips(region: string): string {
  const map: Record<string, string> = {
    Norte: 'Na região Norte, os melhores momentos para pesca são durante a virada da maré.',
    Nordeste: 'No Nordeste, as condições ideais para surfe ocorrem geralmente no período de setembro a março.',
    Sudeste: 'No Sudeste, a pesca embarcada é mais produtiva durante as marés de sizígia.',
    Sul: 'No Sul do Brasil, fique atento às previsões de frentes frias antes de planejar atividades marítimas.',
  };
  return map[region] ?? 'Consulte sempre a tábua de marés antes de qualquer atividade marítima.';
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const port = getPortBySlug(params.slug);
  if (!port) return { title: 'Porto não encontrado' };
  const ano = new Date().getFullYear();
  const url = `https://www.mareagora.com.br/mare/${params.slug}`;
  const title = `Tábua de Maré ${port.name} ${ano} — MaréAgora`;
  const description = `Horários e alturas das marés em ${port.name} (${port.state}) hoje e para os próximos dias.`;
  const ogImage = `https://www.mareagora.com.br/mare/${params.slug}/opengraph-image`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'pt_BR', siteName: 'MaréAgora', images: [{ url: ogImage, width: 1200, height: 630, alt: `Tábua de Maré ${port.name}` }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

export default async function PortPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const port = getPortBySlug(slug);
  if (!port) notFound();

  const id = port!.dataFile.replace('.json', '');
  const portData = await getPortData(id);
  const todayDay = getTodayTides(portData?.eventos ?? []);
  const todayTides: import('@/lib/tideUtils').TideEvent[] = todayDay?.mares ?? [];

  const ano = new Date().getFullYear();
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const currentTimeBR = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

  const heights = todayTides.length > 0 ? todayTides.map(t => t.altura_m) : [0];
  const maxH = Math.max(...heights);
  const minH = Math.min(...heights);
  const avgH = (maxH + minH) / 2;

  const nextHigh = todayTides.find(t => { const [h, m] = t.hora.split(':').map(Number); return (h || 0) * 60 + (m || 0) > currentMin && t.altura_m >= avgH; }) ?? todayTides.find(t => t.altura_m >= avgH) ?? null;
  const nextLow = todayTides.find(t => { const [h, m] = t.hora.split(':').map(Number); return (h || 0) * 60 + (m || 0) > currentMin && t.altura_m < avgH; }) ?? todayTides.find(t => t.altura_m < avgH) ?? null;

  const regionContext = getRegionContext(port!.region, port!.state);
  const activityTips = getActivityTips(port!.region);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.mareagora.com.br/' }, { '@type': 'ListItem', position: 2, name: 'Portos', item: 'https://www.mareagora.com.br/portos' }, { '@type': 'ListItem', position: 3, name: port!.name, item: `https://www.mareagora.com.br/mare/${slug}` }] },
      { '@type': 'WebPage', '@id': `https://www.mareagora.com.br/mare/${slug}`, url: `https://www.mareagora.com.br/mare/${slug}`, name: `Tábua de Maré ${port!.name} ${ano} — MaréAgora`, description: `Horários e alturas das marés em ${port!.name} (${port!.state}) para ${ano}.`, inLanguage: 'pt-BR', isPartOf: { '@id': 'https://www.mareagora.com.br/' } },
      { '@type': 'Dataset', name: `Tábua de Marés ${port!.name} ${ano}`, description: `Dados de maré para ${port!.name}, ${port!.state}, ${ano}. Fonte: Marinha do Brasil / DHN.`, url: `https://www.mareagora.com.br/mare/${slug}`, license: 'https://creativecommons.org/licenses/by/4.0/', creator: { '@type': 'Organization', name: 'Marinha do Brasil — DHN', url: 'https://www.marinha.mil.br' }, temporalCoverage: `${ano}`, spatialCoverage: `${port!.name}, ${port!.state}, Brasil`, inLanguage: 'pt-BR' },
    ],
  };

  return (
    <main className="min-h-screen pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} suppressHydrationWarning />

      <NavBar />

      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container relative z-30 text-white text-center pt-24 md:pt-16">
          <div className="flex flex-col gap-3 items-center px-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl">
              Tábua de Maré {port!.name} — {ano}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl opacity-90 font-medium font-syne hidden sm:block">
              {port!.name} - {ano} | Estado do {port!.state}
            </p>
            <p className="text-sm opacity-90 font-medium font-syne sm:hidden">Estado do {port!.state}</p>
            <div className="mt-6 w-full max-w-md">
              <SearchPorts ports={PORTS} />
            </div>
            <p className="mt-4 text-xs opacity-70">Horário local: {currentTimeBR}</p>
            <div className="mt-2">
              <ShareButton portName={port!.name} slug={slug} />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <SummaryCards nextHigh={nextHigh} nextLow={nextLow} lat={port!.lat} lon={port!.lon} />

        {/* Anuncio 1 — abaixo dos cards de resumo */}
        <AdBanner slot="7494638408" format="horizontal" className="my-6" />

        <div className="mt-6 flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-8">
          <div className="flex flex-col gap-8">
            <div className="classic-card">
              <TideChart tides={todayTides} />
            </div>

            <MonthlyTideTable eventos={portData?.eventos ?? []} portName={port!.name} lat={port!.lat} lon={port!.lon} />

            {/* Anuncio 2 — entre tabua mensal e previsao detalhada */}
            <AdBanner slot="7494638408" format="auto" />

            <DetailedForecastTable lat={port!.lat} lon={port!.lon} todayTides={todayTides} />

            <ActivityRecommendations todayTides={todayTides} nextHigh={nextHigh} nextLow={nextLow} waveHeight={2.5} />

            <PortStatistics eventos={portData?.eventos ?? []} portName={port!.name} />

            {/* Anuncio 3 — antes do bloco de texto SEO */}
            <AdBanner slot="7494638408" format="horizontal" />

            <section className="classic-card prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold mb-4 font-syne tracking-tight">
                Tábua de Maré em {port!.name} — {ano}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                A tábua de maré de <strong>{port!.name}</strong> é uma ferramenta essencial para pescadores,
                surfistas, mergulhadores, caiaqueiros e navegadores que frequentam o litoral de{' '}
                <strong>{port!.state}</strong>. Os dados apresentados pelo MaréAgora são extraídos diretamente
                das tábuas oficiais publicadas pelo <strong>Centro de Hidrografia da Marinha do Brasil (CHM)</strong>{' '}
                para o ano de <strong>{ano}</strong>, garantindo a precisão e confiabilidade das informações.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h3 className="text-base font-bold mb-2 text-gray-800">Como usar a tabua de mare?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    A tábua indica os horários exatos de <strong>preamar</strong> (maré alta) e{' '}
                    <strong>baixamar</strong> (maré baixa) ao longo do dia, com as respectivas alturas em metros.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2 text-gray-800">O que e o Nivel Medio?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    O nível médio ({portData?.nivel_medio ?? '--'} m) é a referência central do gráfico de marés.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold mt-8 mb-3 text-gray-800">
                Caracteristicas das Mares em {port!.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{regionContext}</p>

              <h3 className="text-lg font-bold mt-8 mb-3 text-gray-800">
                Dicas para Atividades Maritimas em {port!.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{activityTips}</p>

              <h3 className="text-lg font-bold mt-8 mb-3 text-gray-800">Fonte dos Dados</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Todos os horários e alturas de maré do MaréAgora para <strong>{port!.name}</strong> são baseados
                nas publicações oficiais da <strong>Diretoria de Hidrografia e Navegação (DHN)</strong> da Marinha
                do Brasil.
              </p>
            </section>
          </div>

          <aside className="flex flex-col gap-8">
            <WavesCard lat={port!.lat} lon={port!.lon} />
            <ForecastStrip lat={port!.lat} lon={port!.lon} />
            <ConditionsCard lat={port!.lat} lon={port!.lon} />

            {/* Anuncio 4 — sidebar */}
            <AdBanner slot="7494638408" format="rectangle" />

            <div className="classic-card">
              <h3 className="card-title mb-4">Cidades Proximas</h3>
              <div className="flex flex-col gap-3">
                {getNearbySlugs(port!).map(p => (
                  <Link key={p.slug} href={`/mare/${p.slug}`} className="group flex flex-col p-3.5 rounded-xl border border-gray-100 hover:border-[#2a68f6] hover:bg-gray-50 transition-all">
                    <span className="font-bold text-gray-800 group-hover:text-[#2a68f6]">{p.name}</span>
                    <span className="text-xs text-gray-400 capitalize">{p.state} • Ver tábua de maré</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}

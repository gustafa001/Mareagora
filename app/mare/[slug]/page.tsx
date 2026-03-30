import { notFound } from 'next/navigation';
import { getPortBySlug, getNearbySlugs } from '@/lib/ports';
import { getTodayTides } from '@/lib/tideUtils';
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

// ─── helpers de texto por região ──────────────────────────────────────────────

function getRegionContext(region: string, state: string): string {
  const map: Record<string, string> = {
    Norte: `O litoral da região Norte, que abrange estados como ${state}, é marcado por uma das maiores amplitudes de maré do Brasil. As marés amazônicas são influenciadas diretamente pela morfologia dos estuários e pela descarga dos grandes rios, podendo variar vários metros entre a preamar e a baixamar. Esse comportamento extremo exige atenção redobrada de pescadores, navegadores e moradores ribeirinhos.`,
    Nordeste: `O litoral do Nordeste brasileiro, onde ${state} está inserido, apresenta características únicas de maré devido à posição geográfica próxima à linha do Equador. As variações de maré são moderadas, com influência direta dos ventos alísios e das correntes do Atlântico Sul. A região é famosa por praias de águas mornas, recifes de coral e condições favoráveis para mergulho e kitesurf em determinados períodos do ano.`,
    Sudeste: `O litoral do Sudeste, região onde ${state} se localiza, é um dos mais movimentados do Brasil — tanto em termos de tráfego marítimo quanto em atividades recreativas. As marés dessa região são do tipo semidiurno, com dois ciclos completos de preamar e baixamar a cada 24 horas. A variação costuma ser moderada, mas pode ser amplificada em baías e enseadas fechadas, como ocorre em Angra dos Reis e na Baía de Guanabara.`,
    Sul: `O litoral Sul do Brasil, onde ${state} está situado, possui marés com características bem definidas e influência marcante dos sistemas de frentes frias vindas do sul do continente. As ondas de tempestade (ressacas) são frequentes no inverno e podem elevar temporariamente o nível do mar acima do previsto na tábua oficial. Surfe, pesca embarcada e navegação costeira são atividades muito praticadas na região.`,
  };
  return map[region] ?? `O litoral de ${state} apresenta condições de maré características da costa brasileira, com variações influenciadas pela posição geográfica e pela morfologia costeira local.`;
}

function getActivityTips(region: string): string {
  const map: Record<string, string> = {
    Norte: 'Na região Norte, os melhores momentos para pesca são durante a virada da maré — especialmente na baixamar, quando os bancos de areia ficam expostos e concentram os peixes. Evite navegar em canais estreitos durante a preamar máxima sem conhecimento da área.',
    Nordeste: 'No Nordeste, as condições ideais para surfe ocorrem geralmente no período de setembro a março, quando as ondulações do Atlântico Norte chegam com mais força. Para mergulho nos recifes, prefira os horários de maré alta, que garantem maior visibilidade e profundidade segura sobre as formações coralinas.',
    Sudeste: 'No Sudeste, a pesca embarcada é mais produtiva durante as marés de sizígia (lua cheia e lua nova), quando a amplitude é maior e o movimento da água atrai mais peixes. Para surfe, as melhores ondas costumam aparecer com mar de sudeste combinado com maré baixa a média.',
    Sul: 'No Sul do Brasil, fique atento às previsões de frentes frias antes de planejar atividades marítimas. O vento sul pode elevar o nível do mar rapidamente. Para pesca em costões e pedras, opere sempre com maré baixa e nunca vire as costas para o mar.',
  };
  return map[region] ?? 'Consulte sempre a tábua de marés antes de qualquer atividade marítima e combine com a previsão de vento e ondas disponível na plataforma.';
}

// ─── helper: tábua do dia seguinte ────────────────────────────────────────────

function getTomorrowTides(portData: { eventos: any[] } | null) {
  try {
    if (!portData?.eventos?.length) return [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${yyyy}-${mm}-${dd}`;
    return (portData.eventos ?? []).filter((e: any) => e?.data === tomorrowStr);
  } catch {
    return [];
  }
}

function formatTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const port = getPortBySlug(slug);
  if (!port) return { title: 'Porto não encontrado' };

  const ano = new Date().getFullYear();
  const url = `https://www.mareagora.com.br/mare/${slug}`;
  const title = `Tábua de Maré ${port.name} ${ano} — MaréAgora`;
  const description = `Horários e alturas das marés em ${port.name} (${port.state}) hoje e para os próximos dias. Dados oficiais da Marinha do Brasil + ondas e vento em tempo real.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'MaréAgora', locale: 'pt_BR', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function PortPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const port = getPortBySlug(slug);
  if (!port) notFound();

  const id = port.dataFile.replace('.json', '');
  const portData = await getPortData(id);
  const { tides: todayTides } = getTodayTides(portData ?? { eventos: [] });

  const ano = new Date().getFullYear();
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  // ── Guard: evita Math.max/min de array vazio ──
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

  // ── tábua de amanhã ──
  const tomorrowTides = getTomorrowTides(portData);
  const tomorrowLabel = formatTomorrowDate();

  // ── textos dinâmicos ──
  const regionContext = getRegionContext(port.region, port.state);
  const activityTips = getActivityTips(port.region);

  // ── JSON-LD ──
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.mareagora.com.br/' },
          { '@type': 'ListItem', position: 2, name: port.name, item: `https://www.mareagora.com.br/mare/${slug}` },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `https://www.mareagora.com.br/mare/${slug}`,
        url: `https://www.mareagora.com.br/mare/${slug}`,
        name: `Tábua de Maré ${port.name} ${ano} — MaréAgora`,
        description: `Horários e alturas das marés em ${port.name} (${port.state}) para ${ano}.`,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': 'https://www.mareagora.com.br/' },
      },
    ],
  };

  return (
    <main className="min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />

      <NavBar />

      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container relative z-10 text-white text-center pt-24 md:pt-16">
          <div className="flex flex-col gap-3 items-center px-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-syne leading-tight max-w-4xl">
              Tábua de Maré — {port.name}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl opacity-90 font-medium font-syne hidden sm:block">
              {port.name} - {ano} | Estado do {port.state}
            </p>
            <p className="text-sm opacity-90 font-medium font-syne sm:hidden">
              Estado do {port.state}
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs sm:text-sm opacity-80 font-mono">
              <span>Lat: {port.lat.toFixed(4)}°</span>
              <span>Lon: {port.lon.toFixed(4)}°</span>
              <span>Fuso: UTC-3</span>
              <span>Nível Médio: {portData?.nivel_medio ?? '--'} m</span>
            </div>
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

            <div className="classic-card overflow-hidden">
              <h3 className="card-title">Tabela de Marés</h3>
              <TideTable tides={todayTides} currentMin={currentMin} />
            </div>

            <DetailedForecastTable lat={port.lat} lon={port.lon} todayTides={todayTides} />

            {/* ── Tábua do Dia Seguinte ── */}
            {tomorrowTides.length > 0 && (
              <div className="classic-card overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="card-title">Tabela de Marés — Amanhã</h3>
                  <span className="text-xs text-gray-400 capitalize font-medium">{tomorrowLabel}</span>
                </div>
                <TideTable tides={tomorrowTides} currentMin={-1} />
              </div>
            )}

            {/* ── Bloco de conteúdo editorial ── */}
            <section className="classic-card prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold mb-4 font-syne tracking-tight">
                Tábua de Maré em {port.name} — {ano}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                A tábua de maré de <strong>{port.name}</strong> é uma ferramenta essencial para pescadores,
                surfistas, mergulhadores, caiaqueiros e navegadores que frequentam o litoral de{' '}
                <strong>{port.state}</strong>. Os dados apresentados pelo MaréAgora são extraídos diretamente
                das tábuas oficiais publicadas pelo <strong>Centro de Hidrografia da Marinha do Brasil (CHM)</strong>{' '}
                para o ano de <strong>{ano}</strong>, garantindo a precisão e confiabilidade das informações.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h3 className="text-base font-bold mb-2 text-gray-800">🎣 Como usar a tábua de maré?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    A tábua indica os horários exatos de <strong>preamar</strong> (maré alta) e{' '}
                    <strong>baixamar</strong> (maré baixa) ao longo do dia, com as respectivas alturas em metros.
                    Para a pesca, os momentos de virada — quando a maré muda de direção — costumam ser os mais
                    produtivos. Para surf e mergulho, o ideal varia conforme o local e o tipo de onda ou fundo.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2 text-gray-800">📏 O que é o Nível Médio?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    O nível médio ({portData?.nivel_medio ?? '--'} m) é a referência central do gráfico de marés.
                    Representa a altura média da superfície do mar ao longo do tempo. Valores acima dele indicam
                    maré subindo em direção à preamar; abaixo, a maré está descendo em direção à baixamar.
                    É útil para avaliar se há profundidade suficiente para atracar embarcações com segurança.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold mt-8 mb-3 text-gray-800">
                🌊 Características das Marés em {port.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {regionContext}
              </p>

              <h3 className="text-lg font-bold mt-8 mb-3 text-gray-800">
                💡 Dicas para Atividades Marítimas em {port.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {activityTips}
              </p>

              <h3 className="text-lg font-bold mt-8 mb-3 text-gray-800">
                📡 Fonte dos Dados
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Todos os horários e alturas de maré do MaréAgora para <strong>{port.name}</strong> são baseados
                nas publicações oficiais da <strong>Diretoria de Hidrografia e Navegação (DHN)</strong> da Marinha
                do Brasil. Os dados de ondas, vento e precipitação são fornecidos em tempo real pela API da{' '}
                <strong>Open-Meteo</strong>, atualizada a cada poucas horas com modelos meteorológicos globais.
                O MaréAgora é uma ferramenta de apoio — para navegação profissional, sempre consulte as
                publicações oficiais da Marinha.
              </p>
            </section>
            {/* ── fim do bloco editorial ── */}

          </div>

          <aside className="flex flex-col gap-8">
            <WavesCard lat={port.lat} lon={port.lon} />
            <ForecastStrip lat={port.lat} lon={port.lon} />
            <ConditionsCard lat={port.lat} lon={port.lon} />

            <div className="classic-card">
              <h3 className="card-title mb-4">📍 Cidades Próximas</h3>
              <div className="flex flex-col gap-3">
                {getNearbySlugs(port).map(p => (
                  <Link
                    key={p.slug}
                    href={`/mare/${p.slug}`}
                    className="group flex flex-col p-3.5 rounded-xl border border-gray-100 hover:border-[#2a68f6] hover:bg-gray-50 transition-all"
                  >
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

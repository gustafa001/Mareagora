import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPortBySlug, getAllSlugs, getReferencePort, isEstimatedLocation, PORTS } from '@/lib/ports';
import { getStateSlug, getStateName } from '@/lib/states';
import type { Metadata } from 'next';
import PortPageContent from '@/components/PortPageContent';
import EstimateNotice from '@/components/EstimateNotice';
import PortoFAQ from '@/components/PortoFAQ';
import PortosProximos from '@/components/PortosProximos';
import ExploreCTA from '@/components/ExploreCTA';
import { portosConfig, categoryDefaults } from '@/data/porto-seo-config';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';
import { getPostsByPort } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';
import { getPortoDescription } from '@/lib/porto-descriptions';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import { generateSEOContent, getSolunarPeriodos } from '@/lib/seo/content-generator';
import { getSeaConditionsSummary } from '@/lib/seo/sea-conditions';
import { getEventosDia } from '@/lib/mare';
import { calcFishingScore } from '@/lib/fishingScore';
import SeoOverviewTicker from '@/components/SeoOverviewTicker';
import TideHighlight from '@/components/TideHighlight';
import TideOutlook from '@/components/TideOutlook';

export const revalidate = 21600; // regenera a página a cada 6h (ISR), evita data congelada do build — reduzido de 1h p/ diminuir ISR Writes/CPU no free tier

export async function generateStaticParams() {
  return PORTS.map(port => ({
    slug: getStateSlug(port.state),
    cidade: port.slug,
  }));
}

// Linha com as marés do dia (BRT) para abrir a meta description: dado concreto
// aumenta o CTR frente ao texto genérico dos concorrentes. Sem eventos -> null.
function buildTideSnippet(
  port: Parameters<typeof getEventosDia>[0],
  seoName: string,
  uf: string,
  highlight?: 'piscinas-naturais' | 'amplitude'
): string | null {
  try {
    const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    const eventos = getEventosDia(port, hoje);
    if (!eventos || eventos.length === 0) return null;
    const fmt = (e: { hora: string; altura_m: number }) => `${e.hora} (${e.altura_m.toFixed(1).replace('.', ',')} m)`;
    const altas = eventos.filter(e => e.tipo === 'high').map(fmt);
    const baixas = eventos.filter(e => e.tipo === 'low').map(fmt);
    const dd = `${hoje.slice(8, 10)}/${hoje.slice(5, 7)}`;

    if (highlight === 'piscinas-naturais') {
      if (baixas.length === 0) return null;
      return `Maceió (${uf}) em ${dd}: baixamar hoje às ${baixas.join(' e ')} (piscinas naturais da Pajuçara).`;
    }

    if (highlight === 'amplitude') {
      const alturas = eventos.map(e => e.altura_m);
      if (alturas.length < 2) return null;
      const min = Math.min(...alturas);
      const max = Math.max(...alturas);
      const amp = max - min;
      return `São Luís (${uf}) em ${dd}: amplitude de ${amp.toFixed(2).replace('.', ',')} m (de ${min.toFixed(2).replace('.', ',')} m a ${max.toFixed(2).replace('.', ',')} m).`;
    }

    if (altas.length === 0 && baixas.length === 0) return null;
    const partes: string[] = [];
    if (altas.length) partes.push(`maré alta ${altas.join(', ')}`);
    if (baixas.length) partes.push(`baixa ${baixas.join(', ')}`);
    return `Maré em ${seoName} (${uf}) em ${dd}: ${partes.join('; ')}.`;
  } catch {
    return null;
  }
}

function cutAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const i = cut.lastIndexOf(' ');
  return (i > 60 ? cut.slice(0, i) : cut).replace(/[,;:\s—-]+$/, '') + '…';
}

// Locais derivados (sem marégrafo próprio) não podem se apresentar como tábua oficial:
// troca o enquadramento e remove selos de fonte/dados oficiais herdados do texto configurado.
function toEstimatedWording(text: string): string {
  return text
    .replace(/\s*(?:Fonte oficial|Fonte):\s*Marinha do Brasil\.?/gi, '')
    .replace(/\s*Dados oficiais da Marinha do Brasil\.?/gi, '')
    .replace(/^Tábua de marés de /i, 'Previsão estimada de marés de ')
    .trim();
}

export async function generateMetadata({ params }: { params: { slug: string, cidade: string } }): Promise<Metadata> {
  const estado = params.slug;
  const slug = params.cidade;
  const port = getPortBySlug(slug);
  if (!port || getStateSlug(port.state) !== estado) return { title: 'Local não encontrado' };

  const config = portosConfig[slug];
  const ano = new Date().getFullYear();
  const url = `https://mareagora.com.br/mare/${estado}/${slug}`;
  const ogImage = `https://mareagora.com.br/opengraph-image.png`;

  const isCommercial = !port.referencePortSlug && (port.name.toLowerCase().includes('porto') || port.name.toLowerCase().includes('terminal') || config?.category === 'industrial');

  // Portos/terminais comerciais usam o nome do terminal no título (bate com a busca do usuário);
  // praias continuam usando o nome da cidade.
  const seoName = config?.seoName ?? (isCommercial ? port.name : port.cityName);

  // "hoje" é a intenção dominante nas buscas reais (Search Console), então vira o padrão
  // de todas as páginas sem sufixo customizado.
  const defaultSuffix = 'Maré Alta e Baixa Hoje';

  const estimated = isEstimatedLocation(port);
  const estimatedRefName = estimated ? (getReferencePort(port)?.cityName ?? null) : null;

  const defaultDesc = isCommercial
    ? `Tábua de marés de ${seoName}, ${port.state} para ${ano}. Previsão de maré alta e baixa, horários e coeficientes oficiais com dados da Marinha do Brasil (CHM).`
    : estimated
      ? `Previsão estimada de marés de ${seoName}, ${port.state} para ${ano}${estimatedRefName ? `, a partir da estação de ${estimatedRefName}` : ''}. Horários de maré alta e baixa para surf, pesca e atividades na praia.`
      : `Tábua de marés de ${seoName}, ${port.state} para ${ano}. Horários de maré alta e baixa para surf, pesca e atividades na praia. Fonte: Marinha do Brasil.`;

  // Sufixo curto para o título caber em 60 caracteres junto com keyword + ano.
  // Remove "Oficiais" e ano repetido no sufixo, pois o base já injeta o ano.
  // Título sem o sufixo "| MaréAgora" (brand segue apenas em OG/siteName) para evitar truncamento pelo Google.
  const suffix = (config?.titleSuffix ?? defaultSuffix)
    .replace(/\s+Oficiais$/i, '')
    .replace(/\s{1,2}\d{4}$/i, '')
    .trim();

  const base = `Tábua de Maré ${seoName} ${ano}`;
  const SEP = ' — ';

  // Seleciona o melhor sufixo completo que cabe no limite de 60 caracteres,
  // sem truncar palavras no meio (evita títulos cortados como "Maré Alta e").
  // Se o sufixo configurado/padrão não couber, testa a primeira parte do sufixo
  // (antes do travessão) e alternativas progressivamente mais curtas ('Horários de Hoje', 'Maré Hoje').
  let title = base;
  if (base.length > 60) {
    title = base.slice(0, 60).trimEnd();
  } else {
    const candidates = Array.from(new Set(
      [suffix, suffix.split(SEP)[0].trim(), 'Horários de Hoje', 'Maré Hoje'].filter(Boolean)
    ));
    const fit = candidates.find(s => `${base}${SEP}${s}`.length <= 60);
    if (fit) title = `${base}${SEP}${fit}`;
  }

  const baseDescription = config?.description
    ? (estimated ? toEstimatedWording(config.description) : config.description)
    : defaultDesc;
  const rawTideSnippet = buildTideSnippet(port, seoName, port.state, config?.highlight);
  const tideSnippet = rawTideSnippet && estimated
    ? rawTideSnippet.replace(/^Maré em /, 'Maré estimada em ')
    : rawTideSnippet;
  const description = tideSnippet
    ? cutAtWord(`${tideSnippet} ${baseDescription}`, 200)
    : baseDescription;

  const keywords = config?.keywords
    ?? [
      `maré ${seoName.toLowerCase()}`,
      `tabua maré ${seoName.toLowerCase()} ${ano}`,
      `tábua de maré ${seoName.toLowerCase()}`,
    ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'MaréAgora',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Tábua de Maré ${seoName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PortPage({ params }: { params: { slug: string, cidade: string } }) {
  const estado = params.slug;
  const slug = params.cidade;
  const port = getPortBySlug(slug);
  if (!port || getStateSlug(port.state) !== estado) notFound();

  const portDescription = getPortoDescription(slug);
  const ano = new Date().getFullYear();
  // Data de "hoje" no fuso de Brasília, calculada uma única vez aqui no
  // servidor e repassada como prop (ver comentário em PortPageContent.tsx).
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

  const config = portosConfig[slug];
  const categoria = config?.category ?? 'turismo';

  const { posts: blogPosts, strategy: blogStrategy } = getPostsByPort(port);

  const isCommercial = !port.referencePortSlug && (port.name.toLowerCase().includes('porto') || port.name.toLowerCase().includes('terminal') || config?.category === 'industrial');
  const seoName = config?.seoName ?? (isCommercial ? port.name : port.cityName);

  // Data de hoje no fuso de Brasília (para AI Overview, SEO) — mesma lógica
  // do todayStr acima, evitando que o dia UTC (à frente de -03:00) desloque a data.
  const dataHoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

  // NOVO: busca ondas/vento no servidor, com o mesmo revalidate da página,
  // para que o texto de SEO e o FAQ (JSON-LD) tragam números reais no HTML
  // já entregue a crawlers/bots de IA — sem depender de fetch client-side.
  // Em caso de falha (API fora do ar etc.), `sea` fica null e o gerador
  // cai para o texto genérico antigo, sem quebrar a página.
  const seaData = await getSeaConditionsSummary(port.lat, port.lon, revalidate);

  // Score de pesca "agora" calculado no SERVIDOR, com as mesmas regras do
  // DailyScoreCard (lib/fishingScore.ts) e os dados de ondas/vento da hora
  // atual já buscados acima. Assim o "Pesca X/10" entra no HTML pré-renderizado
  // (texto de SEO + FAQ JSON-LD) sem depender de JavaScript — elegível a AI
  // Overview. Se falta dado de mar/vento, fica null e o texto cai pro antigo.
  let fishing: { score: number; label: string } | null = null;
  if (seaData) {
    const brNow = new Date();
    const brHour = Number(brNow.toLocaleTimeString('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit' }));
    const brMinute = Number(brNow.toLocaleTimeString('en-GB', { timeZone: 'America/Sao_Paulo', minute: '2-digit' }));
    const wh = seaData.marineHourly.wave_height?.[brHour];
    const wp = seaData.marineHourly.wave_period?.[brHour];
    const ws = seaData.windHourly.windspeed_10m?.[brHour];
    if (typeof wh === 'number' && typeof ws === 'number') {
      const eventos = getEventosDia(port, dataHoje);
      // Mesmos períodos solunares do content-generator (fonte única) — o bônus
      // solunar do score passa a usar a Teoria Solunar real, como o DailyScoreCard.
      const periodos = getSolunarPeriodos(port, dataHoje);
      const pesca = calcFishingScore(
        eventos,
        { waveHeight: wh, wavePeriod: wp ?? 0, windSpeed: ws },
        -180, // Brasília (UTC-3), mesmo fuso usado no resto da página
        brHour * 60 + brMinute,
        undefined, // tradutor padrão (PT_REASONS)
        periodos
      );
      fishing = { score: pesca.score, label: pesca.label };
    }
  }

  const { text: seoText, faq: seoFaq } = generateSEOContent(port, dataHoje, seaData?.summary ?? null, fishing);

  const referencePort = port.referencePortSlug ? getPortBySlug(port.referencePortSlug) : null;
  const referencePortName = referencePort ? (referencePort.cityName || referencePort.name) : undefined;

  return (
    <>
      <SchemaGenerator
        port={port}
        type={categoria === 'industrial' || port.name.toLowerCase().includes('porto') ? 'Port' : 'Beach'}
        url={`https://mareagora.com.br/mare/${estado}/${slug}`}
        title={`Tábua de Maré ${seoName} ${ano}`}
        description={`Horários e alturas das marés em ${seoName} (${port.state}) para ${ano}.`}
        faq={seoFaq}
        referencePortName={referencePortName}
      />

      {/* Resumo Gerado (AI Overview Target) — exibido como slider, texto completo preservado no HTML */}
      <SeoOverviewTicker
        title={`Visão Geral Hoje (${dataHoje.split('-').reverse().join('/')})`}
        text={seoText}
      />
      {/* Aviso de previsão estimada (só locais sem marégrafo próprio). Fica fora de
          PortPageContent para não mexer na hidratação já corrigida. */}
      <EstimateNotice port={port} />
      <PortPageContent
        slug={slug}
        portDescription={portDescription}
        blogPosts={blogPosts}
        blogStrategy={blogStrategy}
        todayStr={todayStr}
        // NOVO: dados já buscados no servidor, repassados como estado inicial
        // para o WindWaveCharts/useSeaConditions não precisarem refazer o
        // fetch no primeiro render do cliente (ver PortPageContent.tsx).
        initialMarineHourly={seaData?.marineHourly ?? null}
        initialWindHourly={seaData?.windHourly ?? null}
        highlight={config?.highlight ? (
          <TideHighlight
            port={port}
            todayStr={todayStr}
            type={config.highlight}
          />
        ) : undefined}
      />
      <div className="container pb-16">
        {config?.highlight && (
          <TideOutlook port={port} todayStr={todayStr} type={config.highlight} seoName={seoName} />
        )}
        <PortoFAQ slug={slug} categoria={categoria} />
        <PortosProximos slug={slug} />
        <ExploreCTA />

        <div className="mt-8 text-center">
          <Link href={`/embed?porto=${port.slug}`} className="text-sm text-blue-600 hover:underline">
            Coloque a maré de {port.cityName} no seu site (widget grátis)
          </Link>
        </div>

        {/* AdSense Rodapé */}
        <div className="mt-12 flex justify-center">
          <AdSlot slotId={AD_SLOTS.PREFOOTER} format="horizontal" />
        </div>
      </div>
    </>
  );
}

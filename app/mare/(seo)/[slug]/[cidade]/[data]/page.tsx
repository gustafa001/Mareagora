import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPortBySlug, getReferencePort, isEstimatedLocation } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';
import { portosConfig } from '@/data/porto-seo-config';
import { getEventosDia } from '@/lib/mare';
import { getMoonPhase } from '@/lib/tideUtils';
import {
  getAvaliacaoSolunar,
  getIdadeLua,
  inicioDiaLocal,
} from '@/lib/solunar';
import { getSolunarPeriodos } from '@/lib/seo/content-generator';
import {
  DAY_PAGE_INDEXABLE_SLUGS,
  buildDiaFaq,
  buildDiaMetaDescription,
  buildDiaResumo,
  getDiaMare,
} from '@/lib/tideDay';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import EstimateNotice from '@/components/EstimateNotice';
import PortosProximos from '@/components/PortosProximos';

// Mesmo ritmo da página do porto (6h). Sem generateStaticParams: as páginas por
// dia nascem sob demanda (ISR) para não pesar build nem ISR Writes no free tier.
export const revalidate = 21600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

type Params = { slug: string; cidade: string; data: string };

function resolvePort(params: Params) {
  const port = getPortBySlug(params.cidade);
  if (!port || getStateSlug(port.state) !== params.slug) return null;
  return port;
}

function seoNameOf(port: NonNullable<ReturnType<typeof getPortBySlug>>) {
  const config = portosConfig[port.slug];
  const isCommercial =
    !port.referencePortSlug &&
    (port.name.toLowerCase().includes('porto') ||
      port.name.toLowerCase().includes('terminal') ||
      config?.category === 'industrial');
  return config?.seoName ?? (isCommercial ? port.name : port.cityName);
}

function fmtHora(d: Date): string {
  return d.toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const port = resolvePort(params);
  if (!port) return { title: 'Local não encontrado', robots: { index: false, follow: false } };

  const dia = getDiaMare(port, params.data);
  if (!dia) return { title: 'Data não disponível', robots: { index: false, follow: false } };

  const seoName = seoNameOf(port);
  const url = `https://mareagora.com.br/mare/${params.slug}/${params.cidade}/${params.data}`;
  const title = `Maré ${seoName} ${dia.dataBR} (${dia.diaSemana}) — Horários`;
  const description = buildDiaMetaDescription(seoName, port.state, dia);
  const indexable = DAY_PAGE_INDEXABLE_SLUGS.has(port.slug);

  return {
    title,
    description,
    alternates: { canonical: url },
    // noindex até o porto ser liberado em DAY_PAGE_INDEXABLE_SLUGS; "follow" mantém
    // o Google descobrindo os links ←/→ sem indexar a página ainda.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'MaréAgora',
      images: [{ url: 'https://mareagora.com.br/opengraph-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function DiaPage({ params }: { params: Params }) {
  const port = resolvePort(params);
  if (!port) notFound();

  const dia = getDiaMare(port, params.data);
  if (!dia) notFound();

  const seoName = seoNameOf(port);
  const portUrl = `/mare/${params.slug}/${params.cidade}`;
  const dayUrl = (d: string) => `${portUrl}/${d}`;

  const dateObj = new Date(`${dia.data}T12:00:00Z`);
  const faseLua = getMoonPhase(dateObj).name;
  const faseLuaTxt = faseLua.toLowerCase().startsWith('lua ') ? faseLua : `lua ${faseLua}`;

  // Solunar: mesmo motor da página do porto.
  const periodos = getSolunarPeriodos(port, dia.data);
  const eventos = getEventosDia(port, dia.data);
  const solunar = getAvaliacaoSolunar(getIdadeLua(inicioDiaLocal(dia.data)), periodos, eventos);
  const maiores = periodos.filter(p => p.tipo === 'maior');
  const menores = periodos.filter(p => p.tipo === 'menor');

  const resumo = buildDiaResumo(seoName, port.state, dia, faseLuaTxt);
  const faq = buildDiaFaq(seoName, dia);

  const referencePort = port.referencePortSlug ? getPortBySlug(port.referencePortSlug) : null;
  const referencePortName = referencePort
    ? referencePort.cityName || referencePort.name
    : (isEstimatedLocation(port) ? getReferencePort(port)?.cityName : undefined);

  const categoria = portosConfig[port.slug]?.category;
  const schemaType =
    categoria === 'industrial' || port.name.toLowerCase().includes('porto') ? 'Port' : 'Beach';

  return (
    <>
      <SchemaGenerator
        port={port}
        type={schemaType}
        url={`https://mareagora.com.br${dayUrl(dia.data)}`}
        title={`Maré ${seoName} ${dia.dataBR}`}
        description={`Horários e alturas das marés em ${seoName} (${port.state}) em ${dia.dataBR}.`}
        faq={faq}
        referencePortName={referencePortName}
      />

      <EstimateNotice port={port} />

      <main className="container py-8">
        <nav className="text-sm mb-4">
          <Link href={portUrl} className="text-blue-600 hover:underline">
            ← Tábua de maré {seoName} {dia.data.slice(0, 4)} (mês completo)
          </Link>
        </nav>

        <h1 className="text-3xl font-bold font-syne text-slate-800 mb-2">
          Maré em {seoName} em {dia.dataBR} ({dia.diaSemana})
        </h1>
        <p className="text-slate-600 mb-6">{resumo}</p>

        {/* Navegação entre dias (só dentro da janela de hoje até +30 dias) */}
        <div className="flex items-center justify-between mb-6 text-sm font-medium">
          {dia.anterior ? (
            <Link href={dayUrl(dia.anterior)} className="text-blue-600 hover:underline">
              ← {dia.anterior.split('-').reverse().slice(0, 2).join('/')}
            </Link>
          ) : <span />}
          {dia.proximo ? (
            <Link href={dayUrl(dia.proximo)} className="text-blue-600 hover:underline">
              {dia.proximo.split('-').reverse().slice(0, 2).join('/')} →
            </Link>
          ) : <span />}
        </div>

        {/* As marés do dia */}
        <section aria-labelledby="mares-do-dia" className="mb-8">
          <h2 id="mares-do-dia" className="text-xl font-bold font-syne mb-3">
            Marés de {dia.dataBR}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dia.mares.map(m => (
              <div key={`${m.hora}-${m.alta ? 'a' : 'b'}`} className="classic-card text-center">
                <div className={m.alta ? 'text-blue-600 font-bold' : 'text-slate-500 font-bold'}>
                  {m.alta ? '▲ Preamar' : '▼ Baixamar'}
                </div>
                <div className="text-2xl font-bold">{m.hora}</div>
                <div className="text-slate-600">{m.altura_m.toFixed(2).replace('.', ',')} m</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Horários de Brasília. Alturas em relação ao nível de redução do porto de referência.
          </p>
        </section>

        {/* Coeficiente, sol e lua */}
        <section aria-labelledby="sol-lua" className="mb-8">
          <h2 id="sol-lua" className="text-xl font-bold font-syne mb-3">Coeficiente, sol e lua</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <li className="classic-card">
              <div className="text-xs text-slate-500">Coeficiente</div>
              <div className="text-2xl font-bold">{dia.coef ?? '—'}</div>
            </li>
            <li className="classic-card">
              <div className="text-xs text-slate-500">Nascer do sol</div>
              <div className="text-2xl font-bold">{dia.sunrise}</div>
            </li>
            <li className="classic-card">
              <div className="text-xs text-slate-500">Pôr do sol</div>
              <div className="text-2xl font-bold">{dia.sunset}</div>
            </li>
            <li className="classic-card">
              <div className="text-xs text-slate-500">Lua</div>
              <div className="text-lg font-bold">{faseLua}</div>
            </li>
          </ul>
        </section>

        {/* Solunar / pesca do dia */}
        <section aria-labelledby="pesca-do-dia" className="mb-8">
          <h2 id="pesca-do-dia" className="text-xl font-bold font-syne mb-3">
            Pesca em {seoName} em {dia.dataBR}
          </h2>
          <p className="text-slate-600 mb-3">
            Qualidade solunar do dia: {solunar.estrelas}/5
            {solunar.destaque ? ', com período maior coincidindo com a maré cheia (janela especialmente favorável)' : ''}.
          </p>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="classic-card">
              <div className="font-semibold mb-1">Períodos maiores (2h)</div>
              {maiores.map(p => (
                <div key={p.centro.toISOString()}>{fmtHora(p.inicio)} – {fmtHora(p.fim)}</div>
              ))}
            </div>
            <div className="classic-card">
              <div className="font-semibold mb-1">Períodos menores (1h)</div>
              {menores.map(p => (
                <div key={p.centro.toISOString()}>{fmtHora(p.inicio)} – {fmtHora(p.fim)}</div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ com dados do dia (mesmo conteúdo do JSON-LD FAQPage) */}
        {faq.length > 0 && (
          <section aria-labelledby="faq-dia" className="mb-8">
            <h2 id="faq-dia" className="text-xl font-bold font-syne mb-3">Perguntas frequentes</h2>
            <dl className="space-y-4">
              {faq.map(item => (
                <div key={item.question}>
                  <dt className="font-semibold">{item.question}</dt>
                  <dd className="text-slate-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <PortosProximos slug={port.slug} />
      </main>
    </>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPortBySlug, getReferencePort, isEstimatedLocation } from '@/lib/ports';
import { getStateName, getStateSlug } from '@/lib/states';
import { portosConfig } from '@/data/porto-seo-config';
import { getEventosDia } from '@/lib/mare';
import { getMoonPhase } from '@/lib/tideUtils';
import { coefColor } from '@/lib/monthlyTideCalc';
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
  forcaDaMare,
  getDiaMare,
} from '@/lib/tideDay';
import SchemaGenerator from '@/components/seo/SchemaGenerator';
import EstimateNotice from '@/components/EstimateNotice';
import PortosProximos from '@/components/PortosProximos';
import NavBar from '@/components/NavBar';
import TideDayCurve from '@/components/TideDayCurve';

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

function ddmm(data: string): string {
  return data.split('-').reverse().slice(0, 2).join('/');
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

// Estilos compartilhados (mesma paleta da página do porto / TideTodayCard).
const CARD = 'rounded-2xl border border-white/10 bg-[#0d1b2e] p-4 sm:p-6 shadow-xl';
const TILE = 'rounded-xl border border-[#234565] bg-[#112b45]/80 px-3 py-3 sm:px-4 sm:py-4';
const EYEBROW = 'font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-[#7f9ab7]';
const H2 = 'text-lg sm:text-2xl font-extrabold font-syne text-white';
const PILL =
  'inline-flex items-center gap-2 text-xs font-bold text-blue-300 hover:text-white transition-all bg-white/5 hover:bg-blue-500/20 px-4 py-2.5 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md min-h-[44px]';

export default async function DiaPage({ params }: { params: Params }) {
  const port = resolvePort(params);
  if (!port) notFound();

  const dia = getDiaMare(port, params.data);
  if (!dia) notFound();

  const seoName = seoNameOf(port);
  const portUrl = `/mare/${params.slug}/${params.cidade}`;
  const dayUrl = (d: string) => `${portUrl}/${d}`;
  const ano = dia.data.slice(0, 4);

  const dateObj = new Date(`${dia.data}T12:00:00Z`);
  const lua = getMoonPhase(dateObj);
  const faseLuaTxt = lua.name.toLowerCase().startsWith('lua ') ? lua.name : `lua ${lua.name}`;

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

  const coefCor = dia.coef !== null ? coefColor(dia.coef) : null;

  return (
    <main className="min-h-screen pb-20">
      <SchemaGenerator
        port={port}
        type={schemaType}
        url={`https://mareagora.com.br${dayUrl(dia.data)}`}
        title={`Maré ${seoName} ${dia.dataBR}`}
        description={`Horários e alturas das marés em ${seoName} (${port.state}) em ${dia.dataBR}.`}
        faq={faq}
        referencePortName={referencePortName}
      />

      <NavBar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden hero-section pt-10 pb-16 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/70 to-slate-950" />
        <div className="container relative z-10">
          <div className="absolute top-0 left-4 md:left-0 pt-4 md:pt-0">
            <Link
              href={portUrl}
              className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-white transition-all uppercase tracking-widest bg-white/5 hover:bg-blue-500/20 px-4 py-2 rounded-xl border border-white/10 hover:border-blue-400/50 backdrop-blur-md"
            >
              ← {seoName} · mês completo
            </Link>
          </div>

          <div className="flex flex-col gap-3 items-center px-2 text-center pt-14 md:pt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 font-mono text-[11px] sm:text-xs uppercase tracking-[0.12em] text-cyan-200">
              {dia.diaSemana} · {dia.dataBR}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-syne leading-tight max-w-4xl text-white drop-shadow-md">
              Maré em {seoName}
              <span className="block text-cyan-300">em {dia.dataBR}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/85 max-w-2xl leading-relaxed">
              Dados oficiais da Marinha do Brasil (DHN)
              {referencePortName ? ` · Estação de referência: ${referencePortName}` : ''}
              {` · ${getStateName(port.state)}`}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              {dia.coef !== null && coefCor && (
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
                  style={{ color: coefCor.text, background: coefCor.bg, borderColor: `${coefCor.text}55` }}
                >
                  Coeficiente {dia.coef} · maré {forcaDaMare(dia.coef)}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200">
                <span aria-hidden="true">{lua.icon}</span> {lua.name}
              </span>
            </div>

            {/* Navegação entre dias (hoje até +30 dias) */}
            <nav aria-label="Navegar entre os dias" className="mt-4 flex items-center justify-center gap-3">
              {dia.anterior ? (
                <Link href={dayUrl(dia.anterior)} className={PILL}>← {ddmm(dia.anterior)}</Link>
              ) : (
                <span className={`${PILL} opacity-30 pointer-events-none`} aria-hidden="true">← Hoje</span>
              )}
              {dia.proximo ? (
                <Link href={dayUrl(dia.proximo)} className={PILL}>{ddmm(dia.proximo)} →</Link>
              ) : (
                <span className={`${PILL} opacity-30 pointer-events-none`} aria-hidden="true">Fim →</span>
              )}
            </nav>
          </div>
        </div>
      </section>

      <div className="container relative z-20 -mt-8 flex flex-col gap-6">
        <EstimateNotice port={port} />

        {/* ── RESUMO + MARÉS DO DIA ── */}
        <section aria-labelledby="mares-do-dia" className="rounded-2xl border border-blue-500/25 bg-gradient-to-b from-[#0d2339] to-[#0b1e31] p-4 sm:p-6 shadow-2xl">
          <p className={EYEBROW}>Previsão do dia</p>
          <h2 id="mares-do-dia" className={`${H2} mt-1`}>
            Marés de {dia.dataBR} em {seoName}
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">{resumo}</p>

          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {dia.mares.map(m => (
              <div
                key={`${m.hora}-${m.alta ? 'a' : 'b'}`}
                className={`glass-card ${m.alta ? 'card-mare-alta' : 'card-mare-baixa'} rounded-2xl p-4`}
              >
                <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-white/80">
                  {m.alta ? '▲ Preamar' : '▼ Baixamar'}
                </div>
                <div className="mt-1 font-tideMono text-3xl sm:text-4xl font-extrabold tabular-nums">{m.hora}</div>
                <div className="mt-1 text-sm font-semibold text-white/85">
                  {m.altura_m.toFixed(2).replace('.', ',')} m
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] sm:text-xs text-[#7f97b0]">
            Horários de Brasília. Alturas em relação ao nível de redução do porto de referência.
          </p>
        </section>

        {/* ── CURVA ── */}
        <section aria-labelledby="curva-do-dia" className={CARD}>
          <p className={EYEBROW}>Ao longo do dia</p>
          <h2 id="curva-do-dia" className={`${H2} mt-1 mb-3`}>Curva da maré</h2>
          <TideDayCurve
            mares={dia.mares}
            label={`Curva da maré em ${seoName} em ${dia.dataBR}, com ${dia.mares.length} extremos`}
          />
          <p className="mt-2 text-[11px] sm:text-xs text-[#7f97b0]">
            Curva estimada entre os extremos oficiais (pontos marcados).
          </p>
        </section>

        {/* ── COEFICIENTE, SOL E LUA ── */}
        <section aria-labelledby="sol-lua" className={CARD}>
          <p className={EYEBROW}>Condições astronômicas</p>
          <h2 id="sol-lua" className={`${H2} mt-1 mb-4`}>Coeficiente, sol e lua</h2>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <li className={TILE}>
              <div className={EYEBROW}>Coeficiente</div>
              <div
                className="mt-1 font-tideMono text-3xl font-extrabold tabular-nums"
                style={{ color: coefCor?.text ?? '#e8f1f8' }}
              >
                {dia.coef ?? '—'}
              </div>
              <div className="mt-1 text-xs font-semibold text-[#8aa4bf]">
                {dia.coef !== null ? `maré ${forcaDaMare(dia.coef)}` : 'indisponível'}
              </div>
            </li>
            <li className={TILE}>
              <div className={EYEBROW}>Nascer do sol</div>
              <div className="mt-1 font-tideMono text-3xl font-extrabold tabular-nums text-slate-100">{dia.sunrise}</div>
              <div className="mt-1 text-xs font-semibold text-[#8aa4bf]">☀️ manhã</div>
            </li>
            <li className={TILE}>
              <div className={EYEBROW}>Pôr do sol</div>
              <div className="mt-1 font-tideMono text-3xl font-extrabold tabular-nums text-slate-100">{dia.sunset}</div>
              <div className="mt-1 text-xs font-semibold text-[#8aa4bf]">🌅 tarde</div>
            </li>
            <li className={TILE}>
              <div className={EYEBROW}>Lua</div>
              <div className="mt-1 text-3xl" aria-hidden="true">{lua.icon}</div>
              <div className="mt-1 text-xs font-semibold text-[#8aa4bf]">{lua.name}</div>
            </li>
          </ul>
        </section>

        {/* ── PESCA / SOLUNAR ── */}
        <section aria-labelledby="pesca-do-dia" className={CARD}>
          <p className={EYEBROW}>Teoria solunar</p>
          <h2 id="pesca-do-dia" className={`${H2} mt-1`}>
            Pesca em {seoName} em {dia.dataBR}
          </h2>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base text-slate-300">
            <span className="text-xl sm:text-2xl tracking-widest text-amber-300" aria-hidden="true">
              {'★'.repeat(solunar.estrelas)}
              <span className="text-slate-600">{'★'.repeat(5 - solunar.estrelas)}</span>
            </span>
            <span>
              Qualidade solunar do dia: <strong className="text-white">{solunar.estrelas}/5</strong>
              {solunar.destaque ? ', com período maior coincidindo com a maré cheia (janela especialmente favorável)' : ''}.
            </span>
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <div className={TILE}>
              <div className={EYEBROW}>Períodos maiores · 2h</div>
              <ul className="mt-2 space-y-1">
                {maiores.map(p => (
                  <li key={p.centro.toISOString()} className="font-tideMono text-lg font-bold tabular-nums text-slate-100">
                    {fmtHora(p.inicio)} – {fmtHora(p.fim)}
                  </li>
                ))}
              </ul>
            </div>
            <div className={TILE}>
              <div className={EYEBROW}>Períodos menores · 1h</div>
              <ul className="mt-2 space-y-1">
                {menores.map(p => (
                  <li key={p.centro.toISOString()} className="font-tideMono text-lg font-bold tabular-nums text-slate-100">
                    {fmtHora(p.inicio)} – {fmtHora(p.fim)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── FAQ (mesmo conteúdo do JSON-LD FAQPage) ── */}
        {faq.length > 0 && (
          <section aria-labelledby="faq-dia" className={CARD}>
            <p className={EYEBROW}>Dúvidas rápidas</p>
            <h2 id="faq-dia" className={`${H2} mt-1 mb-4`}>Perguntas frequentes</h2>
            <div className="flex flex-col gap-2">
              {faq.map((item, i) => (
                <details
                  key={item.question}
                  open={i === 0}
                  className="group rounded-xl border border-[#234565] bg-[#112b45]/60 px-4 py-3"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-white [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="text-cyan-300 transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA para o mês completo ── */}
        <Link
          href={`${portUrl}#tabela-mensal`}
          className="flex items-center justify-between gap-4 rounded-2xl border border-blue-500/25 bg-gradient-to-r from-[#0d2339] to-[#0b1e31] p-4 sm:p-6 hover:border-cyan-400/50 transition-colors"
        >
          <span>
            <span className={`${EYEBROW} block`}>Tábua completa</span>
            <span className="mt-1 block font-syne text-base sm:text-xl font-extrabold text-white">
              Ver a tábua de maré de {seoName} em {ano}
            </span>
          </span>
          <span className="text-2xl text-cyan-300" aria-hidden="true">→</span>
        </Link>

        <PortosProximos slug={port.slug} />
      </div>
    </main>
  );
}

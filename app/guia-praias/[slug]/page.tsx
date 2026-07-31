// app/guia-praias/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PRAIAS } from '../page'
import TideCardLive from '@/components/TideCardLive'
import BeachConditions from '@/components/BeachConditions'
import BeachAffiliateCard from '@/components/BeachAffiliateCard'
import { AD_SLOTS } from '@/lib/adConfig'
import AdSlot from '@/components/ads/AdSlot'
import BeachSchemaMarkup from '@/components/guia-praias/BeachSchemaMarkup'
import { getPortBySlug } from '@/lib/ports'
import { getCamerasForPraia } from '@/lib/guia-praias/getCamerasForPraia'
import { getPraiasProximas } from '@/lib/guia-praias/getPraiasProximas'

import InformacoesGerais from '@/components/guia-praias/InformacoesGerais'
import Estrutura from '@/components/guia-praias/Estrutura'
import Atividades from '@/components/guia-praias/Atividades'
import ComoChegar from '@/components/guia-praias/ComoChegar'
import Seguranca from '@/components/guia-praias/Seguranca'
import PescaDetalhada from '@/components/guia-praias/PescaDetalhada'
import CamerasAoVivo from '@/components/guia-praias/CamerasAoVivo'
import Galeria from '@/components/guia-praias/Galeria'
import PraiasProximas from '@/components/guia-praias/PraiasProximas'
import LugaresProximos from '@/components/guia-praias/LugaresProximos'
import Faq, { buildFaq } from '@/components/guia-praias/Faq'
import ConteudoRelacionado from '@/components/guia-praias/ConteudoRelacionado'
import { CONTEUDO } from '@/lib/guia-praias/conteudoPraias'

// --- SEO dinâmico por praia -------------------------------------------------
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const praia = PRAIAS.find((p) => p.slug === params.slug)
  if (!praia) return {}
  const hasConteudo = !!CONTEUDO[praia.slug]
  const url = `https://mareagora.com.br/guia-praias/${praia.slug}`
  const title = `${praia.nome} - Guia Completo: Maré, Ondas e Dicas | MaréAgora`
  const description = `Guia completo de ${praia.nome}, ${praia.estado}: maré em tempo real, condições de ondas, estrutura, segurança e dicas de pesca. Dados oficiais da Marinha do Brasil.`

  return {
    title,
    description,
    keywords: `${praia.nome}, maré ${praia.nome}, praia ${praia.estado}, guia ${praia.nome}, surf ${praia.nome}`,
    robots: hasConteudo ? { index: true, follow: true } : { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title,
      description: praia.descricao,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description: praia.descricao,
    },
  }
}

export async function generateStaticParams() {
  return PRAIAS.map((p) => ({ slug: p.slug }))
}

// --- componente ----------------------------------------------------------
export default function PraiaPagina({ params }: { params: { slug: string } }) {
  const praia = PRAIAS.find((p) => p.slug === params.slug)
  if (!praia) notFound()

  const conteudo = CONTEUDO[praia.slug]
  const port = getPortBySlug(praia.porto.slug)
  const url = `https://mareagora.com.br/guia-praias/${praia.slug}`

  const cameras = getCamerasForPraia(praia.nome, praia.uf)
  const praiasProximas = getPraiasProximas(praia, PRAIAS)

  const faqItems = buildFaq({
    nome: praia.nome,
    uf: praia.uf,
    temPesca: !!conteudo?.pesca,
    melhorEpoca: conteudo?.melhorEpoca,
    idealParaFamilia: praia.tags.some((t) => t.toLowerCase() === 'família'),
    temEstacionamento: praia.estrutura?.estacionamento,
    temQuiosques: praia.estrutura?.quiosques,
    temSalvaVidas: praia.estrutura?.salvaVidas,
    temAnimaisPermitidos: praia.estrutura?.animaisPermitidos,
    temCameras: cameras.length > 0,
    principaisAcessos: praia.comoChegar?.principaisAcessos,
  })

  return (
    <main className="praia-page">
      {port && (
        <BeachSchemaMarkup
          nome={praia.nome}
          descricao={praia.descricao}
          url={url}
          port={port}
          faq={faqItems}
        />
      )}

      {/* -- Botão Voltar -- */}
      <a href="/guia-praias" className="pp-back-btn">
        &larr; Guia de Praias
      </a>

      {/* -- Breadcrumb -- */}
      <nav className="pp-breadcrumb" aria-label="Breadcrumb">
        <a href="/">MaréAgora</a>
        <span>/</span>
        <a href="/guia-praias">Guia de Praias</a>
        <span>/</span>
        <span>{praia.nome}</span>
      </nav>

      {/* -- Hero -- */}
      <header className="pp-hero">
        <div className="pp-hero-bg" />
        <div className="pp-hero-content">
          <div className="pp-estado-badge">{praia.estado}</div>
          <h1>{praia.nome}</h1>
          <p>{praia.descricao}</p>
          <div className="pp-tags">
            {praia.tags.map((tag) => (
              <span key={tag} className="pp-tag">{tag}</span>
            ))}
          </div>
        </div>
      </header>

      {/* -- AdSense topo -- */}
      <div className="pp-ad-slot">
        <AdSlot slotId={AD_SLOTS.LEADERBOARD_NAV} format="horizontal" />
      </div>

      {/* -- Layout principal -- */}
      <div className="pp-layout">
        {/* Coluna principal */}
        <div className="pp-main">

          {/* 2. Informações gerais - a partir de campos reais da praia */}
          <InformacoesGerais
            nome={praia.nome}
            estado={praia.estado}
            uf={praia.uf}
            regiao={praia.regiao}
            tags={praia.tags}
            melhorEpoca={conteudo?.melhorEpoca}
            extra={praia.informacoesGerais}
          />

          {/* 3. Condições atuais - reaproveita componentes existentes, sem alterar suas APIs */}
          <section className="pp-section">
            <h2 className="pp-section-title">
              <span className="pp-live-dot" /> Condições atuais
            </h2>
            <div className="pp-conditions-stack">
              <TideCardLive port={praia.porto} />
              {port && <BeachConditions lat={port.lat} lon={port.lon} />}
            </div>
          </section>

          {/* 4. Sobre a praia */}
          {conteudo && (
            <section className="pp-section pp-text-section">
              <h2 className="pp-section-title">Sobre {praia.nome}</h2>
              <p>{conteudo.sobre}</p>
            </section>
          )}

          {/* 5. Estrutura */}
          <Estrutura data={praia.estrutura} />

          {/* 6. Atividades */}
          <Atividades data={praia.atividades} />

          {/* 7. Como chegar - usa as mesmas coordenadas oficiais da maré/ondas */}
          {port && (
            <ComoChegar
              nome={praia.nome}
              cidade={praia.nome}
              uf={praia.uf}
              lat={port.lat}
              lon={port.lon}
              principaisAcessos={praia.comoChegar?.principaisAcessos}
              transportePublico={praia.comoChegar?.transportePublico}
            />
          )}

          {/* 8. Segurança */}
          <Seguranca data={praia.seguranca} />

          {/* AdSense meio */}
          <div className="pp-ad-slot pp-ad-rect">
            <AdSlot slotId={AD_SLOTS.INCONTENT_RECT} format="rectangle" />
          </div>

          {/* 9. Pesca (texto simples existente) + Pesca detalhada (preparada p/ integração futura) */}
          {conteudo && (
            <section className="pp-section pp-text-section">
              <h2 className="pp-section-title">🎣 Pesca em {praia.nome}</h2>
              <p>{conteudo.pesca}</p>
            </section>
          )}
          <PescaDetalhada data={praia.pescaDetalhada} />

          {/* 10. Câmeras ao vivo */}
          <CamerasAoVivo cameras={cameras} />

          {/* 11. Galeria */}
          <Galeria fotos={praia.galeria} nome={praia.nome} />

          {/* 12. Praias próximas */}
          <PraiasProximas praias={praiasProximas} />

          {/* 13. Lugares próximos */}
          <LugaresProximos lugares={praia.lugaresProximos} />

          {/* 14. Perguntas frequentes */}
          <Faq items={faqItems} />

          {/* 15. Conteúdo relacionado */}
          <ConteudoRelacionado nome={praia.nome} uf={praia.uf} portoSlug={praia.porto.slug} />
        </div>

        {/* Sidebar */}
        <aside className="pp-sidebar">
          {/* Afiliado Booking */}
          {praia.afiliado && (
            <BeachAffiliateCard
              label={praia.afiliado.label}
              url={praia.afiliado.url}
              nomePraia={praia.nome}
            />
          )}

          {/* AdSense sidebar */}
          <div className="pp-ad-slot pp-ad-sidebar">
            <AdSlot slotId={AD_SLOTS.SIDEBAR_STICKY} format="vertical" />
          </div>

          {/* Links rápidos */}
          <div className="pp-quick-links">
            <h3>Equipamentos para {praia.nome}</h3>
            <a
              href={`https://www.amazon.com.br/s?k=equipamentos+praia&tag=mareagora-20`}
              target="_blank"
              rel="nofollow sponsored"
              className="pp-affiliate-link"
            >
              🏖️ Ver equipamentos de praia na Amazon
            </a>
            <a
              href={`https://www.amazon.com.br/s?k=vara+de+pesca&tag=mareagora-20`}
              target="_blank"
              rel="nofollow sponsored"
              className="pp-affiliate-link"
            >
              🎣 Ver equipamentos de pesca na Amazon
            </a>
          </div>

          {/* Outras praias (fallback simples; ver também "Praias próximas" no conteúdo principal) */}
          <div className="pp-other-beaches">
            <h3>Outras praias</h3>
            {PRAIAS.filter((p) => p.slug !== praia.slug)
              .slice(0, 4)
              .map((p) => (
                <Link key={p.slug} href={`/guia-praias/${p.slug}`} className="pp-other-link">
                  <span>{p.nome}</span>
                  <span className="pp-other-uf">{p.uf}</span>
                </Link>
              ))}
          </div>
        </aside>
      </div>

      <style>{styles}</style>
    </main>
  )
}

const styles = `
  .praia-page { background: #04111f; min-height: 100vh; color: #f0e6c8; position: relative; }

  /* Voltar */
  .pp-back-btn {
    position: absolute; top: 1.5rem; left: 1.5rem; z-index: 100;
    color: #2196c4; text-decoration: none; font-size: 0.75rem; font-weight: 700;
    display: flex; align-items: center; gap: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;
    padding: 0.4rem 1rem; border: 1px solid rgba(33,150,196,0.3);
    border-radius: 100px; background: rgba(4,17,31,0.6); backdrop-filter: blur(4px);
    transition: all 0.2s;
  }
  .pp-back-btn:hover { background: rgba(33,150,196,0.2); color: #7ab8d0; border-color: rgba(33,150,196,0.6); }

  /* Breadcrumb */
  .pp-breadcrumb {
    padding: 1rem 2rem; font-size: 0.8rem; color: #5a6a7a;
    display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;
  }
  .pp-breadcrumb a { color: #2196c4; text-decoration: none; }
  .pp-breadcrumb a:hover { text-decoration: underline; }

  /* Hero */
  .pp-hero {
    position: relative; padding: 4rem 2rem 5rem; text-align: center;
    overflow: hidden;
  }
  .pp-hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, #0a2340 0%, #04111f 100%);
  }
  .pp-hero-content { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
  .pp-estado-badge {
    display: inline-block; font-size: 0.72rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #2196c4; border: 1px solid #2196c4;
    padding: 0.25rem 0.75rem; border-radius: 100px; margin-bottom: 1rem;
  }
  .pp-hero h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900;
    color: #f0e6c8; margin-bottom: 1rem; line-height: 1.1;
  }
  .pp-hero p { font-size: 1rem; color: #d4c49a; line-height: 1.7; margin-bottom: 1.25rem; }
  .pp-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; }
  .pp-tag {
    font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 100px;
    border: 1px solid rgba(33,150,196,0.3); color: #7ab8d0;
  }

  /* Ad slots */
  .pp-ad-slot {
    background: rgba(14,58,110,0.1);
    border-top: 1px dashed rgba(33,150,196,0.1);
    border-bottom: 1px dashed rgba(33,150,196,0.1);
    padding: 1rem; text-align: center;
    color: rgba(212,196,154,0.2); font-size: 0.65rem;
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .pp-ad-rect { min-height: 120px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
  .pp-ad-sidebar { min-height: 250px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }

  /* Layout */
  .pp-layout {
    max-width: 1100px; margin: 0 auto; padding: 2rem;
    display: grid; grid-template-columns: 1fr 320px; gap: 2.5rem;
  }

  /* Sections */
  .pp-section { margin-bottom: 3rem; }
  .pp-section-title {
    font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #f0e6c8;
    margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem;
  }
  .pp-live-dot { width: 8px; height: 8px; background: #2196c4; border-radius: 50%; animation: ppPulse 1.5s infinite; }
  @keyframes ppPulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

  .pp-text-section p { font-size: 0.95rem; line-height: 1.8; color: #8a9aaa; }
  .pp-text-section ul { margin: 0.5rem 0 1rem 1.25rem; color: #8a9aaa; font-size: 0.9rem; line-height: 1.7; }

  /* Condições atuais */
  .pp-conditions-stack { display: flex; flex-direction: column; gap: 1rem; }

  /* Informações gerais */
  .pp-info-card {
    background: rgba(14,58,110,0.2); border: 1px solid rgba(33,150,196,0.15);
    border-radius: 14px; padding: 1.25rem 1.5rem; display: grid; gap: 0.9rem;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  .pp-info-item { display: flex; flex-direction: column; gap: 0.2rem; }
  .pp-info-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: #2196c4; font-weight: 700; }
  .pp-info-value { font-size: 0.9rem; color: #d4c49a; }
  .pp-info-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }

  /* Estrutura (ícones) */
  .pp-icon-grid {
    list-style: none; padding: 0; margin: 0;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem;
  }
  .pp-icon-item {
    display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #d4c49a;
    background: rgba(14,58,110,0.15); border: 1px solid rgba(33,150,196,0.1);
    border-radius: 10px; padding: 0.6rem 0.75rem;
  }

  /* Atividades (badges) */
  .pp-badge-list { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .pp-badge {
    display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; font-weight: 600;
    color: #7ab8d0; background: rgba(33,150,196,0.1); border: 1px solid rgba(33,150,196,0.25);
    border-radius: 100px; padding: 0.4rem 0.9rem;
  }

  /* Como chegar */
  .pp-map-wrapper { border-radius: 14px; overflow: hidden; border: 1px solid rgba(33,150,196,0.15); margin-bottom: 1rem; }
  .pp-map-iframe { width: 100%; height: 320px; border: 0; display: block; }
  .pp-como-chegar-info { font-size: 0.9rem; color: #8a9aaa; line-height: 1.7; display: flex; flex-direction: column; gap: 0.5rem; }
  .pp-como-chegar-info strong { color: #d4c49a; }

  /* Câmeras */
  .pp-cameras-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }

  /* Galeria */
  .pp-galeria-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
  .pp-galeria-item { position: relative; aspect-ratio: 1; border-radius: 10px; overflow: hidden; }

  /* Listas de proximidade */
  .pp-nearby-list, .pp-related-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }

  /* FAQ */
  .pp-faq-item {
    background: rgba(14,58,110,0.2); border-radius: 10px; margin-bottom: 0.75rem;
    border: 1px solid rgba(33,150,196,0.1);
  }
  .pp-faq-item summary {
    padding: 1rem; font-weight: 700; cursor: pointer; color: #d4c49a;
    font-size: 0.9rem; list-style: none; display: flex; justify-content: space-between;
  }
  .pp-faq-item summary::-webkit-details-marker { display: none; }
  .pp-faq-item summary::after { content: '+'; color: #2196c4; }
  .pp-faq-item[open] summary::after { content: '-'; }
  .pp-faq-item p { padding: 0 1rem 1rem; font-size: 0.88rem; color: #8a9aaa; line-height: 1.6; }

  /* Sidebar */
  .pp-sidebar { display: flex; flex-direction: column; gap: 2rem; }
  .pp-quick-links, .pp-other-beaches {
    background: rgba(14,58,110,0.15); padding: 1.25rem; border-radius: 14px;
    border: 1px solid rgba(33,150,196,0.1);
  }
  .pp-sidebar h3 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: #2196c4; margin-bottom: 1rem; }

  .pp-affiliate-link {
    display: block; font-size: 0.82rem; color: #8a9aaa; text-decoration: none;
    padding: 0.75rem; border-radius: 8px; background: rgba(0,0,0,0.2);
    margin-bottom: 0.5rem; transition: background 0.2s, color 0.2s;
  }
  .pp-affiliate-link:hover { background: rgba(33,150,196,0.15); color: #f0e6c8; }

  .pp-other-link {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.6rem 0; border-bottom: 1px solid rgba(33,150,196,0.1);
    text-decoration: none; color: #8a9aaa; font-size: 0.9rem; transition: color 0.2s;
  }
  .pp-other-link:hover { color: #2196c4; }
  .pp-other-uf { font-size: 0.7rem; font-weight: 900; background: rgba(33,150,196,0.1); padding: 0.1rem 0.4rem; border-radius: 4px; }

  @media (max-width: 900px) {
    .pp-layout { grid-template-columns: 1fr; }
    .pp-sidebar { order: -1; }
    .pp-hero { padding: 3rem 1.5rem 4rem; }
    .pp-map-iframe { height: 240px; }
  }
`

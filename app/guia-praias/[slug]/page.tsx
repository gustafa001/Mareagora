// app/guia-praias/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PRAIAS } from '../page'
import TideCardLive from '@/components/TideCardLive'
import BeachAffiliateCard from '@/components/BeachAffiliateCard'
import BeachImage from '../BeachImage'

// ─── SEO dinâmico por praia ───────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const praia = PRAIAS.find((p) => p.slug === params.slug)
  if (!praia) return {}
  return {
    title: `${praia.nome} — Maré, Ondas e Dicas | MaréAgora`,
    description: `Confira a maré em tempo real, condições de ondas e dicas de pesca para ${praia.nome}, ${praia.estado}. Dados oficiais da Marinha do Brasil.`,
    keywords: `${praia.nome}, maré ${praia.nome}, praia ${praia.estado}, surf ${praia.nome}`,
    openGraph: {
      title: `${praia.nome} — Maré ao vivo | MaréAgora`,
      description: praia.descricao,
      url: `https://mareagora.com.br/guia-praias/${praia.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return PRAIAS.map((p) => ({ slug: p.slug }))
}

// ─── conteúdo SEO por praia (pode virar MDX futuramente) ─────────────────────
const CONTEUDO: Record<string, { sobre: string; pesca: string; melhorEpoca: string }> = {
  'jurere-sc': {
    sobre: 'Jurerê Internacional é a praia mais famosa de Florianópolis, conhecida pelos beach clubs sofisticados, casas de alto padrão e infraestrutura completa. O mar calmo e raso é ideal para famílias com crianças.',
    pesca: 'A pesca é boa nas pedras do costão leste, especialmente para robalo e tainha na maré enchendo. Os melhores horários são nas primeiras horas da manhã, quando o fluxo de maré está forte.',
    melhorEpoca: 'Dezembro a março para o verão agitado. Abril a junho para mar mais calmo e menos movimento.',
  },
  'jericoacoara-ce': {
    sobre: 'Jericoacoara, ou "Jeri", é um dos destinos mais desejados do Brasil. A vila sem ruas asfaltadas fica dentro de um Parque Nacional e oferece dunas, lagoas e o famoso pôr do sol na Pedra Furada.',
    pesca: 'A pesca artesanal é forte na região. Na maré baixa, os pescadores locais indicam os melhores pontos ao longo da praia principal. Atum e dourado são abundantes na costa.',
    melhorEpoca: 'Julho a dezembro para os ventos ideais de kitesurf. Janeiro a junho para mar mais calmo.',
  },
  'praia-do-espelho-ba': {
    sobre: 'A Praia do Espelho fica entre Trancoso e Caraíva, no extremo sul da Bahia. As piscinas naturais formadas na maré baixa são o principal atrativo, junto com as falésias coloridas.',
    pesca: 'Na maré baixa as piscinas naturais ficam expostas e a pesca com anzol de mão é popular entre os locais. Robalos e peixes de recife são comuns.',
    melhorEpoca: 'Setembro a março. Evite julho e agosto pela maré muito alta que cobre as piscinas.',
  },
  'grumari-rj': {
    sobre: 'Grumari é a praia mais isolada do Rio de Janeiro, dentro de uma Área de Proteção Ambiental. Sem quiosques permanentes, é frequentada por surfistas e quem busca natureza preservada.',
    pesca: 'Uma das melhores praias do Rio para pesca de arremesso. Anchova e corvina são abundantes, especialmente no inverno. A maré baixa é essencial para acessar os melhores pontos.',
    melhorEpoca: 'Maio a setembro para surf e pesca. Verão para banho de mar com ondas menores.',
  },
  'morro-de-sao-paulo-ba': {
    sobre: 'Morro de São Paulo fica na Ilha de Tinharé, sem carros. As praias são numeradas (Primeira, Segunda, Terceira e Quarta Praia) com características distintas — da mais agitada à mais selvagem.',
    pesca: 'A Quarta Praia, mais isolada, oferece ótima pesca de arremesso. Os recifes de corais ao redor da ilha são paraíso para pesca subaquática e snorkel.',
    melhorEpoca: 'Setembro a março para clima seco. Julho é alta temporada apesar da chuva.',
  },
  'bombinhas-sc': {
    sobre: 'Bombinhas é considerada a cidade com as águas mais transparentes do Sul do Brasil. A Praia de Bombas e Bombinhas formam um balneário completo com rica vida marinha nos costões.',
    pesca: 'Os costões rochosos são ideais para pesca de garoupa e badejo. O mergulho é excelente, especialmente na Reserva Biológica Marinha do Arvoredo.',
    melhorEpoca: 'Dezembro a fevereiro para verão. Março a maio para turismo sem aglomeração.',
  },
}

// ─── componente ──────────────────────────────────────────────────────────────
export default function PraiaPagina({ params }: { params: { slug: string } }) {
  const praia = PRAIAS.find((p) => p.slug === params.slug)
  if (!praia) notFound()

  const conteudo = CONTEUDO[praia.slug]

  return (
    <main className="praia-page">
      {/* ── Breadcrumb ── */}
      <nav className="pp-breadcrumb" aria-label="Breadcrumb">
        <a href="/">MaréAgora</a>
        <span>/</span>
        <a href="/guia-praias">Guia de Praias</a>
        <span>/</span>
        <span>{praia.nome}</span>
      </nav>

      {/* ── Hero ── */}
      <header className="pp-hero">
        <div className="pp-hero-bg" />
        <div className="pp-hero-img">
          <BeachImage query={praia.unsplashQuery} alt={`Foto de ${praia.nome}`} />
        </div>
        <div className="pp-hero-overlay" />
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

      {/* ── AdSense topo ── */}
      <div className="pp-ad-slot"><span>Publicidade</span></div>

      {/* ── Layout principal ── */}
      <div className="pp-layout">
        {/* Coluna principal */}
        <div className="pp-main">

          {/* Componente de maré ao vivo — já existe no MaréAgora! */}
          <section className="pp-section">
            <h2 className="pp-section-title">
              <span className="pp-live-dot" /> Maré em Tempo Real
            </h2>
            {/* TideCardLive já existe no seu projeto — só passar o objeto port */}
            <TideCardLive port={praia.porto} />
          </section>

          {/* Sobre a praia */}
          {conteudo && (
            <>
              <section className="pp-section pp-text-section">
                <h2 className="pp-section-title">Sobre {praia.nome}</h2>
                <p>{conteudo.sobre}</p>
              </section>

              <section className="pp-section pp-text-section">
                <h2 className="pp-section-title">🎣 Pesca em {praia.nome}</h2>
                <p>{conteudo.pesca}</p>
              </section>

              <section className="pp-section pp-text-section">
                <h2 className="pp-section-title">📅 Melhor época para visitar</h2>
                <p>{conteudo.melhorEpoca}</p>
              </section>
            </>
          )}

          {/* AdSense meio */}
          <div className="pp-ad-slot pp-ad-rect"><span>Publicidade</span></div>

          {/* FAQ — SEO */}
          <section className="pp-section pp-faq">
            <h2 className="pp-section-title">Perguntas frequentes</h2>
            <details className="pp-faq-item">
              <summary>Qual é a maré hoje em {praia.nome}?</summary>
              <p>Você pode ver a maré em tempo real no card acima, com dados oficiais da Marinha do Brasil atualizados a cada hora.</p>
            </details>
            <details className="pp-faq-item">
              <summary>Quando é o melhor horário para pescar em {praia.nome}?</summary>
              <p>Os melhores horários são 1 hora antes e depois da virada de maré (enchente ou vazante). Consulte o gráfico de maré acima para o horário exato de hoje.</p>
            </details>
            <details className="pp-faq-item">
              <summary>As ondas estão boas em {praia.nome} hoje?</summary>
              <p>O card de maré acima mostra as condições atuais de ondas e vento em tempo real via Open-Meteo Marine API.</p>
            </details>
          </section>
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
          <div className="pp-ad-slot pp-ad-sidebar"><span>Publicidade</span></div>

          {/* Links rápidos */}
          <div className="pp-quick-links">
            <h3>Equipamentos para {praia.nome}</h3>
            <a
              href={`https://www.amazon.com.br/s?k=equipamentos+praia&tag=SEU_AFILIADO`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="pp-affiliate-link"
            >
              🏖️ Ver equipamentos de praia na Amazon
            </a>
            <a
              href={`https://www.amazon.com.br/s?k=vara+de+pesca&tag=SEU_AFILIADO`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="pp-affiliate-link"
            >
              🎣 Ver equipamentos de pesca na Amazon
            </a>
          </div>

          {/* Outras praias */}
          <div className="pp-other-beaches">
            <h3>Outras praias</h3>
            {PRAIAS.filter((p) => p.slug !== praia.slug)
              .slice(0, 4)
              .map((p) => (
                <a key={p.slug} href={`/guia-praias/${p.slug}`} className="pp-other-link">
                  <span>{p.nome}</span>
                  <span className="pp-other-uf">{p.uf}</span>
                </a>
              ))}
          </div>
        </aside>
      </div>

      <style>{styles}</style>
    </main>
  )
}

const styles = `
  .praia-page { background: #04111f; min-height: 100vh; color: #f0e6c8; }

  /* Breadcrumb */
  .pp-breadcrumb {
    padding: 1rem 2rem; font-size: 0.8rem; color: #5a6a7a;
    display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;
  }
  .pp-breadcrumb a { color: #2196c4; text-decoration: none; }
  .pp-breadcrumb a:hover { text-decoration: underline; }

  /* Hero */
  .pp-hero {
    position: relative; padding: 5rem 2rem 6rem; text-align: center;
    overflow: hidden; min-height: 420px; display: flex; align-items: center; justify-content: center;
  }
  .pp-hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, #0a2340 0%, #04111f 100%);
  }
  .pp-hero-img {
    position: absolute; inset: 0; z-index: 1;
  }
  .pp-hero-img img {
    width: 100%; height: 100%; object-fit: cover; opacity: 0.45;
  }
  .pp-hero-overlay {
    position: absolute; inset: 0; z-index: 2;
    background: linear-gradient(180deg, rgba(4,17,31,0.3) 0%, rgba(4,17,31,0.75) 100%);
  }
  .pp-hero-content { position: relative; z-index: 3; max-width: 680px; margin: 0 auto; }
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
  .pp-faq-item[open] summary::after { content: '−'; }
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
  }
`

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

// --- conteúdo SEO por praia (pode virar MDX futuramente) -------------------
export const CONTEUDO: Record<string, { sobre: string; pesca: string; melhorEpoca: string }> = {
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
    sobre: 'Morro de São Paulo fica na Ilha de Tinharé, sem carros. As praias são numeradas (Primeira, Segunda, Terceira e Quarta Praia) com características distintas - da mais agitada à mais selvagem.',
    pesca: 'A Quarta Praia, mais isolada, oferece ótima pesca de arremesso. Os recifes de corais ao redor da ilha são paraíso para pesca subaquática e snorkel.',
    melhorEpoca: 'Setembro a março para clima seco. Julho é alta temporada apesar da chuva.',
  },
  'bombinhas-sc': {
    sobre: 'Bombinhas é considerada a cidade com as águas mais transparentes do Sul do Brasil. A Praia de Bombas e Bombinhas formam um balneário completo com rica vida marinha nos costões.',
    pesca: 'Os costões rochosos são ideais para pesca de garoupa e badejo. O mergulho é excelente, especialmente na Reserva Biológica Marinha do Arvoredo.',
    melhorEpoca: 'Dezembro a fevereiro para verão. Março a maio para turismo sem aglomeração.',
  },
  'praia-grande': {
    sobre: 'A Praia Grande possui uma das orlas mais extensas e urbanizadas de São Paulo. Com 22 km de extensão ininterrupta, é famosa por seus quiosques modernos, ciclovia de ponta a ponta e calçadão movimentado. É um destino extremamente popular para famílias da capital.',
    pesca: 'A pesca de arremesso é excelente nas primeiras horas da manhã. O fluxo da maré traz cardumes de pequenos peixes para a zona de arrebentação, tornando-se um local ideal para pesca de corvina e pescada.',
    melhorEpoca: 'O verão atrai multidões, mas a primavera e o outono oferecem clima agradável e praias mais tranquilas para aproveitar a orla.',
  },
  'sao-luis': {
    sobre: 'A capital maranhense é famosa não apenas por sua rica herança histórica e arquitetura colonial, mas também por abrigar algumas das maiores variações de maré do Brasil. As praias urbanas mudam completamente de paisagem em poucas horas.',
    pesca: 'A pesca costeira é influenciada diretamente pela grande amplitude de maré. Pescadores locais aproveitam o estuário para pescar durante a maré vazante, capturando peixes adaptados às correntes fortes.',
    melhorEpoca: 'Entre julho e dezembro o clima é mais firme, ideal para visitar as praias e passear pelo centro histórico sem chuvas repentinas.',
  },
  'porto-de-natal': {
    sobre: 'Natal, a Cidade do Sol, é famosa por suas praias de águas quentes e dunas exuberantes. A região oferece desde lagoas tranquilas até mar aberto propício para esportes aquáticos, sempre sob o sol nordestino.',
    pesca: 'Com o mar calmo na maior parte do ano, a pesca embarcada e de costão são bastante praticadas. A variação da maré é crucial para acessar recifes e canais de pesca.',
    melhorEpoca: 'O ano todo é propício para visitas. O verão é vibrante, mas os meses de setembro a novembro oferecem ventos perfeitos para kitesurf e praias menos cheias.',
  },
  'porto-de-maceio': {
    sobre: 'Maceió abriga algumas das águas mais belas e cristalinas do litoral brasileiro, comparadas frequentemente ao Caribe. Suas piscinas naturais formadas em meio aos arrecifes são o cartão-postal do estado.',
    pesca: 'Nas áreas onde a pesca é permitida, pescadores locais aproveitam a rica biodiversidade dos recifes de coral, especialmente nas marés de sizígia, quando mais recifes ficam expostos.',
    melhorEpoca: 'De outubro a março as águas ficam mais cristalinas e quentes. É imprescindível visitar nas luas nova ou cheia para pegar a maré mais baixa e ver as piscinas naturais.',
  },
  'porto-de-santos': {
    sobre: 'Santos mistura sua importância histórica portuária com belíssimas praias urbanas contornadas pelo maior jardim de orla do mundo. O mar costuma ser tranquilo, excelente para esportes como stand-up paddle e canoa havaiana.',
    pesca: 'Os molhes e canais são locais tradicionais de pesca. A troca de marés movimenta os cardumes e a pesca noturna costuma trazer ótimos resultados para robalos.',
    melhorEpoca: 'Qualquer época do ano é boa. No inverno, o clima convida a visitar o centro histórico e museus além da praia.',
  },
  'guaruja': {
    sobre: 'O Guarujá, conhecido como a Pérola do Atlântico, oferece desde praias altamente badaladas como Enseada e Pitangueiras, até joias escondidas e preservadas, acessíveis apenas por trilha ou mar.',
    pesca: 'Com diversos costões rochosos e praias de tombo, a pesca costeira é um grande atrativo. A pesca de costão rende peixes maiores em dias de mar agitado e maré subindo.',
    melhorEpoca: 'Dezembro a março para aproveitar o verão e a vida noturna. Abril a junho para curtir surf e praias tranquilas com ótimo clima.',
  },
  'sao-vicente': {
    sobre: 'São Vicente é a cidade mais antiga do Brasil, fundada em 1532, e combina esse peso histórico com praias tranquilas voltadas para famílias. A Ilha Porchat, ligada ao continente por uma ponte, oferece mirantes com vista para toda a Baixada Santista.',
    pesca: 'Os costões da Ilha Porchat e o canal de Bertioga-Piaçabuçu são bons pontos de pesca de arremesso. A maré enchente costuma trazer melhores resultados para tainha e corvina junto à arrebentação.',
    melhorEpoca: 'Verão para aproveitar a orla e o comércio da praia do Itararé. Nos fins de semana de baixa temporada o mar costuma ficar mais calmo e a cidade menos movimentada.',
  },
  'bertioga': {
    sobre: 'Bertioga preserva boa parte da Mata Atlântica original e tem praias mais desertas que o restante do litoral paulista, além do histórico Forte São João, erguido no século XVI para defender o canal que dá nome à cidade.',
    pesca: 'O Canal de Bertioga é um dos pontos mais procurados da região para pesca de robalo e caratinga, principalmente na virada da maré, quando a correnteza concentra o cardume próximo às margens.',
    melhorEpoca: 'Abril a agosto oferece mar mais calmo e praias vazias, ideais para quem busca sossego. O verão atrai visitantes para a orla de Riviera e a Praia da Enseada.',
  },
  'riviera-de-sao-lourenco': {
    sobre: 'A Riviera de São Lourenço é um bairro planejado em Bertioga, com praias limpas, marina própria e infraestrutura de alto padrão. É procurada por quem busca conforto sem abrir mão do acesso fácil ao mar aberto.',
    pesca: 'A região da marina e dos costões próximos favorece a pesca embarcada. Nas praias abertas, a pesca de arremesso funciona melhor nas primeiras horas da manhã, com a maré ainda baixa.',
    melhorEpoca: 'Dezembro a março concentra a alta temporada, com toda a infraestrutura de lazer em funcionamento. Fora desse período o local fica mais tranquilo e os preços caem.',
  },
  'mongagua': {
    sobre: 'Mongaguá é um balneário mais discreto da Baixada Santista, com ondas consistentes que atraem surfistas e uma orla menos disputada que a de cidades vizinhas como Praia Grande.',
    pesca: 'A pesca de arremesso na arrebentação rende bons resultados, especialmente em dias de mar com ondulação moderada. A região também é procurada por pescadores de caranguejo nos manguezais próximos.',
    melhorEpoca: 'Outono e inverno trazem ondas mais organizadas para o surf. O verão é a época de maior movimento na orla e no comércio local.',
  },
  'itanhaem': {
    sobre: 'Uma das primeiras vilas fundadas no Brasil, Itanhaém tem praias mais preservadas e é cortada por rios de água limpa, como o Rio Branco, que desce das encostas da Serra do Mar até o mar.',
    pesca: 'Os rios e a foz junto à praia são bons pontos de pesca de robalo e tainha, principalmente na maré vazante, quando os peixes se concentram nos canais mais estreitos.',
    melhorEpoca: 'Primavera e outono oferecem clima ameno para explorar tanto a praia quanto os passeios pelos rios. O verão é mais quente e movimentado.',
  },
  'peruibe': {
    sobre: 'Peruíbe é conhecida como a "Cidade do Clima Especial" e abriga parte da Estação Ecológica Juréia-Itatins, uma das últimas grandes áreas de Mata Atlântica preservada no litoral paulista.',
    pesca: 'A pesca de arremesso é praticada ao longo de toda a orla, com destaque para a foz do Rio Preto. A proximidade da Juréia também atrai pescadores para pontos mais isolados e preservados.',
    melhorEpoca: 'Abril a setembro é indicado para quem busca ecoturismo e trilhas na Juréia com clima mais ameno. O verão concentra o maior movimento na praia central.',
  },
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

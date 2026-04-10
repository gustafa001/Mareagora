// app/guia-praias/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guia de Praias do Brasil — Marés, Ondas e Dicas | MaréAgora',
  description:
    'Descubra as melhores praias do Brasil com dados de marés em tempo real, condições de ondas e dicas de pesca. Guia completo do litoral brasileiro.',
  keywords: 'praias brasil, maré praia, ondas surf, pesca esportiva, guia praias',
}

// ─── tipos ───────────────────────────────────────────────────────────────────
interface PortoMeta {
  slug: string
  nome: string
  estado: string
  dataFile: string
}

interface Praia {
  slug: string
  nome: string
  estado: string
  uf: string
  descricao: string
  tags: string[]
  porto: PortoMeta
  afiliado?: { label: string; url: string }
}

// ─── dados (futuramente pode vir de um CMS ou JSON) ──────────────────────────
export const PRAIAS: Praia[] = [
  {
    slug: 'jurere-sc',
    nome: 'Jurerê Internacional',
    estado: 'Santa Catarina',
    uf: 'SC',
    descricao: 'A praia mais badalada de Florianópolis, com infraestrutura completa e mar calmo ideal para famílias.',
    tags: ['Família', 'Infraestrutura', 'Mar calmo'],
    porto: { slug: 'porto-de-florianopolis', nome: 'Porto de Florianópolis', estado: 'SC', dataFile: '60245.json' },
    afiliado: { label: '🏄 Equipamentos de Praia', url: 'https://www.amazon.com.br/s?k=equipamentos+praia+familia&tag=mareagora-20' },
  },
  {
    slug: 'jericoacoara-ce',
    nome: 'Jericoacoara',
    estado: 'Ceará',
    uf: 'CE',
    descricao: 'Paraíso dos kitesurfistas. Ventos constantes, dunas e pôr do sol inesquecível na Pedra Furada.',
    tags: ['Kitesurf', 'Windsurf', 'Natureza'],
    porto: { slug: 'porto-de-mucuripe-fortaleza', nome: 'Porto de Mucuripe - Fortaleza', estado: 'CE', dataFile: '30340.json' },
    afiliado: { label: '🪁 Kits de Kitesurf', url: 'https://www.amazon.com.br/s?k=kitesurf+iniciante&tag=mareagora-20' },
  },
  {
    slug: 'praia-do-espelho-ba',
    nome: 'Praia do Espelho',
    estado: 'Bahia',
    uf: 'BA',
    descricao: 'Uma das praias mais bonitas do Brasil. Piscinas naturais, falésias coloridas e águas cristalinas.',
    tags: ['Natureza intocada', 'Piscinas naturais', 'Falésia'],
    porto: { slug: 'porto-de-salvador', nome: 'Porto de Salvador', estado: 'BA', dataFile: '40141.json' },
    afiliado: { label: '🤿 Kits de Snorkel', url: 'https://www.amazon.com.br/s?k=kit+snorkel+mergulho&tag=mareagora-20' },
  },
  {
    slug: 'grumari-rj',
    nome: 'Grumari',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    descricao: 'A praia selvagem do Rio. Dentro de APA, sem comércio, com ondas fortes e natureza preservada.',
    tags: ['Surf', 'Natureza', 'Selvagem'],
    porto: { slug: 'rio-de-janeiro-fiscal', nome: 'Rio de Janeiro - Ilha Fiscal', estado: 'RJ', dataFile: '50140.json' },
    afiliado: { label: '🎣 Varas de Surf Fishing', url: 'https://www.amazon.com.br/s?k=vara+surf+fishing&tag=mareagora-20' },
  },
  {
    slug: 'morro-de-sao-paulo-ba',
    nome: 'Morro de São Paulo',
    estado: 'Bahia',
    uf: 'BA',
    descricao: 'Ilha sem carros, com praias enumeradas e uma atmosfera única no litoral baiano.',
    tags: ['Ilha', 'Sem carros', 'Mergulho'],
    porto: { slug: 'porto-de-salvador', nome: 'Porto de Salvador', estado: 'BA', dataFile: '40141.json' },
    afiliado: { label: '🤿 Equipamentos de Mergulho', url: 'https://www.amazon.com.br/s?k=equipamentos+mergulho+snorkel&tag=mareagora-20' },
  },
  {
    slug: 'bombinhas-sc',
    nome: 'Bombinhas',
    estado: 'Santa Catarina',
    uf: 'SC',
    descricao: 'Águas mais transparentes do Sul do Brasil. Ótima para mergulho e snorkel com rica vida marinha.',
    tags: ['Mergulho', 'Snorkel', 'Água cristalina'],
    porto: { slug: 'porto-de-florianopolis', nome: 'Porto de Florianópolis', estado: 'SC', dataFile: '60245.json' },
    afiliado: { label: '🤿 Máscaras de Snorkel', url: 'https://www.amazon.com.br/s?k=mascara+snorkel+full+face&tag=mareagora-20' },
  },
]

const UF_COLORS: Record<string, string> = {
  SC: '#2196c4', CE: '#e05c3a', BA: '#4caf80', RJ: '#9c6dca', SP: '#f0a500',
}

// ─── componente ──────────────────────────────────────────────────────────────
export default function GuiaPraias() {
  const estados = [...new Set(PRAIAS.map((p) => p.estado))]

  return (
    <main className="guia-praias">
      {/* ── Hero ── */}
      <section className="gp-hero">
        <div className="gp-hero-bg" />
        <div className="gp-hero-content">
          <span className="gp-eyebrow">🌊 MaréAgora · Guia de Praias</span>
          <h1>
            Descubra as melhores<br />
            <em>praias do Brasil</em>
          </h1>
          <p>
            Dados de marés em tempo real, condições de ondas e dicas de pesca
            para cada praia — tudo integrado ao MaréAgora.
          </p>
        </div>
        <div className="gp-waves">
          <div className="gp-wave" />
          <div className="gp-wave" />
        </div>
      </section>

      {/* ── AdSense topo ── */}
      <div className="gp-ad-slot">
        <span>Publicidade</span>
      </div>

      {/* ── Grid de praias ── */}
      <section className="gp-grid-section">
        <div className="gp-container">
          <div className="gp-section-header">
            <p className="gp-label">Destinos em destaque</p>
            <h2>Praias com dados de maré ao vivo</h2>
          </div>

          <div className="gp-grid">
            {PRAIAS.map((praia) => (
              <div key={praia.slug} className="gp-card-wrapper">
                <Link href={`/guia-praias/${praia.slug}`} className="gp-card">
                  <div className="gp-card-header">
                    <span
                      className="gp-uf-badge"
                      style={{ background: UF_COLORS[praia.uf] ?? '#2196c4' }}
                    >
                      {praia.uf}
                    </span>
                    <span className="gp-card-estado">{praia.estado}</span>
                  </div>
                  <h3 className="gp-card-nome">{praia.nome}</h3>
                  <p className="gp-card-desc">{praia.descricao}</p>
                  <div className="gp-tags">
                    {praia.tags.map((tag) => (
                      <span key={tag} className="gp-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="gp-card-footer">
                    <span className="gp-live-dot" /> Maré ao vivo
                    <span className="gp-arrow">→</span>
                  </div>
                </Link>

                {praia.afiliado && (
                  <a
                    href={praia.afiliado.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="gp-amazon-btn"
                  >
                    <span>{praia.afiliado.label}</span>
                    <span className="gp-amazon-logo">amazon</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AdSense meio ── */}
      <div className="gp-ad-slot gp-ad-wide">
        <span>Publicidade</span>
      </div>

      {/* ── SEO text block ── */}
      <section className="gp-seo-section">
        <div className="gp-container gp-seo-grid">
          <div>
            <h2>Por que usar o MaréAgora para planejar sua viagem à praia?</h2>
            <p>
              O MaréAgora usa dados oficiais da <strong>Marinha do Brasil</strong> para calcular
              as marés com precisão em mais de 40 portos ao longo do litoral brasileiro.
              Combinamos esses dados com previsões de ondas e vento da <strong>Open-Meteo Marine API</strong>
              para você saber exatamente o que esperar antes de chegar na praia.
            </p>
            <p>
              Seja para surfe, pesca esportiva, mergulho ou simplesmente relaxar na areia,
              conhecer o horário das marés faz toda a diferença para aproveitar o melhor que o
              litoral tem a oferecer.
            </p>
          </div>
          <div>
            <h3>Estados com praias no guia</h3>
            <ul className="gp-estados-list">
              {estados.map((e) => (
                <li key={e}>
                  <span className="gp-check">✓</span> {e}
                </li>
              ))}
            </ul>
            <p className="gp-coming-soon">Em breve: SP, ES, PE, AL, SE, PA, AP e mais</p>
          </div>
        </div>
      </section>

      <style>{styles}</style>
    </main>
  )
}

// ─── estilos ─────────────────────────────────────────────────────────────────
const styles = `
  .guia-praias { background: #04111f; min-height: 100vh; }

  /* Hero */
  .gp-hero {
    position: relative; min-height: 50vh; display: flex;
    align-items: center; justify-content: center;
    text-align: center; padding: 6rem 2rem 8rem; overflow: hidden;
  }
  .gp-hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, #04111f 0%, #0a2340 60%, #0e3a6e 100%);
  }
  .gp-hero-content { position: relative; z-index: 2; max-width: 680px; }
  .gp-eyebrow {
    display: inline-block; font-size: 0.75rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: #2196c4;
    border: 1px solid #2196c4; padding: 0.3rem 1rem;
    border-radius: 100px; margin-bottom: 1.5rem;
  }
  .gp-hero h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 900;
    color: #f0e6c8; line-height: 1.1; margin-bottom: 1rem;
  }
  .gp-hero h1 em { font-style: italic; color: #2196c4; }
  .gp-hero p { color: #d4c49a; font-size: 1.05rem; line-height: 1.7; }

  /* Waves */
  .gp-waves { position: absolute; bottom: 0; left: 0; right: 0; height: 80px; overflow: hidden; }
  .gp-wave {
    position: absolute; bottom: 0; width: 200%; height: 100%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80'%3E%3Cpath fill='%230a2340' d='M0,40 C360,70 720,10 1080,40 C1260,55 1380,30 1440,40 L1440,80 L0,80 Z'/%3E%3C/svg%3E") repeat-x bottom;
    background-size: 50% 100%; animation: gpWave 8s linear infinite;
  }
  .gp-wave:nth-child(2) {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80'%3E%3Cpath fill='%2304111f' fill-opacity='0.8' d='M0,55 C300,20 600,70 900,45 C1100,28 1300,60 1440,50 L1440,80 L0,80 Z'/%3E%3C/svg%3E") repeat-x bottom;
    background-size: 60% 100%; animation: gpWave 12s linear infinite reverse;
  }
  @keyframes gpWave { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* Ad slot */
  .gp-ad-slot {
    background: rgba(14,58,110,0.15);
    border-top: 1px dashed rgba(33,150,196,0.15);
    border-bottom: 1px dashed rgba(33,150,196,0.15);
    padding: 1.2rem; text-align: center;
    color: rgba(212,196,154,0.25); font-size: 0.7rem;
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .gp-ad-wide { min-height: 100px; display: flex; align-items: center; justify-content: center; }

  /* Grid section */
  .gp-grid-section { padding: 4rem 2rem; }
  .gp-container { max-width: 1100px; margin: 0 auto; }
  .gp-section-header { margin-bottom: 2.5rem; }
  .gp-label {
    font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: #2196c4; margin-bottom: 0.5rem;
  }
  .gp-section-header h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.5rem, 3vw, 2.2rem); color: #f0e6c8; font-weight: 700;
  }

  /* Card wrapper */
  .gp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
  }
  .gp-card-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Cards */
  .gp-card {
    background: rgba(14,58,110,0.25);
    border: 1px solid rgba(33,150,196,0.15);
    border-radius: 16px 16px 0 0;
    padding: 1.5rem;
    text-decoration: none; display: flex; flex-direction: column; gap: 0.75rem;
    transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    position: relative; overflow: hidden;
    flex: 1;
  }
  .gp-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #2196c4, transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .gp-card:hover { transform: translateY(-4px); border-color: rgba(33,150,196,0.4); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
  .gp-card:hover::before { opacity: 1; }

  .gp-card-header { display: flex; align-items: center; gap: 0.75rem; }
  .gp-uf-badge {
    font-size: 0.65rem; font-weight: 900; color: white;
    padding: 0.15rem 0.5rem; border-radius: 4px;
  }
  .gp-card-estado { font-size: 0.75rem; color: #7ab8d0; text-transform: uppercase; letter-spacing: 0.05em; }
  .gp-card-nome { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #f0e6c8; margin: 0; }
  .gp-card-desc { font-size: 0.85rem; color: #8a9aaa; line-height: 1.5; margin: 0; }
  .gp-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .gp-tag {
    font-size: 0.65rem; padding: 0.15rem 0.5rem; border-radius: 100px;
    background: rgba(33,150,196,0.1); color: #7ab8d0; border: 1px solid rgba(33,150,196,0.2);
  }
  .gp-card-footer {
    margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(33,150,196,0.1);
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.7rem; font-weight: 700; color: #2196c4; text-transform: uppercase; letter-spacing: 0.1em;
  }
  .gp-live-dot { width: 6px; height: 6px; background: #2196c4; border-radius: 50%; animation: gpPulse 1.5s infinite; }
  .gp-arrow { margin-left: auto; font-size: 1rem; transition: transform 0.2s; }
  .gp-card:hover .gp-arrow { transform: translateX(4px); }

  @keyframes gpPulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

  /* Amazon affiliate button */
  .gp-amazon-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: rgba(255, 153, 0, 0.07);
    border: 1px solid rgba(255, 153, 0, 0.22);
    border-top: none;
    border-radius: 0 0 16px 16px;
    text-decoration: none;
    font-size: 0.75rem;
    color: #ffaa33;
    font-weight: 600;
    transition: background 0.2s, border-color 0.2s;
  }
  .gp-amazon-btn:hover {
    background: rgba(255, 153, 0, 0.15);
    border-color: rgba(255, 153, 0, 0.45);
    color: #ffbb55;
  }
  .gp-amazon-logo {
    font-size: 0.6rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    color: #ff9900;
    text-transform: lowercase;
    border: 1px solid rgba(255,153,0,0.5);
    padding: 0.1rem 0.4rem;
    border-radius: 3px;
    white-space: nowrap;
  }

  /* SEO Section */
  .gp-seo-section { padding: 5rem 2rem; background: #04111f; border-top: 1px solid rgba(33,150,196,0.1); }
  .gp-seo-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 4rem; }
  .gp-seo-section h2 { font-family: 'Playfair Display', serif; font-size: 2rem; color: #f0e6c8; margin-bottom: 1.5rem; }
  .gp-seo-section h3 { font-size: 1.1rem; color: #2196c4; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; }
  .gp-seo-section p { color: #8a9aaa; line-height: 1.8; margin-bottom: 1.2rem; }
  .gp-seo-section strong { color: #d4c49a; }

  .gp-estados-list { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 2rem; }
  .gp-estados-list li { color: #f0e6c8; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; }
  .gp-check { color: #4caf80; font-weight: bold; }
  .gp-coming-soon { font-size: 0.75rem; color: #5a6a7a; font-style: italic; }

  @media (max-width: 768px) {
    .gp-seo-grid { grid-template-columns: 1fr; gap: 3rem; }
    .gp-hero { padding: 4rem 1.5rem 6rem; }
    .gp-grid { grid-template-columns: 1fr; }
  }
`

import Link from 'next/link';

export default function DetectoristasPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400;0,600;1,400&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          min-height: 100vh;
          background: #f5efe6;
          color: #1a120b;
          font-family: 'Lora', Georgia, serif;
          overflow-x: hidden;
        }

        /* HERO */
        .hero {
          position: relative;
          min-height: 580px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 60px 24px 64px;
          background: linear-gradient(160deg, #0d1f1a 0%, #0a3d2e 55%, #1a6b3c 100%);
          overflow: hidden;
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,210,80,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,210,80,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .glow {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,210,80,0.12), transparent 70%);
          top: 10%; right: -100px;
          animation: pulse 4s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%       { transform: scale(1.15); opacity: 1; }
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,210,80,0.12);
          border: 1px solid rgba(255,210,80,0.35);
          border-radius: 4px;
          padding: 5px 14px;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #ffd250;
          margin-bottom: 20px;
          width: fit-content;
          position: relative;
        }

        .hero h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 14vw, 110px);
          line-height: 0.88;
          color: #fff;
          letter-spacing: 1px;
          margin-bottom: 24px;
          position: relative;
        }

        .hero h1 span { color: #ffd250; }

        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.65);
          line-height: 1.75;
          max-width: 520px;
          font-style: italic;
          position: relative;
        }

        .wave-sep {
          display: block;
          width: 100%;
          margin-bottom: -2px;
        }

        /* CONTENT */
        .content {
          max-width: 760px;
          margin: 0 auto;
          padding: 56px 24px 100px;
        }

        /* INTRO */
        .intro {
          background: #fff;
          border-radius: 20px;
          padding: 36px;
          margin-bottom: 48px;
          border-left: 5px solid #ffd250;
          box-shadow: 0 4px 32px rgba(10,40,20,0.08);
        }
        .intro p {
          font-size: 16px;
          line-height: 1.8;
          color: #3d2c1a;
        }
        .intro strong { color: #0a3d2e; }

        /* CARDS GRID */
        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
          color: #0a3d2e;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .section-sub {
          font-size: 14px;
          color: #7a6652;
          font-style: italic;
          margin-bottom: 28px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 56px;
        }
        @media (max-width: 560px) {
          .cards-grid { grid-template-columns: 1fr; }
        }

        .nav-card {
          background: #fff;
          border-radius: 18px;
          padding: 28px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 2px 20px rgba(10,40,20,0.07);
          border: 1px solid transparent;
          transition: all 0.25s;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .nav-card::after {
          content: '→';
          position: absolute;
          bottom: 24px; right: 24px;
          font-size: 20px;
          color: #c5b49a;
          transition: all 0.2s;
        }
        .nav-card:hover {
          border-color: #ffd250;
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(10,40,20,0.12);
        }
        .nav-card:hover::after { color: #ffd250; right: 20px; }

        .nav-card-icon {
          font-size: 36px;
        }
        .nav-card-tag {
          display: inline-block;
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #0a3d2e;
          background: #e6f5ee;
          padding: 3px 10px;
          border-radius: 100px;
          width: fit-content;
        }
        .nav-card-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 0.5px;
          color: #1a120b;
          line-height: 1;
        }
        .nav-card-desc {
          font-size: 13px;
          color: #7a6652;
          line-height: 1.6;
          padding-right: 32px;
        }

        /* STAT ROW */
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 56px;
        }
        @media (max-width: 480px) { .stats { grid-template-columns: 1fr; } }

        .stat {
          background: linear-gradient(135deg, #0a3d2e, #1a6b3c);
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          color: #fff;
        }
        .stat-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          color: #ffd250;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-lbl {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
        }

        /* DIVIDER */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #c5b49a, transparent);
          margin: 48px 0;
        }

        /* CTA */
        .cta {
          background: linear-gradient(135deg, #0a3d2e, #0d5c3e);
          border-radius: 20px;
          padding: 40px 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta::before {
          content: '🔍';
          position: absolute;
          font-size: 120px;
          opacity: 0.06;
          right: -20px; bottom: -20px;
        }
        .cta h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #fff;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .cta p {
          font-size: 15px;
          color: rgba(255,255,255,0.7);
          margin-bottom: 24px;
          line-height: 1.6;
        }
        .cta-btn {
          display: inline-block;
          background: #ffd250;
          color: #0a3d2e;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 14px 32px;
          border-radius: 50px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .cta-btn:hover { background: #fff; transform: translateY(-2px); }
      `}</style>

      <div className="root">

        {/* HERO */}
        <div className="hero">
          <div className="grid-bg" />
          <div className="glow" />
          <div className="hero-tag">🔍 Detectorismo no Brasil</div>
          <h1>
            Detector<br />
            <span>+ Maré</span><br />
            = Achados
          </h1>
          <p className="hero-sub">
            Tudo que um detectorista precisa para dominar as praias brasileiras — tábua de marés, melhores locais, equipamentos e dicas.
          </p>
        </div>

        <svg className="wave-sep" viewBox="0 0 1440 50" preserveAspectRatio="none" height="50"
          style={{ background: 'linear-gradient(160deg, #0d1f1a 0%, #0a3d2e 55%, #1a6b3c 100%)' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0Z" fill="#f5efe6" />
        </svg>

        <div className="content">

          {/* Intro */}
          <div className="intro">
            <p>
              A <strong>maré baixa é o segredo</strong> de todo detectorista experiente. Quando a água recua, ela expõe a areia úmida onde joias, moedas e objetos metálicos ficam concentrados — alguns perdidos há anos. O MaréAgora reúne tudo que você precisa para planejar suas sessões com dados oficiais da Marinha do Brasil.
            </p>
          </div>

          {/* Stats */}
          <div className="stats">
            <div className="stat">
              <div className="stat-val">122+</div>
              <div className="stat-lbl">Praias e Portos</div>
            </div>
            <div className="stat">
              <div className="stat-val">365</div>
              <div className="stat-lbl">Dias de previsão</div>
            </div>
            <div className="stat">
              <div className="stat-val">4</div>
              <div className="stat-lbl">Regiões do Brasil</div>
            </div>
          </div>

          {/* Nav Cards */}
          <p className="section-title">Explore o guia</p>
          <p className="section-sub">Conteúdo especializado para detectoristas brasileiros</p>

          <div className="cards-grid">
            <Link href="/detectoristas/melhores-praias" className="nav-card">
              <div className="nav-card-icon">🏖️</div>
              <div className="nav-card-tag">Por Região</div>
              <div className="nav-card-title">Melhores Praias</div>
              <div className="nav-card-desc">As praias mais produtivas do litoral brasileiro, organizadas por região e amplitude de maré.</div>
            </Link>

            <Link href="/detectoristas/equipamentos" className="nav-card">
              <div className="nav-card-icon">🔍</div>
              <div className="nav-card-tag">Guia Completo</div>
              <div className="nav-card-title">Equipamentos</div>
              <div className="nav-card-desc">Os melhores detectores de metais para praia, acessórios e dicas de configuração.</div>
            </Link>

            <Link href="/detectoristas/mare-baixa" className="nav-card">
              <div className="nav-card-icon">🌊</div>
              <div className="nav-card-tag">Essencial</div>
              <div className="nav-card-title">Maré Baixa</div>
              <div className="nav-card-desc">Entenda o ciclo das marés e como chegar na praia no momento exato para maximizar seus achados.</div>
            </Link>

            <Link href="/" className="nav-card">
              <div className="nav-card-icon">📅</div>
              <div className="nav-card-tag">Dados Oficiais</div>
              <div className="nav-card-title">Tábua de Marés</div>
              <div className="nav-card-desc">Consulte os horários exatos de baixa-mar para mais de 122 praias e portos do Brasil.</div>
            </Link>
          </div>

          <div className="divider" />

          {/* CTA */}
          <div className="cta">
            <h3>Consulte a maré agora</h3>
            <p>Veja os horários de baixa-mar para a praia que você vai visitar hoje.</p>
            <a href="/" className="cta-btn">🌊 Ver Tábua de Marés</a>
          </div>

        </div>
      </div>
    </>
  );
}


import Link from 'next/link';

export default function MelhoresPraias() {
  const regions = [
    {
      name: 'Norte',
      icon: '🌿',
      color: '#1a6b3c',
      bg: '#e6f5ee',
      amplitude: 'Até 7m',
      amplitudeDesc: 'Maior amplitude do Brasil',
      praias: [
        { name: 'São Luís', estado: 'MA', slug: 'sao-luis', nota: '⭐⭐⭐⭐⭐', desc: 'Amplitude gigantesca de até 7m. A baixa-mar expõe centenas de metros de areia. Paraíso para detectoristas.' },
        { name: 'Salinópolis', estado: 'PA', slug: 'salinopolis', nota: '⭐⭐⭐⭐⭐', desc: 'Praias extensas com forte influência de marés. Ótima concentração de objetos na faixa de areia exposta.' },
        { name: 'Belém', estado: 'PA', slug: 'porto-de-belem', nota: '⭐⭐⭐⭐', desc: 'Porto movimentado com histórico de objetos perdidos. Amplitude alta favorece a detecção.' },
      ]
    },
    {
      name: 'Nordeste',
      icon: '☀️',
      color: '#b07d0a',
      bg: '#fff8e6',
      amplitude: '1,5 a 3m',
      amplitudeDesc: 'Boa amplitude, praias lotadas',
      praias: [
        { name: 'Fortaleza', estado: 'CE', slug: 'porto-de-mucuripe-fortaleza', nota: '⭐⭐⭐⭐⭐', desc: 'Praias muito frequentadas por turistas. Alta concentração de joias e objetos perdidos ao longo do ano.' },
        { name: 'Maceió', estado: 'AL', slug: 'maceio', nota: '⭐⭐⭐⭐⭐', desc: 'Piscinas naturais e águas calmas. Turistas perdem muitos objetos nas piscinas rasas durante a maré alta.' },
        { name: 'Salvador', estado: 'BA', slug: 'salvador', nota: '⭐⭐⭐⭐', desc: 'Amplitude razoável e praias históricas. Possibilidade de encontrar moedas e objetos mais antigos.' },
        { name: 'Recife', estado: 'PE', slug: 'recife', nota: '⭐⭐⭐⭐', desc: 'Recifes de corais criam zonas de acúmulo. A baixa-mar expõe áreas ricas em objetos perdidos.' },
      ]
    },
    {
      name: 'Sudeste',
      icon: '🏙️',
      color: '#0a3d55',
      bg: '#e6f4f8',
      amplitude: '0,8 a 1,5m',
      amplitudeDesc: 'Amplitude menor, alta densidade',
      praias: [
        { name: 'Santos', estado: 'SP', slug: 'santos', nota: '⭐⭐⭐⭐⭐', desc: 'Praia urbana com décadas de frequência massiva. Enorme quantidade de objetos perdidos acumulados.' },
        { name: 'Rio de Janeiro', estado: 'RJ', slug: 'rio-de-janeiro-fiscal', nota: '⭐⭐⭐⭐⭐', desc: 'Copacabana e Ipanema recebem milhões de turistas por ano. Altíssima densidade de objetos perdidos.' },
        { name: 'Ubatuba', estado: 'SP', slug: 'ubatuba', nota: '⭐⭐⭐⭐', desc: 'Dezenas de praias isoladas pouco exploradas. Ótimas para quem quer sair do convencional.' },
        { name: 'Vitória', estado: 'ES', slug: 'vitoria', nota: '⭐⭐⭐⭐', desc: 'Praias urbanas movimentadas com boa concentração de turistas e banhistas durante o verão.' },
      ]
    },
    {
      name: 'Sul',
      icon: '🌊',
      color: '#1a3a6e',
      bg: '#eef2fb',
      amplitude: '0,5 a 1,2m',
      amplitudeDesc: 'Menor amplitude, ventos influenciam',
      praias: [
        { name: 'Florianópolis', estado: 'SC', slug: 'florianopolis', nota: '⭐⭐⭐⭐⭐', desc: 'Capital do surf e do turismo no Sul. Praias como Jurerê e Ingleses recebem turistas de alto poder aquisitivo.' },
        { name: 'Balneário Camboriú', estado: 'SC', slug: 'balneario-camboriu', nota: '⭐⭐⭐⭐', desc: 'Praia mais movimentada do Sul. Alta concentração de veraneantes = alto volume de objetos perdidos.' },
        { name: 'Paranaguá', estado: 'PR', slug: 'paranagua', nota: '⭐⭐⭐⭐', desc: 'Porto histórico com amplitude maior para o Sul. Possibilidade de achados mais antigos.' },
      ]
    },
  ];

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
          min-height: 480px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 60px 24px 56px;
          background: linear-gradient(160deg, #1a2a0a 0%, #2a4a0d 55%, #3d6b1a 100%);
          overflow: hidden;
        }

        .hero-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,210,80,0.15) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          position: relative;
        }
        .breadcrumb a {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .breadcrumb a:hover { color: #ffd250; }
        .breadcrumb span { color: rgba(255,255,255,0.3); font-size: 12px; }
        .breadcrumb .current {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          color: #ffd250;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .hero h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 12vw, 90px);
          line-height: 0.9;
          color: #fff;
          margin-bottom: 20px;
          position: relative;
        }
        .hero h1 span { color: #ffd250; }

        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          max-width: 500px;
          font-style: italic;
          position: relative;
        }

        .wave-sep { display: block; width: 100%; margin-bottom: -2px; }

        /* CONTENT */
        .content {
          max-width: 760px;
          margin: 0 auto;
          padding: 56px 24px 100px;
        }

        /* REGION */
        .region {
          margin-bottom: 56px;
        }

        .region-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          border-radius: 16px 16px 0 0;
          margin-bottom: 0;
        }

        .region-icon {
          font-size: 28px;
        }

        .region-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 1px;
          flex: 1;
        }

        .region-amplitude {
          text-align: right;
        }
        .region-amplitude-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.5px;
        }
        .region-amplitude-desc {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0.7;
          display: block;
        }

        .praias-list {
          background: #fff;
          border-radius: 0 0 16px 16px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(10,30,10,0.08);
        }

        .praia-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          border-bottom: 1px solid #f0e8dc;
          text-decoration: none;
          color: inherit;
          transition: background 0.15s;
        }
        .praia-item:last-child { border-bottom: none; }
        .praia-item:hover { background: #fdf9f4; }

        .praia-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #c5b49a;
          width: 28px;
          flex-shrink: 0;
          padding-top: 2px;
        }

        .praia-info { flex: 1; }

        .praia-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }

        .praia-name {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #1a120b;
        }

        .praia-estado {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #7a6652;
          background: #f0e8dc;
          padding: 2px 8px;
          border-radius: 100px;
        }

        .praia-nota { font-size: 12px; }

        .praia-desc {
          font-size: 13px;
          color: #7a6652;
          line-height: 1.55;
        }

        .praia-arrow {
          font-size: 16px;
          color: #c5b49a;
          padding-top: 4px;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .praia-item:hover .praia-arrow { color: #ffd250; transform: translateX(3px); }

        /* TIP BOX */
        .tip-box {
          background: linear-gradient(135deg, #fff8e6, #fff3d0);
          border: 1px solid #ffd250;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 48px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .tip-box-icon { font-size: 28px; flex-shrink: 0; }
        .tip-box-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #7a5a00;
          margin-bottom: 6px;
        }
        .tip-box-text { font-size: 14px; color: #5a4a1a; line-height: 1.65; }

        /* CTA */
        .cta {
          background: linear-gradient(135deg, #0a3d2e, #1a6b3c);
          border-radius: 20px;
          padding: 40px 32px;
          text-align: center;
        }
        .cta h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #fff;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .cta p { font-size: 15px; color: rgba(255,255,255,0.7); margin-bottom: 24px; line-height: 1.6; }
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

        <div className="hero">
          <div className="hero-dots" />

          <div className="breadcrumb">
            <a href="/detectoristas">Detectoristas</a>
            <span>›</span>
            <span className="current">Melhores Praias</span>
          </div>

          <h1>
            Melhores <span>Praias</span><br />
            para Detectar
          </h1>
          <p className="hero-sub">
            As praias mais produtivas do litoral brasileiro, ranqueadas pela amplitude de maré, frequência de turistas e potencial de achados.
          </p>
        </div>

        <svg className="wave-sep" viewBox="0 0 1440 50" preserveAspectRatio="none" height="50"
          style={{ background: 'linear-gradient(160deg, #1a2a0a 0%, #2a4a0d 55%, #3d6b1a 100%)' }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0Z" fill="#f5efe6" />
        </svg>

        <div className="content">

          <div className="tip-box">
            <div className="tip-box-icon">💡</div>
            <div>
              <div className="tip-box-title">Como usar este guia</div>
              <p className="tip-box-text">Clique em qualquer praia para ver os horários exatos de baixa-mar. Lembre-se: chegue <strong>2 horas antes da baixa-mar</strong> para aproveitar ao máximo a janela de detecção.</p>
            </div>
          </div>

          {regions.map((region, ri) => (
            <div className="region" key={region.name}>
              <div className="region-header" style={{ background: region.bg }}>
                <div className="region-icon">{region.icon}</div>
                <div className="region-name" style={{ color: region.color }}>{region.name}</div>
                <div className="region-amplitude" style={{ color: region.color }}>
                  <div className="region-amplitude-val">{region.amplitude}</div>
                  <span className="region-amplitude-desc">{region.amplitudeDesc}</span>
                </div>
              </div>
              <div className="praias-list">
                {region.praias.map((p, i) => (
                  <a key={p.slug} href={`/mare/${p.slug}`} className="praia-item">
                    <div className="praia-num">{i + 1}</div>
                    <div className="praia-info">
                      <div className="praia-top">
                        <span className="praia-name">{p.name}</span>
                        <span className="praia-estado">{p.estado}</span>
                        <span className="praia-nota">{p.nota}</span>
                      </div>
                      <div className="praia-desc">{p.desc}</div>
                    </div>
                    <div className="praia-arrow">›</div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="cta">
            <h3>Ver tábua completa</h3>
            <p>Consulte os horários de baixa-mar para qualquer praia do Brasil, com dados oficiais da Marinha.</p>
            <a href="/" className="cta-btn">🌊 Ver Todas as Praias</a>
          </div>

        </div>
      </div>
    </>
  );
}


"use client";

import { useState } from "react";

export default function ContatoPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("contatos@mareagora.com.br");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .contato-root {
          min-height: 100vh;
          background: #f0f4f8;
          font-family: 'Inter', sans-serif;
          color: #0a1628;
          overflow-x: hidden;
        }

        /* HERO */
        .hero {
          position: relative;
          padding: 100px 24px 80px;
          text-align: center;
          background: linear-gradient(160deg, #0a1f44 0%, #0e3a6e 60%, #0a7ea4 100%);
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 120%, rgba(0,180,255,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        /* animated wave circles */
        .wave-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(0,180,255,0.15);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: expand 6s linear infinite;
        }
        .wave-ring:nth-child(2) { animation-delay: 2s; }
        .wave-ring:nth-child(3) { animation-delay: 4s; }

        @keyframes expand {
          0%   { width: 80px;  height: 80px;  opacity: 0.6; }
          100% { width: 600px; height: 600px; opacity: 0; }
        }

        .hero-label {
          display: inline-block;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #38bdf8;
          margin-bottom: 20px;
          padding: 6px 16px;
          border: 1px solid rgba(56,189,248,0.3);
          border-radius: 100px;
        }

        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 8vw, 64px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 20px;
          position: relative;
        }

        .hero h1 span {
          color: #38bdf8;
        }

        .hero p {
          font-size: 16px;
          color: rgba(255,255,255,0.65);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 300;
          position: relative;
        }

        /* WAVE SVG */
        .wave-divider {
          display: block;
          width: 100%;
          margin-bottom: -2px;
          background: linear-gradient(160deg, #0a1f44 0%, #0e3a6e 60%, #0a7ea4 100%);
        }

        /* CONTENT */
        .content {
          max-width: 680px;
          margin: 0 auto;
          padding: 60px 24px 100px;
        }

        /* EMAIL CARD */
        .email-card {
          background: #fff;
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 32px;
          box-shadow: 0 4px 40px rgba(10,30,70,0.08);
          position: relative;
          overflow: hidden;
        }

        .email-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0a7ea4, #38bdf8);
        }

        .email-card-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #0a7ea4;
          margin-bottom: 16px;
        }

        .email-display {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .email-address {
          font-family: 'Syne', sans-serif;
          font-size: clamp(18px, 4vw, 26px);
          font-weight: 700;
          color: #0a1628;
          flex: 1;
          min-width: 200px;
        }

        .copy-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #0a1f44;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .copy-btn:hover { background: #0a7ea4; transform: translateY(-1px); }
        .copy-btn.copied { background: #059669; }

        .email-desc {
          margin-top: 16px;
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        /* TOPICS */
        .topics-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .topics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }

        @media (max-width: 480px) {
          .topics-grid { grid-template-columns: 1fr; }
        }

        .topic-card {
          background: #fff;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          box-shadow: 0 2px 16px rgba(10,30,70,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .topic-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(10,30,70,0.1);
        }

        .topic-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .topic-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0a1628;
          margin-bottom: 4px;
        }

        .topic-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }

        /* RESPONSE TIME */
        .response-card {
          background: linear-gradient(135deg, #0a1f44, #0e3a6e);
          border-radius: 20px;
          padding: 32px 40px;
          display: flex;
          align-items: center;
          gap: 24px;
          color: #fff;
        }

        .response-icon {
          font-size: 36px;
          flex-shrink: 0;
        }

        .response-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .response-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .email-card { padding: 28px 24px; }
          .response-card { padding: 24px; flex-direction: column; gap: 16px; }
        }
      `}</style>

      <div className="contato-root">
        {/* HERO */}
        <div className="hero">
          <div className="wave-ring" />
          <div className="wave-ring" />
          <div className="wave-ring" />
          <div className="hero-label">Fale conosco</div>
          <h1>Entre em <span>Contato</span></h1>
          <p>Tem dúvidas, sugestões ou quer saber mais sobre as marés? Estamos aqui para ajudar.</p>
        </div>

        {/* Wave divider */}
        <svg className="wave-divider" viewBox="0 0 1440 60" preserveAspectRatio="none" height="60">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="#f0f4f8" />
        </svg>

        {/* CONTENT */}
        <div className="content">

          {/* Email Card */}
          <div className="email-card">
            <div className="email-card-label">📧 E-mail oficial</div>
            <div className="email-display">
              <div className="email-address">contatos@mareagora.com.br</div>
              <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
                {copied ? "✓ Copiado!" : "📋 Copiar"}
              </button>
            </div>
            <p className="email-desc">
              Responderemos o mais breve possível. Para agilizar, descreva sua dúvida ou sugestão com detalhes.
            </p>
          </div>

          {/* Topics */}
          <p className="topics-title">Como podemos ajudar?</p>
          <div className="topics-grid">
            <div className="topic-card">
              <div className="topic-icon">🌊</div>
              <div>
                <div className="topic-title">Dados de Marés</div>
                <div className="topic-desc">Dúvidas sobre horários, alturas ou portos disponíveis</div>
              </div>
            </div>
            <div className="topic-card">
              <div className="topic-icon">🐟</div>
              <div>
                <div className="topic-title">Pesca & Surf</div>
                <div className="topic-desc">Informações para atividades náuticas e esportivas</div>
              </div>
            </div>
            <div className="topic-card">
              <div className="topic-icon">💡</div>
              <div>
                <div className="topic-title">Sugestões</div>
                <div className="topic-desc">Novos portos, funcionalidades ou melhorias no app</div>
              </div>
            </div>
            <div className="topic-card">
              <div className="topic-icon">🐛</div>
              <div>
                <div className="topic-title">Reportar Erro</div>
                <div className="topic-desc">Encontrou algo errado? Nos avise para corrigir</div>
              </div>
            </div>
          </div>

          {/* Response time */}
          <div className="response-card">
            <div className="response-icon">⚡</div>
            <div>
              <div className="response-title">Tempo de resposta</div>
              <div className="response-desc">Respondemos em até 48 horas nos dias úteis. Aos fins de semana pode haver um pequeno atraso.</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

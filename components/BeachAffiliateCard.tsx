// components/BeachAffiliateCard.tsx
// Componente de card de afiliado para hotéis (Booking.com)
// Coloque seu link de afiliado do Booking em praia.afiliado.url

interface Props {
  label: string
  url: string
  nomePraia: string
}

export default function BeachAffiliateCard({ label, url, nomePraia }: Props) {
  return (
    <div className="bac-card">
      <div className="bac-header">
        <span className="bac-icon">🏨</span>
        <div>
          <p className="bac-title">Onde se hospedar</p>
          <p className="bac-sub">Perto de {nomePraia}</p>
        </div>
      </div>
      <p className="bac-desc">
        Compare preços e encontre a melhor hospedagem para sua viagem.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="bac-btn"
      >
        {label} →
      </a>
      <p className="bac-disclaimer">* Link de parceiro. Sem custo adicional para você.</p>

      <style>{`
        .bac-card {
          background: linear-gradient(135deg, rgba(14,58,110,0.4), rgba(10,35,64,0.6));
          border: 1px solid rgba(33,150,196,0.25);
          border-radius: 14px;
          padding: 1.25rem;
        }
        .bac-header {
          display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;
        }
        .bac-icon { font-size: 1.8rem; }
        .bac-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem; font-weight: 700; color: #f0e6c8; margin: 0;
        }
        .bac-sub { font-size: 0.78rem; color: #7ab8d0; margin: 0; }
        .bac-desc { font-size: 0.82rem; color: #8a9aaa; line-height: 1.6; margin-bottom: 1rem; }
        .bac-btn {
          display: block; text-align: center;
          background: #1a5fa8; color: white;
          padding: 0.75rem 1rem; border-radius: 8px;
          text-decoration: none; font-size: 0.88rem; font-weight: 500;
          transition: background 0.2s;
        }
        .bac-btn:hover { background: #2196c4; }
        .bac-disclaimer { font-size: 0.68rem; color: rgba(138,154,170,0.5); margin-top: 0.5rem; text-align: center; }
      `}</style>
    </div>
  )
}

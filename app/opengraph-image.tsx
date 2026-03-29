import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MaréAgora — Tábua de Marés do Brasil';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #06101e 0%, #0a1f3a 50%, #0d2b4e 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Ondas decorativas */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
          background: 'linear-gradient(180deg, transparent, rgba(38,201,240,0.08))',
          display: 'flex',
        }} />

        {/* Logo triângulo */}
        <div style={{
          width: 120, height: 120,
          borderRadius: '50%',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          border: '3px solid rgba(38,201,240,0.3)',
        }}>
          <div style={{
            width: 0, height: 0,
            borderLeft: '28px solid transparent',
            borderRight: '28px solid transparent',
            borderBottom: '48px solid white',
            marginTop: 8,
            display: 'flex',
          }} />
        </div>

        {/* Nome */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: 'white',
          letterSpacing: '-2px',
          display: 'flex',
          gap: 0,
        }}>
          <span style={{ color: 'white' }}>Maré</span>
          <span style={{ color: '#38c9f0' }}>Agora</span>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.65)',
          marginTop: 16,
          letterSpacing: '1px',
          display: 'flex',
        }}>
          Tábua de Marés do Brasil
        </div>

        {/* Badge Marinha */}
        <div style={{
          marginTop: 40,
          padding: '10px 24px',
          borderRadius: 999,
          border: '1px solid rgba(38,201,240,0.25)',
          background: 'rgba(38,201,240,0.08)',
          color: 'rgba(255,255,255,0.55)',
          fontSize: 18,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}>
          ⚓ Dados Oficiais da Marinha do Brasil
        </div>
      </div>
    ),
    { ...size }
  );
}

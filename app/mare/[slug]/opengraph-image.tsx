import { ImageResponse } from 'next/og';
import { getPortBySlug } from '@/lib/ports';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const port = getPortBySlug(params.slug);
  const portName = port?.name ?? 'MaréAgora';
  const state = port?.state ?? 'Brasil';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #040E1F 0%, #0a1f3d 50%, #0d2b52 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Ondas decorativas no fundo */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.08))',
            borderRadius: '100% 100% 0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '-10%',
            right: '-10%',
            height: '120px',
            background: 'rgba(0,212,255,0.05)',
            borderRadius: '100% 100% 0 0',
          }}
        />

        {/* Círculos decorativos */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(0,212,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'rgba(42,104,246,0.08)',
          }}
        />

        {/* Logo / branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          <span style={{ fontSize: '40px' }}>🌊</span>
          <span
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#00D4FF',
              letterSpacing: '1px',
            }}
          >
            MaréAgora
          </span>
        </div>

        {/* Linha divisória */}
        <div
          style={{
            width: '80px',
            height: '3px',
            background: 'linear-gradient(90deg, #00D4FF, #2a68f6)',
            borderRadius: '2px',
            marginBottom: '32px',
          }}
        />

        {/* Label */}
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '16px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          Tábua de Maré
        </div>

        {/* Nome do porto */}
        <div
          style={{
            fontSize: portName.length > 20 ? '52px' : '68px',
            fontWeight: '900',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '1.1',
            maxWidth: '900px',
            padding: '0 40px',
          }}
        >
          {portName}
        </div>

        {/* Estado */}
        <div
          style={{
            marginTop: '20px',
            fontSize: '22px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {state} · {new Date().getFullYear()}
        </div>

        {/* Badge inferior */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.25)',
            borderRadius: '999px',
            padding: '10px 24px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#00D4FF' }}>
            Dados oficiais da Marinha do Brasil
          </span>
          <span style={{ color: 'rgba(0,212,255,0.4)' }}>·</span>
          <span style={{ fontSize: '14px', color: '#00D4FF' }}>
            mareagora.com.br
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

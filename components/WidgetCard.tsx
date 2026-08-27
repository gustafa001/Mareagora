'use client';

import { useEffect, useState, useCallback } from 'react';
import { formatHeight } from '@/lib/formatHeight';

type Theme = 'light' | 'dark' | 'auto';

interface TideEvent {
  hora: string;
  altura_m: number;
}

interface WidgetCardProps {
  cityName: string;
  state: string;
  nextHigh: TideEvent | null;
  nextLow: TideEvent | null;
  updatedAt: string;
}

const cssVars: Record<Theme, Record<string, string>> = {
  light: {
    '--bg': '#ffffff',
    '--fg': '#0f172a',
    '--muted': '#64748b',
    '--border': '#e2e8f0',
    '--card-bg': '#f8fafc',
    '--accent': '#0284c7',
  },
  dark: {
    '--bg': '#0f172a',
    '--fg': '#f8fafc',
    '--muted': '#94a3b8',
    '--border': '#1e293b',
    '--card-bg': '#1e293b',
    '--accent': '#38bdf8',
  },
  auto: {
    '--bg': 'var(--auto-bg)',
    '--fg': 'var(--auto-fg)',
    '--muted': 'var(--auto-muted)',
    '--border': 'var(--auto-border)',
    '--card-bg': 'var(--auto-card-bg)',
    '--accent': 'var(--auto-accent)',
  },
};

export default function WidgetCard({
  cityName,
  state,
  nextHigh,
  nextLow,
  updatedAt,
}: WidgetCardProps) {
  const [theme, setTheme] = useState<Theme>('auto');
  const [transparent, setTransparent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('theme');
    if (t === 'light' || t === 'dark' || t === 'auto') setTheme(t);
    setTransparent(params.get('transparent') === '1');
  }, []);

  const sendHeight = useCallback(() => {
    const h = document.body.scrollHeight;
    window.parent?.postMessage({ type: 'mareagora-widget-height', height: h }, '*');
  }, []);

  useEffect(() => {
    sendHeight();
    window.addEventListener('resize', sendHeight);
    return () => window.removeEventListener('resize', sendHeight);
  }, [sendHeight]);

  const vars = cssVars[theme];

  return (
    <>
      <style>{`
        :root {
          --auto-bg: #ffffff;
          --auto-fg: #0f172a;
          --auto-muted: #64748b;
          --auto-border: #e2e8f0;
          --auto-card-bg: #f8fafc;
          --auto-accent: #0284c7;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --auto-bg: #0f172a;
            --auto-fg: #f8fafc;
            --auto-muted: #94a3b8;
            --auto-border: #1e293b;
            --auto-card-bg: #1e293b;
            --auto-accent: #38bdf8;
          }
        }
        @media (prefers-color-scheme: light) {
          :root {
            --auto-bg: #ffffff;
            --auto-fg: #0f172a;
            --auto-muted: #64748b;
            --auto-border: #e2e8f0;
            --auto-card-bg: #f8fafc;
            --auto-accent: #0284c7;
          }
        }
      `}</style>
      <main
        style={{
          ...vars,
          background: transparent ? 'transparent' : 'var(--bg)',
          color: 'var(--fg)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minHeight: transparent ? undefined : '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          margin: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 320,
            background: transparent ? 'var(--card-bg)' : 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
            boxShadow: transparent ? 'none' : '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                color: '#fff',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              M
            </div>
            <div>
              <h1 style={{ fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.2, color: 'var(--fg)' }}>
                {cityName}
              </h1>
              <p style={{ fontSize: 11, margin: 0, color: 'var(--muted)' }}>
                {state}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 12, border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', margin: '0 0 4px 0' }}>
                Próxima alta
              </p>
              {nextHigh ? (
                <>
                  <p style={{ fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1, color: 'var(--fg)' }}>
                    {nextHigh.hora}
                  </p>
                  <p style={{ fontSize: 12, margin: '4px 0 0 0', color: 'var(--muted)' }}>
                    {formatHeight(nextHigh.altura_m, 'm')}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>—</p>
              )}
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 12, border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', margin: '0 0 4px 0' }}>
                Próxima baixa
              </p>
              {nextLow ? (
                <>
                  <p style={{ fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1, color: 'var(--fg)' }}>
                    {nextLow.hora}
                  </p>
                  <p style={{ fontSize: 12, margin: '4px 0 0 0', color: 'var(--muted)' }}>
                    {formatHeight(nextLow.altura_m, 'm')}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>—</p>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0 }}>
              Atualizado às {updatedAt}
            </p>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 8,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>
              Dados por{' '}
              <a
                href="https://mareagora.com.br"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
              >
                MaréAgora
              </a>
            </span>
          </div>
        </div>
      </main>
    </>
  );
}

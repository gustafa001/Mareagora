'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PORTS, Port } from '@/lib/ports';
import dynamic from 'next/dynamic';

const BotaoAlertas = dynamic(() => import('@/components/BotaoAlertas'), { ssr: false });

export default function ConfiguracoesPage() {
  const [portSlug, setPortSlug] = useState<string>('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('porto_favorito') || '';
    setPortSlug(stored);
  }, []);

  const handleSave = () => {
    if (!portSlug) return;
    localStorage.setItem('porto_favorito', portSlug);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectedPort: Port | undefined = PORTS.find((p) => p.slug === portSlug);

  return (
    <main style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '0 1rem 4rem' }}>
      {/* Header */}
      <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: '2rem' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: '#0ea5e9', textDecoration: 'none', fontSize: '0.82rem',
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
            padding: '0.4rem 1rem', border: '1px solid rgba(14,165,233,0.3)',
            borderRadius: '100px', background: 'rgba(14,165,233,0.07)',
            transition: 'all 0.2s', marginBottom: '2rem',
          }}
        >
          ← Início
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '14px',
            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
          }}>
            ⚙️
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, lineHeight: 1.1 }}>
              Configurações
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>
              Personalize o MaréAgora
            </p>
          </div>
        </div>

        {/* Card: Porto favorito */}
        <section style={{
          background: 'rgba(14,165,233,0.06)',
          border: '1px solid rgba(14,165,233,0.15)',
          borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem', color: '#f1f5f9' }}>
            🌊 Porto favorito
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.83rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Escolha o porto para receber alertas de maré baixa direto no seu dispositivo.
          </p>

          <select
            id="select-porto-favorito"
            value={portSlug}
            onChange={(e) => { setPortSlug(e.target.value); setSaved(false); }}
            style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
              background: '#1e293b', color: '#f1f5f9',
              border: '1px solid rgba(14,165,233,0.25)',
              fontSize: '0.9rem', marginBottom: '1rem', outline: 'none',
              appearance: 'none', cursor: 'pointer',
            }}
          >
            <option value="">— Selecione um porto —</option>
            {['norte', 'nordeste', 'sudeste', 'sul'].map((regiao) => (
              <optgroup
                key={regiao}
                label={`Região ${regiao.charAt(0).toUpperCase() + regiao.slice(1)}`}
              >
                {PORTS.filter((p) => p.region === regiao).map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} — {p.state}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              id="btn-salvar-porto"
              onClick={handleSave}
              disabled={!portSlug}
              style={{
                padding: '0.65rem 1.5rem', borderRadius: '10px',
                background: portSlug ? 'linear-gradient(135deg, #0ea5e9, #06b6d4)' : '#1e293b',
                color: portSlug ? 'white' : '#475569',
                border: 'none', fontWeight: 800, fontSize: '0.85rem',
                cursor: portSlug ? 'pointer' : 'default', transition: 'all 0.2s',
              }}
            >
              {saved ? '✅ Salvo!' : 'Salvar porto'}
            </button>

            {selectedPort && portSlug && (
              <BotaoAlertas portSlug={portSlug} portName={selectedPort.name} />
            )}
          </div>
        </section>

        {/* Card: Sobre os alertas */}
        <section style={{
          background: 'rgba(30,41,59,0.6)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px', padding: '1.5rem',
        }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', color: '#94a3b8' }}>
            ℹ️ Como funcionam os alertas
          </h2>
          <ul style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
            <li>Os alertas são enviados quando a maré baixa do seu porto favorito estiver chegando nas <strong style={{ color: '#94a3b8' }}>próximas 2 horas</strong></li>
            <li>Você precisa <strong style={{ color: '#94a3b8' }}>autorizar notificações</strong> no seu navegador</li>
            <li>Funciona mesmo com o navegador fechado (após a instalação do app)</li>
            <li>Dados oficiais da <strong style={{ color: '#94a3b8' }}>Marinha do Brasil (DHN)</strong></li>
          </ul>
        </section>

        {/* Link para ver a tábua */}
        {selectedPort && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link
              href={`/mare/${selectedPort.slug}`}
              style={{
                color: '#0ea5e9', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700,
              }}
            >
              Ver tábua de marés de {selectedPort.cityName} →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

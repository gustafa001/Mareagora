'use client'

import { useEffect, useRef, useState } from 'react'
import { PORTS } from '@/lib/ports'
import { getStateSlug } from '@/lib/states'

export default function MapaInterativo() {
  const mapaRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    if (mapaRef.current) return

    const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.min.js'

    const carregarCSS = (): Promise<void> =>
      new Promise((resolve, reject) => {
        const linkExistente = document.querySelector(
          `link[rel="stylesheet"][href="${LEAFLET_CSS}"]`
        ) as HTMLLinkElement | null
        if (linkExistente) {
          resolve()
          return
        }
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = LEAFLET_CSS
        link.onload = () => resolve()
        link.onerror = () => reject(new Error('Falha ao carregar CSS do mapa'))
        document.head.appendChild(link)
      })

    const carregarJS = (): Promise<void> =>
      new Promise((resolve, reject) => {
        const L = (window as any).L
        if (L && L.map) {
          resolve()
          return
        }
        const scriptExistente = document.querySelector(
          `script[src="${LEAFLET_JS}"]`
        ) as HTMLScriptElement | null
        if (scriptExistente) {
          scriptExistente.addEventListener('load', () => resolve(), { once: true })
          scriptExistente.addEventListener('error', () => reject(new Error('Falha ao carregar JS do mapa')), { once: true })
          return
        }
        const script = document.createElement('script')
        script.src = LEAFLET_JS
        script.async = false
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Falha ao carregar Leaflet'))
        document.head.appendChild(script)
      })

    const inicializarMapa = async () => {
      try {
        await carregarCSS()
        await carregarJS()

        const container = containerRef.current
        if (!container) {
          throw new Error('Container do mapa não encontrado')
        }

        const L = (window as any).L
        if (!L || !L.map) {
          throw new Error('Leaflet não carregou corretamente')
        }

        if (mapaRef.current) return

        const mapa = L.map(container, {
          center: [-15.0, -47.5],
          zoom: 4,
          scrollWheelZoom: true,
          zoomControl: true,
        })
        mapaRef.current = mapa

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
          crossOrigin: true,
        }).addTo(mapa)

        const coresRegiao: Record<string, string> = {
          norte: '#0ea5e9',
          nordeste: '#f59e0b',
          sudeste: '#10b981',
          sul: '#8b5cf6',
          especial: '#ec4899',
        }

        const criarIcone = (regiao: string) =>
          L.divIcon({
            className: 'custom-mareagora-icon',
            html: `<div style="
              width:26px;height:26px;border-radius:50%;
              background:${coresRegiao[regiao] ?? '#0ea5e9'};
              border:2px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.4);
              display:flex;align-items:center;justify-content:center;
              font-size:11px;line-height:1;">🌊</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
            popupAnchor: [0, -14],
          })

        PORTS.forEach((porto) => {
          if (
            typeof porto.lat !== 'number' ||
            typeof porto.lon !== 'number' ||
            Number.isNaN(porto.lat) ||
            Number.isNaN(porto.lon)
          ) {
            return
          }
          L.marker([porto.lat, porto.lon], { icon: criarIcone(porto.region) })
            .addTo(mapa)
            .bindPopup(
              `
              <div style="font-family:system-ui,sans-serif;min-width:180px;padding:6px 4px;">
                <div style="font-size:14px;font-weight:700;margin-bottom:3px;color:#0f172a;">
                  ${porto.name}
                </div>
                <div style="font-size:11px;color:#64748b;margin-bottom:10px;">
                  ${porto.cityName ?? porto.state} · ${porto.state} · ${
                (porto.region ?? '').charAt(0).toUpperCase() + (porto.region ?? '').slice(1)
              }
                </div>
                <a href="/mare/${getStateSlug(porto.state)}/${porto.slug}"
                  style="display:inline-flex;align-items:center;justify-content:center;
                  padding:7px 16px;background:#1e3a5f;color:white;border-radius:8px;
                  font-size:12px;text-decoration:none;font-weight:600;letter-spacing:0.2px;
                  box-shadow:0 1px 3px rgba(0,0,0,0.15);">
                  Ver tábua de marés →
                </a>
              </div>
              `,
              { maxWidth: 260, minWidth: 180 }
            )
        })

        requestAnimationFrame(() => {
          mapa.invalidateSize()
          setTimeout(() => mapa.invalidateSize(), 200)
          setTimeout(() => mapa.invalidateSize(), 800)
        })

        setCarregando(false)
      } catch (err: any) {
        console.error('Erro ao inicializar mapa:', err)
        setErro(err?.message ?? 'Erro desconhecido')
        setCarregando(false)
      }
    }

    inicializarMapa()

    const handleResize = () => {
      if (mapaRef.current) {
        mapaRef.current.invalidateSize()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (mapaRef.current) {
        try {
          mapaRef.current.remove()
        } catch {}
        mapaRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={containerRef}
        id="mapa-portos"
        style={{
          height: '520px',
          width: '100%',
          borderRadius: '16px',
          zIndex: 1,
          background: '#0f172a',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {carregando && !erro && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,58,95,0.9))',
              zIndex: 999,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                color: 'white',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.15)',
                  borderTopColor: '#22d3ee',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <div style={{ fontSize: 13, color: '#cbd5e1', letterSpacing: 0.5 }}>
                Carregando mapa interativo...
              </div>
            </div>
          </div>
        )}

        {erro && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(127,29,29,0.95)',
              zIndex: 999,
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'white', maxWidth: 420 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
              <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>
                Não foi possível carregar o mapa
              </div>
              <div style={{ fontSize: 12, color: '#fecaca' }}>
                Erro: {erro}. Por favor, recarregue a página ou verifique sua conexão
                com a internet.
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        #mapa-portos .leaflet-container {
          width: 100%;
          height: 100%;
          font-family: inherit;
          background: #0f172a;
        }
        #mapa-portos .leaflet-control-attribution {
          font-size: 10px;
          background: rgba(15, 23, 42, 0.85) !important;
          color: #94a3b8 !important;
          padding: 3px 8px !important;
        }
        #mapa-portos .leaflet-control-attribution a {
          color: #60a5fa !important;
        }
        #mapa-portos .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
        }
        #mapa-portos .leaflet-popup-content {
          margin: 10px 14px;
        }
        .custom-mareagora-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '16px',
          zIndex: 500,
          background: 'rgba(2,6,23,0.88)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        {[
          { label: 'Norte', cor: '#0ea5e9' },
          { label: 'Nordeste', cor: '#f59e0b' },
          { label: 'Sudeste', cor: '#10b981' },
          { label: 'Sul', cor: '#8b5cf6' },
        ].map((r) => (
          <div
            key={r.label}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                background: r.cor,
                boxShadow: `0 0 0 2px rgba(255,255,255,0.2)`,
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                color: '#e2e8f0',
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
            >
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

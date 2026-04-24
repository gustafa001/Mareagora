'use client'
import { useEffect, useRef } from 'react'
import { PORTS } from '@/lib/ports'

export default function MapaPortos() {
  const mapaRef = useRef<any>(null)

  useEffect(() => {
    if (mapaRef.current) return

    // CSS do Leaflet
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // JS do Leaflet via CDN
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.min.js'
    script.onload = () => {
      // @ts-ignore
      const L = (window as any).L

      const mapa = L.map('mapa-portos').setView([-15.0, -47.5], 4)
      mapaRef.current = mapa

      // Tile gratuito OpenStreetMap, sem API key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapa)

      // Cores por região
      const coresRegiao: Record<string, string> = {
        norte:    '#0ea5e9',
        nordeste: '#f59e0b',
        sudeste:  '#10b981',
        sul:      '#8b5cf6',
      }

      // Ícone customizado por região
      const criarIcone = (regiao: string) => L.divIcon({
        className: '',
        html: `<div style="
          width:26px;height:26px;border-radius:50%;
          background:${coresRegiao[regiao] ?? '#0ea5e9'};
          border:2px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
          font-size:11px;">🌊</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -14],
      })

      // Adiciona marcador para cada porto
      PORTS.forEach(porto => {
        L.marker([porto.lat, porto.lon], { icon: criarIcone(porto.region) })
          .addTo(mapa)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:170px;padding:4px 2px">
              <div style="font-size:13px;font-weight:600;margin-bottom:2px">
                ${porto.name}
              </div>
              <div style="font-size:11px;color:#888;margin-bottom:10px">
                ${porto.state} · ${porto.region.charAt(0).toUpperCase() + porto.region.slice(1)}
              </div>
              <a href="/mare/${porto.slug}"
                style="display:inline-block;padding:5px 14px;
                background:#0ea5e9;color:white;border-radius:6px;
                font-size:12px;text-decoration:none;font-weight:500">
                Ver tábua de marés →
              </a>
            </div>
          `)
      })
    }
    document.head.appendChild(script)

    return () => {
      if (mapaRef.current) {
        mapaRef.current.remove()
        mapaRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div id="mapa-portos" style={{
        height: '520px',
        width: '100%',
        borderRadius: '12px',
        zIndex: 0,
      }} />
      {/* Legenda de regiões */}
      <div style={{
        position: 'absolute', bottom: '24px', left: '12px', zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', borderRadius: '8px',
        padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px'
      }}>
        {[
          { label: 'Norte',    cor: '#0ea5e9' },
          { label: 'Nordeste', cor: '#f59e0b' },
          { label: 'Sudeste',  cor: '#10b981' },
          { label: 'Sul',      cor: '#8b5cf6' },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.cor }} />
            <span style={{ fontSize: 11, color: 'white' }}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

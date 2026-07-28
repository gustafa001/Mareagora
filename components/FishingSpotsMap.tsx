'use client'
import { useEffect, useRef } from 'react'
import { FISHING_SPOTS } from '@/lib/fishingSpots'
import { getStateSlug } from '@/lib/states'
import { PORTS } from '@/lib/ports'

const CORES_TIPO: Record<string, string> = {
  'píer': '#0ea5e9',
  'molhe': '#f97316',
  'praia': '#10b981',
  'costão': '#8b5cf6',
  'rio': '#06b6d4',
  'represa': '#eab308',
}

export default function FishingSpotsMap() {
  const mapaRef = useRef<any>(null)

  useEffect(() => {
    if (mapaRef.current) return

    // CSS do Leaflet (evita duplicar se já foi injetado por outro mapa na página)
    if (!document.querySelector('link[data-leaflet-css]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.setAttribute('data-leaflet-css', 'true')
      document.head.appendChild(link)
    }

    const initMap = () => {
      // @ts-ignore
      const L = (window as any).L
      if (!L || mapaRef.current) return

      const mapa = L.map('mapa-lugares-pesca').setView([-15.0, -47.5], 4)
      mapaRef.current = mapa

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapa)

      const criarIcone = (tipo: string) => L.divIcon({
        className: '',
        html: `<div style="
          width:28px;height:28px;border-radius:50% 50% 50% 0;
          transform:rotate(45deg);
          background:${CORES_TIPO[tipo] ?? '#0ea5e9'};
          border:2px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(-45deg);font-size:12px;">🎣</span>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -26],
      })

      FISHING_SPOTS.forEach(spot => {
        // linka pra tábua de maré do porto mais próximo, quando existir
        const porto = spot.nearestPortSlug ? PORTS.find(p => p.slug === spot.nearestPortSlug) : undefined
        const linkTabua = porto
          ? `<a href="/mare/${getStateSlug(porto.state)}/${porto.slug}"
              style="display:inline-block;padding:5px 14px;background:#0ea5e9;color:white;
              border-radius:6px;font-size:12px;text-decoration:none;font-weight:500;margin-top:8px">
              Ver maré do local →
            </a>`
          : `<a href="/pesca"
              style="display:inline-block;padding:5px 14px;background:#0ea5e9;color:white;
              border-radius:6px;font-size:12px;text-decoration:none;font-weight:500;margin-top:8px">
              Guia de maré para pesca →
            </a>`

        const especies = spot.species?.length
          ? `<div style="font-size:11px;color:#555;margin-top:4px">🐟 ${spot.species.join(', ')}</div>`
          : ''

        L.marker([spot.lat, spot.lon], { icon: criarIcone(spot.type) })
          .addTo(mapa)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:180px;padding:4px 2px">
              <div style="font-size:13px;font-weight:600;margin-bottom:2px">${spot.name}</div>
              <div style="font-size:11px;color:#888">${spot.type} · ${spot.state}</div>
              ${especies}
              ${linkTabua}
            </div>
          `)
      })
    }

    if (!(window as any).L) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      if (mapaRef.current) {
        mapaRef.current.remove()
        mapaRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div id="mapa-lugares-pesca" style={{
        height: '520px',
        width: '100%',
        borderRadius: '12px',
        zIndex: 0,
        background: '#0f172a',
      }} />
      <div style={{
        position: 'absolute', bottom: '24px', left: '12px', zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', borderRadius: '8px',
        padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px'
      }}>
        {Object.entries(CORES_TIPO).map(([tipo, cor]) => (
          <div key={tipo} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: cor }} />
            <span style={{ fontSize: 11, color: 'white', textTransform: 'capitalize' }}>{tipo}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

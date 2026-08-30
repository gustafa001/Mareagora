'use client';
import { getStateSlug } from "@/lib/states";
import { PORTS, getNearestPort, getPortBySlug, type Port } from '@/lib/ports';
import type { GlobalPlace } from '@/lib/globalPlaces';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AD_SLOTS } from '@/lib/adConfig';
import AdSlot from '@/components/ads/AdSlot';
import { getEventosDia } from '@/lib/mare';
import { getNextHighAndLow, tideAtMinute, getMoonAge, getMoonPhase } from '@/lib/tideUtils';

type SearchResult =
  | { type: 'br'; port: Port }
  | { type: 'global'; place: GlobalPlace };

function getCountryFlag(code: string): string {
  try {
    const codePoints = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
}

function normalize(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function HomeHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const globalPlacesRef = useRef<GlobalPlace[] | null>(null);

  const loadGlobalPlaces = useCallback(async () => {
    if (!globalPlacesRef.current) {
      const mod = await import('@/lib/globalPlaces');
      globalPlacesRef.current = mod.GLOBAL_PLACES;
    }
    return globalPlacesRef.current;
  }, []);

  const popularPorts = PORTS.filter(port =>
    ['porto-de-belem', 'porto-de-itaqui', 'porto-de-mucuripe-fortaleza', 'porto-do-recife', 'porto-de-salvador', 'porto-de-santos'].includes(port.slug)
  );

  // ── Gauge de maré ao vivo (porto de referência: Santos) ──
  // liveNow só existe depois de montar no cliente (pós-hidratação), igual
  // ao padrão usado em PortPageContent — evita divergência de horário
  // entre servidor e navegador (bugs de hidratação #418/#423/#425).
  const [liveNow, setLiveNow] = useState<Date | null>(null);
  useEffect(() => {
    setLiveNow(new Date());
    const timer = setInterval(() => setLiveNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const referencePort = getPortBySlug('porto-de-santos');
  const todayStr = liveNow
    ? `${liveNow.getFullYear()}-${String(liveNow.getMonth() + 1).padStart(2, '0')}-${String(liveNow.getDate()).padStart(2, '0')}`
    : '';
  const todayTides = referencePort && todayStr ? getEventosDia(referencePort, todayStr) : [];
  const currentMin = liveNow ? liveNow.getHours() * 60 + liveNow.getMinutes() : null;
  const currentHeight = currentMin !== null && todayTides.length ? tideAtMinute(currentMin, todayTides) : null;
  const { nextHigh, nextLow } = currentMin !== null && todayTides.length
    ? getNextHighAndLow(todayTides, currentMin)
    : { nextHigh: null, nextLow: null };
  const isRising = nextHigh && (!nextLow || nextHigh.hora < nextLow.hora);
  const moon = liveNow ? getMoonPhase(getMoonAge(liveNow)) : null;

  // Curva SVG (polyline simples a partir dos eventos do dia — sem libs novas)
  const curvePoints = (() => {
    if (!todayTides.length) return '';
    const sorted = [...todayTides].sort((a, b) => a.hora.localeCompare(b.hora));
    const heights = sorted.map(t => t.altura_m);
    const maxH = Math.max(...heights);
    const minH = Math.min(...heights);
    const range = maxH - minH || 1;
    const w = 600, h = 70, pad = 10;
    return sorted.map((t, i) => {
      const x = (i / (sorted.length - 1 || 1)) * w;
      const y = pad + (1 - (t.altura_m - minH) / range) * (h - pad * 2);
      return `${x},${y}`;
    }).join(' ');
  })();

  const currentTimeStr = liveNow
    ? liveNow.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
    : '--:--';

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setShowSuggestions(false);
      setResults([]);
      return;
    }

    const q = normalize(query);

    // BR ports
    const brResults: SearchResult[] = PORTS.filter(port => {
      return (
        normalize(port.name).includes(q) ||
        normalize(port.cityName ?? '').includes(q) ||
        normalize(port.state).includes(q) ||
        port.searchNames?.some(sn => normalize(sn).includes(q))
      );
    })
      .slice(0, 6)
      .map(port => ({ type: 'br' as const, port }));

    // Global places (carregado dinamicamente sob demanda)
    const globalPlaces = await loadGlobalPlaces();
    const globalResults: SearchResult[] = globalPlaces.filter(place => {
      return (
        normalize(place.name).includes(q) ||
        normalize(place.countryName).includes(q)
      );
    })
      .slice(0, 8)
      .map(place => ({ type: 'global' as const, place }));

    setResults([...brResults, ...globalResults].slice(0, 12));
    setShowSuggestions(true);
  }, [loadGlobalPlaces]);

  const handleSelect = (result: SearchResult) => {
    setShowSuggestions(false);
    setSearchQuery('');
    if (result.type === 'br') {
      router.push(`/mare/${getStateSlug(result.port.state)}/${result.port.slug}`);
    } else {
      router.push(`/mare-mundo/${result.place.countryCode}/${result.place.slug}`);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada neste navegador');
      return;
    }
    setIsGeolocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = getNearestPort(pos.coords.latitude, pos.coords.longitude);
        setIsGeolocationLoading(false);
        router.push(`/mare/${getStateSlug(nearest.state)}/${nearest.slug}`);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGeolocationLoading(false);
        setShowSuggestions(true);
        searchInputRef.current?.focus();
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-center pt-12 pb-20 px-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20">
            <img src="/logo-mark.png" alt="MaréAgora" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 font-syne">
            MaréAgora
          </h1>
          <p className="text-blue-200/70 font-medium">
            Previsão de maré em tempo real — Brasil e Mundo
          </p>
        </div>

        {/* Gauge de maré ao vivo — porto de referência: Santos */}
        {referencePort && (
          <div className="mb-8 rounded-2xl border border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm p-5">
            <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
              <span className="font-tideMono text-[11px] text-blue-300/70 tracking-wide">
                Estação de referência · <b className="text-white font-bold">{referencePort.cityName || referencePort.name}</b>
              </span>
              {moon && <span className="font-tideMono text-[11px] text-blue-300/70">{moon.icon} {moon.name}</span>}
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-tideMono text-3xl font-bold text-cyan-400">
                {currentHeight !== null ? `${currentHeight.toFixed(2)}m` : '--m'}
              </span>
              <span className="font-tideMono text-[11px] uppercase tracking-wider text-emerald-400">
                {liveNow ? `Agora ${currentTimeStr} — ${isRising ? 'Enchendo' : 'Vazando'}` : 'Carregando…'}
              </span>
            </div>

            {curvePoints && (
              <svg viewBox="0 0 600 70" preserveAspectRatio="none" className="w-full h-16">
                <polyline points={curvePoints} fill="none" stroke="#38c9f0" strokeWidth="2.5" />
              </svg>
            )}

            <div className="flex justify-between font-tideMono text-[11px] text-blue-300/70 pt-3 mt-2 border-t border-white/5">
              <span className="text-orange-400">▼ Baixa {nextLow?.hora ?? '--:--'} · {nextLow?.altura_m != null ? `${nextLow.altura_m.toFixed(2)}m` : '--'}</span>
              <span className="text-cyan-400">▲ Alta {nextHigh?.hora ?? '--:--'} · {nextHigh?.altura_m != null ? `${nextHigh.altura_m.toFixed(2)}m` : '--'}</span>
            </div>
          </div>
        )}

        {/* Search Box */}
        <div className="mb-8 relative">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar porto, praia ou cidade no mundo..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => {
                loadGlobalPlaces();
                if (searchQuery.length >= 2) setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-900/80 border border-blue-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
            />
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xl">
              🔍
            </span>
          </div>

          {/* Dropdown */}
          {showSuggestions && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/97 border border-blue-500/30 rounded-2xl overflow-hidden backdrop-blur-sm max-h-80 overflow-y-auto z-20 shadow-2xl shadow-blue-500/10">
              {/* Group BR */}
              {results.some(r => r.type === 'br') && (
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">🇧🇷 Brasil</p>
                </div>
              )}
              {results.filter(r => r.type === 'br').map((result) => {
                const port = (result as { type: 'br'; port: Port }).port;
                return (
                  <button
                    key={`br-${port.slug}`}
                    onClick={() => handleSelect(result)}
                    className="w-full px-6 py-3 text-left text-white hover:bg-blue-500/20 transition-colors border-b border-slate-800/30 last:border-0 flex items-center gap-3"
                  >
                    <span className="text-lg">🏖️</span>
                    <div>
                      <span className="font-medium">{port.cityName || port.name}</span>
                      <span className="text-slate-400 text-xs ml-2">({port.state})</span>
                    </div>
                  </button>
                );
              })}

              {/* Group Global */}
              {results.some(r => r.type === 'global') && (
                <div className="px-4 pt-3 pb-1 border-t border-slate-800/50">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">🌍 Mundo</p>
                </div>
              )}
              {results.filter(r => r.type === 'global').map((result) => {
                const place = (result as { type: 'global'; place: GlobalPlace }).place;
                const flag = getCountryFlag(place.countryCode);
                return (
                  <button
                    key={`global-${place.slug}`}
                    onClick={() => handleSelect(result)}
                    className="w-full px-6 py-3 text-left text-white hover:bg-cyan-500/10 transition-colors border-b border-slate-800/30 last:border-0 flex items-center gap-3"
                  >
                    <span className="text-lg">{flag}</span>
                    <div>
                      <span className="font-medium">{place.name}</span>
                      <span className="text-slate-400 text-xs ml-2">{place.countryName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sem resultados */}
          {showSuggestions && results.length === 0 && searchQuery.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-blue-500/30 rounded-2xl backdrop-blur-sm z-20 shadow-2xl">
              <div className="px-6 py-4 text-slate-400 text-sm text-center">
                Nenhum local encontrado. Tente outro nome.
              </div>
            </div>
          )}
        </div>

        {/* Portos Populares (Shortcuts) */}
        {popularPorts.length > 0 && (
          <div className="mb-8">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-4 pl-2">
              Acesso Rápido
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {popularPorts.slice(0, 6).map((port) => (
                <button
                  key={port.slug}
                  onClick={() => router.push(`/mare/${getStateSlug(port.state)}/${port.slug}`)}
                  className="px-4 py-3 rounded-xl bg-slate-900/60 border border-blue-500/20 text-white hover:border-cyan-400 hover:bg-slate-900/80 transition-all text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  {port.cityName || port.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Divisor */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <span className="text-slate-400 text-xs uppercase tracking-widest">ou</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        </div>

        {/* Botão Geolocalização */}
        <button
          onClick={handleGeolocation}
          disabled={isGeolocationLoading}
          className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
        >
          {isGeolocationLoading ? (
            <>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Detectando...</span>
            </>
          ) : (
            <>📍 Usar minha localização</>
          )}
        </button>

        {/* Footer links */}
        <div className="text-center mt-8 flex flex-col items-center gap-4">
          <button
            onClick={() => router.push('/portos')}
            className="text-slate-400 hover:text-cyan-400 text-xs uppercase tracking-widest font-medium transition-colors"
          >
            Ver todos os portos →
          </button>
        </div>
      </div>
    </section>
  );
}

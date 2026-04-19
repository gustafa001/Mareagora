'use client';

import { PORTS, getNearestPort, type Port } from '@/lib/ports';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPorts, setFilteredPorts] = useState<Port[]>([]);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Portos principais para mostrar (customize com seus dados)
  const popularPorts = PORTS.filter(
    (port) =>
      ['porto-de-belem', 'porto-de-itaqui', 'porto-de-mucuripe-fortaleza', 'porto-do-recife', 'porto-de-salvador', 'porto-de-santos', 'porto-de-rio-grande', 'porto-de-florianopolis'].includes(
        port.slug
      )
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.length > 0) {
      const lowerQuery = query.toLowerCase();

      const results = PORTS.filter((port) => {
        const nameMatch = port.name.toLowerCase().includes(lowerQuery);
        const cityMatch = port.cityName.toLowerCase().includes(lowerQuery);
        const stateMatch = port.state.toLowerCase().includes(lowerQuery);
        const searchNamesMatch = port.searchNames?.some((sn) =>
          sn.toLowerCase().includes(lowerQuery)
        );

        return nameMatch || cityMatch || stateMatch || searchNamesMatch;
      });

      setFilteredPorts(results);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectPort = (slug: string) => {
    router.push(`/mare/${slug}`);
    setShowSuggestions(false);
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
        router.push(`/mare/${nearest.slug}`);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGeolocationLoading(false);
        setShowSuggestions(true);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-950 to-blue-950 relative overflow-hidden px-4 py-12">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-2xl shadow-blue-500/20">
            <span className="text-4xl">🌊</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 font-syne tracking-tighter">
            MaréAgora
          </h1>

          <p className="text-blue-200/70 font-medium">
            Previsão de maré em tempo real — Dados da Marinha do Brasil
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8 relative">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar porto ou praia..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-900/80 border border-blue-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
            />
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xl">
              🔍
            </span>
          </div>

          {/* Dropdown com sugestões */}
          {showSuggestions && filteredPorts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-blue-500/30 rounded-2xl overflow-hidden backdrop-blur-sm max-h-72 overflow-y-auto z-20 shadow-2xl shadow-blue-500/10">
              {filteredPorts.slice(0, 12).map((port) => (
                <button
                  key={port.slug}
                  onClick={() => handleSelectPort(port.slug)}
                  className="w-full px-6 py-3 text-left text-white hover:bg-blue-500/20 transition-colors border-b border-slate-800/50 last:border-0"
                >
                  <span className="font-medium">{port.cityName || port.name}</span>
                  <span className="text-slate-400 text-sm ml-2">
                    ({port.state})
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Mensagem quando nenhum resultado */}
          {showSuggestions && filteredPorts.length === 0 && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-blue-500/30 rounded-2xl overflow-hidden backdrop-blur-sm z-20 shadow-2xl shadow-blue-500/10">
              <div className="px-6 py-4 text-slate-400 text-sm text-center">
                Nenhum porto encontrado. Tente outro nome.
              </div>
            </div>
          )}
        </div>

        {/* Portos Populares */}
        {popularPorts.length > 0 && (
          <div className="mb-8">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-4 pl-2">
              Portos Populares
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {popularPorts.slice(0, 6).map((port) => (
                <button
                  key={port.slug}
                  onClick={() => handleSelectPort(port.slug)}
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
            <>
              📍 Usar minha localização
            </>
          )}
        </button>

        {/* Link para todos os portos (fallback) */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/portos')}
            className="text-slate-400 hover:text-cyan-400 text-xs uppercase tracking-widest font-medium transition-colors"
          >
            Ver todos os portos →
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-slate-600 text-xs">
          Dados oficiais da Marinha do Brasil • Atualizações a cada 15 minutos
        </p>
      </div>
    </main>
  );
}

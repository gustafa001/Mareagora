'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InstallButton from './InstallButton';
import { PORTS, getNearestPort, getPortBySlug, type Port } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';
import { useRecentPorts } from '@/hooks/useRecentPorts';
import {
  Umbrella, Anchor, Map, Globe, FileText, Building2, MapPin, Loader2,
  Waves, CalendarClock, CalendarDays, TrendingUp, Moon, Sparkles, MoonStar, Fish,
} from 'lucide-react';

interface NavBarProps {
  className?: string;
}

// Ordem pensada por prioridade de uso: Praias e Portos primeiro (conteúdo mais
// buscado), Operação Portuária (nicho) mais pra baixo.
const NAV_LINKS = [
  { href: '/guia-praias', icon: Umbrella, label: 'Praias' },
  { href: '/portos', icon: Anchor, label: 'Portos' },
  { href: '/lugares-de-pesca', icon: Fish, label: 'Pesca' },
  { href: '/estados', icon: Map, label: 'Estados' },
  { href: '/mare-mundo', icon: Globe, label: 'Mundo' },
  { href: '/blog', icon: FileText, label: 'Blog' },
  { href: '/operacoes-portuarias', icon: Building2, label: 'Operação Portuária' },
];

// Menu mobile agrupado em seções, no estilo de apps de maré/pesca de referência.
const NAV_SECTIONS: {
  title: string;
  highlight?: boolean;
  items: { href: string; icon: typeof Umbrella; label: string }[];
}[] = [
  {
    title: 'Marés',
    items: [
      { href: '/mare-hoje', icon: Waves, label: 'Maré hoje' },
      { href: '/mare-amanha', icon: CalendarClock, label: 'Maré amanhã' },
      { href: '/mare-semana', icon: CalendarDays, label: 'Maré da semana' },
      { href: '/coeficiente', icon: TrendingUp, label: 'Coeficiente de maré' },
    ],
  },
  {
    title: 'Lua & Solunar',
    items: [
      { href: '/lua', icon: Moon, label: 'Fases da lua' },
      { href: '/mare-viva', icon: Sparkles, label: 'Maré viva (sizígia)' },
      { href: '/mare-morta', icon: MoonStar, label: 'Maré morta (quadratura)' },
    ],
  },
  {
    title: 'Lugares de pesca',
    highlight: true,
    items: [
      { href: '/lugares-de-pesca', icon: MapPin, label: 'Mapa de pesca' },
      { href: '/pesca', icon: Fish, label: 'Guia: melhor hora pra pescar' },
    ],
  },
  {
    title: 'Explorar',
    items: [
      { href: '/guia-praias', icon: Umbrella, label: 'Praias' },
      { href: '/portos', icon: Anchor, label: 'Portos' },
      { href: '/estados', icon: Map, label: 'Estados' },
      { href: '/mare-mundo', icon: Globe, label: 'Mundo' },
      { href: '/blog', icon: FileText, label: 'Blog' },
      { href: '/operacoes-portuarias', icon: Building2, label: 'Operação Portuária' },
    ],
  },
];

function portHref(port: Port) {
  return `/mare/${getStateSlug(port.state)}/${port.slug}`;
}

export default function NavBar({ className = '' }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { recentSlugs, addRecentPort } = useRecentPorts();

  const recentPorts = useMemo(
    () => recentSlugs.map((slug) => getPortBySlug(slug)).filter((p): p is Port => Boolean(p)),
    [recentSlugs]
  );

  const results = useMemo(() => {
    if (query.trim().length === 0) return [];
    const q = query.toLowerCase();
    return PORTS
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cityName.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q.replace(/\s+/g, '-'))
      )
      .slice(0, 6);
  }, [query]);

  // fecha o menu mobile automaticamente ao navegar
  const closeMenu = () => {
    setMenuOpen(false);
    setQuery('');
  };

  const goToPort = (port: Port) => {
    addRecentPort(port.slug);
    router.push(portHref(port));
    closeMenu();
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
        goToPort(nearest);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGeolocationLoading(false);
        alert('Não foi possível obter sua localização. Tente pesquisar o porto ou praia.');
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  };

  useEffect(() => {
    if (menuOpen) {
      // foca a busca ao abrir, ajuda quem já sabe o que procura
      const t = setTimeout(() => searchRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [menuOpen]);

  return (
    <nav className={`bg-slate-950/80 backdrop-blur-xl border-b border-white/5 text-white sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
              <img
                src="/logo-mark.png"
                alt="MaréAgora"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-black text-base sm:text-2xl tracking-tighter font-syne uppercase whitespace-nowrap">MaréAgora</span>
          </Link>

          {/* Navigation Links — desktop (inalterado, só a ordem do array mudou) */}
          <div className="hidden sm:flex items-center gap-4 md:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
                title={link.label}
              >
                <link.icon className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="text-xs font-semibold uppercase tracking-wide leading-tight text-center whitespace-nowrap">
                  {link.label}
                </span>
              </Link>
            ))}
            <InstallButton variant="desktop" />
          </div>

          {/* Botão hamburguer — mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-200 hover:text-white hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-300 flex-shrink-0"
          >
            <span className="sr-only">{menuOpen ? 'Fechar menu' : 'Abrir menu'}</span>
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span
                className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block w-5 h-0.5 bg-current rounded-full transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Menu deslizante — mobile */}
      <div
        id="mobile-menu"
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[calc(100vh-5rem)] overflow-y-auto' : 'max-h-0'}`}
      >
        <div className="px-4 pb-4 pt-1 flex flex-col gap-2 border-t border-white/5">

          {/* Busca — destaque visual, é o item mais estratégico do menu */}
          <div className="relative mt-3">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar praia ou porto..."
              className="w-full px-4 py-3 pl-11 bg-blue-500/10 border-2 border-blue-400/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 max-h-64 overflow-y-auto">
                {results.map((port) => (
                  <button
                    key={port.id}
                    onClick={() => goToPort(port)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-500/20 transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="font-medium text-white">{port.cityName || port.name}</div>
                    <div className="text-xs text-slate-400">{port.state} • {port.region}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Porto mais próximo */}
          <button
            type="button"
            onClick={handleGeolocation}
            disabled={isGeolocationLoading}
            className="px-4 py-3 rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-3 disabled:opacity-60"
          >
            {isGeolocationLoading ? (
              <Loader2 className="w-[18px] h-[18px] animate-spin" strokeWidth={2} />
            ) : (
              <MapPin className="w-[18px] h-[18px]" strokeWidth={2} />
            )}
            <span className="text-sm font-semibold uppercase tracking-wide">
              {isGeolocationLoading ? 'Localizando...' : 'Praia mais perto de mim'}
            </span>
          </button>

          {/* Vistos recentemente */}
          {recentPorts.length > 0 && query.trim().length === 0 && (
            <div className="pt-1">
              <div className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Vistos recentemente
              </div>
              <div className="flex flex-wrap gap-2">
                {recentPorts.map((port) => (
                  <button
                    key={port.id}
                    onClick={() => goToPort(port)}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800/60 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300"
                  >
                    {port.cityName || port.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-white/5 my-1" />

          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="pt-2">
              <div className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {section.title}
              </div>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={
                      section.highlight
                        ? 'px-4 py-3 rounded-xl text-white bg-blue-500/90 hover:bg-blue-500 border border-blue-400/60 transition-all duration-300 flex items-center gap-3'
                        : 'px-4 py-3 rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-3'
                    }
                  >
                    <item.icon className="w-[18px] h-[18px]" strokeWidth={2} />
                    <span className="text-sm font-semibold uppercase tracking-wide">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Instalar app — destacado, é a alavanca de retorno/engajamento */}
          <div className="rounded-xl border-2 border-blue-400/40 bg-blue-500/10">
            <InstallButton variant="mobile" />
          </div>
        </div>
      </div>
    </nav>
  );
}

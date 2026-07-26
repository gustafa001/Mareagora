'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavBarProps {
  className?: string;
}

const NAV_LINKS = [
  { href: '/portos', icon: '⚓', label: 'Portos' },
  { href: '/estados', icon: '🗺️', label: 'Estados' },
  { href: '/guia-praias', icon: '🏖️', label: 'Praias' },
  { href: '/blog', icon: '📝', label: 'Blog' },
  { href: '/operacoes-portuarias', icon: '🏗️', label: 'Operação Portuária' },
  { href: '/mare-mundo', icon: '🌍', label: 'Mundo' },
];

export default function NavBar({ className = '' }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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

          {/* Navigation Links — desktop */}
          <div className="hidden sm:flex items-center gap-4 md:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
                title={link.label}
              >
                <span className="text-lg leading-none">{link.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wide leading-tight text-center whitespace-nowrap">
                  {link.label}
                </span>
              </Link>
            ))}
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
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-4 pb-4 pt-1 flex flex-col gap-2 border-t border-white/5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-lg leading-none">{link.icon}</span>
              <span className="text-sm font-semibold uppercase tracking-wide">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

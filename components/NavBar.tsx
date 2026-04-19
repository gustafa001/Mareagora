import React from 'react';
import Link from 'next/link';

interface NavBarProps {
  className?: string;
}

export default function NavBar({ className = '' }: NavBarProps) {
  return (
    <nav className={`bg-slate-950/80 backdrop-blur-xl border-b border-white/5 text-white sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
              <span className="text-xl">🌊</span>
            </div>
            <span className="font-black text-xl sm:text-2xl tracking-tighter font-syne uppercase hidden sm:inline">MaréAgora</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
            {/* Portos Link */}
            <Link 
              href="/portos" 
              className="p-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
              title="Portos"
            >
              <span className="text-base sm:text-lg">⚓</span>
              <span className="hidden sm:inline">Portos</span>
            </Link>

            {/* Guia de Praias Link */}
            <Link 
              href="/guia-praias" 
              className="p-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
              title="Guia de Praias"
            >
              <span className="text-base sm:text-lg">🏖️</span>
              <span className="hidden sm:inline">Guia de Praias</span>
            </Link>

            {/* Blog Link */}
            <Link 
              href="/blog" 
              className="p-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
              title="Blog"
            >
              <span className="text-base sm:text-lg">📝</span>
              <span className="hidden sm:inline">Blog</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

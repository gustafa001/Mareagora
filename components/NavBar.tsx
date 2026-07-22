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
          <Link href="/" className="flex flex-col items-center justify-center gap-1.5 hover:opacity-80 transition-all group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
              <span className="text-lg sm:text-xl">🌊</span>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-cyan-300 tracking-wide leading-none whitespace-nowrap">Maré</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
            {/* Portos Link */}
            <Link 
              href="/portos" 
              className="p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
              title="Portos"
            >
              <span className="text-sm sm:text-lg leading-none">⚓</span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide leading-none whitespace-nowrap">Portos</span>
            </Link>

            {/* Guia de Praias Link */}
            <Link 
              href="/guia-praias" 
              className="p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
              title="Guia de Praias"
            >
              <span className="text-sm sm:text-lg leading-none">🏖️</span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide leading-none whitespace-nowrap">Praias</span>
            </Link>

            {/* Câmeras Link */}
            <Link 
              href="/cameras" 
              className="p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
              title="Praias ao Vivo"
            >
              <span className="text-sm sm:text-lg leading-none">📹</span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide leading-none whitespace-nowrap">Câmeras</span>
            </Link>

            {/* Blog Link */}
            <Link 
              href="/blog" 
              className="p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
              title="Blog"
            >
              <span className="text-sm sm:text-lg leading-none">📝</span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide leading-none whitespace-nowrap">Blog</span>
            </Link>

            {/* Operações Portuárias Link */}
            <Link 
              href="/operacoes-portuarias" 
              className="p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-slate-200 hover:text-white bg-slate-800/40 hover:bg-blue-500/20 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
              title="Operações Portuárias"
            >
              <span className="text-sm sm:text-lg leading-none">🏗️</span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide leading-tight text-center max-w-[64px] sm:max-w-none">Operação Portuária</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

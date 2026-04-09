"use client";

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
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
              <span className="text-xl">🌊</span>
            </div>
            <span className="font-black text-xl sm:text-2xl tracking-tighter font-syne uppercase hidden sm:inline">MaréAgora</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
            <Link href="/portos" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span className="text-lg">⚓</span>
              <span className="hidden sm:inline">Portos</span>
            </Link>

            <div className="w-px h-6 bg-white/10 hidden sm:block" />

            <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span className="text-lg">📝</span>
              <span className="hidden sm:inline">Blog</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

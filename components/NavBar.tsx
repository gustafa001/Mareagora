"use client";

import React from 'react';
import Link from 'next/link';

interface NavBarProps {
  className?: string;
}

export default function NavBar({ className = '' }: NavBarProps) {
  return (
    <nav className={`bg-white text-slate-900 shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🌊</span>
            <span className="font-bold text-xl tracking-tight font-syne">MaréAgora</span>
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Início
            </Link>
            <Link href="/portos" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Portos
            </Link>
            <Link href="/sobre" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Sobre
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

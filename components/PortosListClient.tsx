'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Port, Region } from '@/lib/ports';

interface PortosListClientProps {
  initialRegions: Region[];
  allPorts: Port[];
}

export default function PortosListClient({ initialRegions, allPorts }: PortosListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPorts = allPorts.filter(port => {
    const query = searchQuery.toLowerCase();
    return (
      port.name.toLowerCase().includes(query) ||
      port.cityName.toLowerCase().includes(query) ||
      port.state.toLowerCase().includes(query)
    );
  });

  const hasResults = filteredPorts.length > 0;

  return (
    <div className="w-full">
      {/* Barra de Busca */}
      <div className="mb-12 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar porto ou cidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all backdrop-blur-sm"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500">
            🔍
          </span>
        </div>
      </div>

      {!hasResults ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <p className="text-slate-400">Nenhum porto encontrado para "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-4 text-blue-400 hover:underline text-sm"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {initialRegions.map((region, idx) => {
            const regionPorts = filteredPorts.filter(p => p.region === region.id);
            if (regionPorts.length === 0) return null;

            const colors = [
              'from-blue-400 to-cyan-400',
              'from-cyan-400 to-teal-400',
              'from-teal-400 to-emerald-400',
              'from-emerald-400 to-green-400',
              'from-green-400 to-blue-400',
            ];
            const colorClass = colors[idx] || colors[0];

            return (
              <div key={region.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-1 h-8 bg-gradient-to-b ${colorClass} rounded-full`} />
                  <h2 className="text-2xl font-bold text-white">{region.name}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {regionPorts.map((port) => (
                    <Link key={port.slug} href={`/mare/${port.slug}`}
                      className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{port.name}</h4>
                        <svg className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-400">{port.state}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Ver previsão
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

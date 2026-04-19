'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Port } from '@/lib/ports';

interface SearchPortsProps {
  ports: Port[];
}

export default function SearchPorts({ ports }: SearchPortsProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<Port[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      const results = ports
        .filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.state.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q.replace(/\s+/g, '-'))
        )
        .slice(0, 8);
      setFiltered(results);
      setIsOpen(results.length > 0);
    } else {
      setIsOpen(false);
    }
  }, [query, ports]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (port: Port) => {
    router.push(`/mare/${port.slug}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="🔍 Pesquisar praias ou portos..."
          className="w-full px-4 py-3 pl-11 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl text-gray-800 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
        />
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
          {filtered.map((port) => (
            <button
              key={port.id}
              onClick={() => handleSelect(port)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="font-medium text-gray-800">{port.name}</div>
              <div className="text-xs text-gray-500">{port.state} • {port.region}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

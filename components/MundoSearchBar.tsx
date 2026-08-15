'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { GlobalPlace } from '@/lib/globalPlaces';

function getCountryFlag(code: string): string {
  try {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
}

export default function MundoSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalPlace[]>([]);
  const [open, setOpen] = useState(false);

  async function handleChange(value: string) {
    setQuery(value);
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const mod = await import('@/lib/globalPlaces');
    setResults(mod.searchGlobalPlaces(q));
    setOpen(true);
  }

  function go(place: GlobalPlace) {
    setOpen(false);
    setQuery('');
    router.push(`/mare-mundo/${place.countryCode}/${place.slug}`);
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Buscar cidade ou país no mundo..."
          className="w-full px-6 py-4 rounded-2xl bg-slate-900/80 border border-blue-500/30 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl">🔍</span>
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/97 border border-blue-500/30 rounded-2xl overflow-hidden backdrop-blur-sm max-h-80 overflow-y-auto z-20 shadow-2xl shadow-blue-500/10">
          {results.map(place => (
            <button
              key={`${place.countryCode}-${place.slug}`}
              onClick={() => go(place)}
              className="w-full px-5 py-3 text-left text-white hover:bg-cyan-500/10 transition-colors border-b border-slate-800/30 last:border-0 flex items-center gap-3"
            >
              <span className="text-lg">{getCountryFlag(place.countryCode)}</span>
              <span className="font-medium">{place.name}</span>
              <span className="text-slate-400 text-xs ml-auto">{place.countryName}</span>
            </button>
          ))}
        </div>
      )}

      {open && results.length === 0 && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-blue-500/30 rounded-2xl backdrop-blur-sm z-20 shadow-2xl">
          <div className="px-6 py-4 text-slate-400 text-sm text-center">
            Nenhum local encontrado. Tente outro nome.
          </div>
        </div>
      )}
    </div>
  );
}

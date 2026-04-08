'use client';

import { getNearestPort } from '@/lib/ports';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<'locating' | 'error' | 'idle'>('locating');

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }

    const handleLocate = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nearest = getNearestPort(pos.coords.latitude, pos.coords.longitude);
          router.replace(`/mare/${nearest.slug}`);
        },
        () => {
          setStatus('error');
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    };

    handleLocate();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-2xl shadow-blue-500/20 animate-pulse">
          <span className="text-5xl">🌊</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 font-syne tracking-tighter">
          MaréAgora
        </h1>

        {status === 'locating' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
            </div>
            <p className="text-blue-200/60 font-medium uppercase tracking-widest text-xs">
              Detectando sua localização...
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              Não conseguimos detectar sua localização automaticamente. Escolha um porto manualmente para continuar.
            </p>
            <button
              onClick={() => router.push('/portos')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-blue-400 hover:text-white transition-all shadow-xl"
            >
              Ver todos os portos ⚓
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

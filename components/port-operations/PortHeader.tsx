'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Port } from '@/lib/ports';

interface PortHeaderProps {
  port: Port;
  lastUpdated: Date | null;
  isOnline: boolean;
  isUpdating: boolean;
}

export default function PortHeader({ port, lastUpdated, isOnline, isUpdating }: PortHeaderProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const dateStr = now?.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) ?? '--/--/----';
  const timeStr = now?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }) ?? '--:--';

  const updatedLabel = (() => {
    if (!lastUpdated) return 'Aguardando dados...';
    const diffSec = Math.round((Date.now() - lastUpdated.getTime()) / 1000);
    if (diffSec < 60) return 'Atualizado agora';
    const diffMin = Math.round(diffSec / 60);
    return `Atualizado há ${diffMin} min`;
  })();

  return (
    <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0a1220] via-[#0d1a30] to-[#0a1220] p-5 sm:p-7 mb-6 shadow-xl shadow-black/30">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/operacoes-portuarias" className="text-[10px] font-bold text-blue-400 hover:text-white uppercase tracking-widest">
            ← Operações Portuárias
          </Link>
          <h1 className="mt-1 text-2xl sm:text-4xl font-black font-syne text-white uppercase tracking-tight">
            {port.name}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium mt-1">
            {port.cityName} · {port.state}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}
            />
            <span className={`text-xs font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {isUpdating && (
              <span className="text-[10px] text-blue-300 uppercase tracking-wider animate-pulse">· atualizando</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-white font-syne font-bold text-lg sm:text-xl tabular-nums" suppressHydrationWarning>{timeStr}</p>
            <p className="text-slate-500 text-xs" suppressHydrationWarning>{dateStr}</p>
          </div>
          <p className="text-[10px] text-slate-500" suppressHydrationWarning>{updatedLabel}</p>
        </div>
      </div>
    </header>
  );
}

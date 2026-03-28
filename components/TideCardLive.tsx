'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTodayTides, tideAtMinute, getTideStatus } from '@/lib/tideUtils';

type Props = {
  port: { slug: string; name: string; state: string; dataFile: string };
  data?: any;
};

export default function TideCardLive({ port, data: initialData }: Props) {
  const [tideData, setTideData] = useState<any>(initialData || null);
  const [height, setHeight] = useState<number | null>(null);
  const [rising, setRising] = useState<boolean>(true);
  const [nextTide, setNextTide] = useState<{ hora: string; altura_m: number; tipo?: string } | null>(null);

  useEffect(() => {
    if (!tideData && port.dataFile) {
      // Lazy fetch if data is not provided
      const portId = port.dataFile.replace('.json', '');
      fetch(`https://mareagora-api.onrender.com/api/mare/${portId}`)
        .then(res => res.json())
        .then(data => setTideData(data))
        .catch(err => console.error(`Error fetching tide for ${port.name}:`, err));
    }
  }, [port.dataFile, tideData, port.name]);

  useEffect(() => {
    function update() {
      if (!tideData) return;
      const now = new Date();
      const min = now.getHours() * 60 + now.getMinutes();
      const { tides } = getTodayTides(tideData);
      if (!tides || tides.length === 0) return;

      const h = tideAtMinute(min, tides);
      const status = getTideStatus(min, tides);
      setHeight(h);
      setRising(status.rising);
      setNextTide(status.next);
    }

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [tideData]);

  const isLoading = height === null;

  return (
    <Link
      href={`/mare/${port.slug}`}
      className="group relative bg-[rgba(13,34,64,0.75)] border border-[rgba(56,201,240,0.1)] rounded-2xl p-4 hover:bg-[rgba(14,127,190,0.12)] hover:border-[rgba(56,201,240,0.35)] hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm overflow-hidden flex flex-col gap-2"
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(56,201,240,0.08) 0%, transparent 70%)' }} />

      <div className="relative z-10 flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-1">
          <div>
            <div className="font-syne font-bold text-sm text-[var(--white)] group-hover:text-[var(--foam)] transition-colors leading-tight">
              {port.name}
            </div>
            <div className="text-[var(--muted)] text-xs mt-0.5">{port.state}</div>
          </div>
          {!isLoading && (
            <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
              rising
                ? 'bg-[rgba(56,201,240,0.15)] text-[var(--foam)] border border-[rgba(56,201,240,0.3)]'
                : 'bg-[rgba(245,166,35,0.15)] text-[var(--sun)] border border-[rgba(245,166,35,0.3)]'
            }`}>
              {rising ? '↑ Alta' : '↓ Baixa'}
            </span>
          )}
        </div>

        {/* Height */}
        <div className="border-t border-[rgba(56,201,240,0.08)] pt-2">
          {isLoading ? (
            <div className="loading-shimmer h-7 w-20 rounded" />
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="font-syne font-extrabold text-2xl text-[var(--foam)]">
                {height!.toFixed(2)}
              </span>
              <span className="text-[var(--muted)] text-xs">m agora</span>
            </div>
          )}
          {!isLoading && nextTide && (
            <div className="text-[var(--muted)] text-[0.7rem] mt-0.5">
              Próxima: {nextTide.altura_m.toFixed(2)}m às {nextTide.hora}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

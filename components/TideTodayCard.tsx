'use client';

import { getCountdownLabel, type TideEvent } from '@/lib/tideUtils';

interface TideTodayCardProps {
  portName: string;
  stateSlug?: string;
  portSlug?: string;
  todayStr: string;
  currentHeight: number | null;
  isRising: boolean;
  nextHigh: (TideEvent & { dayOffset?: number }) | null;
  nextLow: (TideEvent & { dayOffset?: number }) | null;
  lastHigh: TideEvent | null;
  currentMin: number | null;
  countdownLabel: string | null;
  /** Caminho relativo para compartilhar (padrão: `/mare/{estado}/{cidade}`). */
  sharePath?: string;
  /** Texto da fonte no rodapé (padrão: DHN). */
  sourceNote?: string;
}

function timeToMin(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatHeight(value: number | null | undefined): string {
  if (value == null) return '--';
  return `${value.toFixed(2).replace('.', ',')} m`;
}

export default function TideTodayCard({
  portName,
  stateSlug,
  portSlug,
  todayStr,
  currentHeight,
  isRising,
  nextHigh,
  nextLow,
  lastHigh,
  currentMin,
  countdownLabel,
  sharePath,
  sourceNote = 'Dados oficiais da Marinha (DHN).',
}: TideTodayCardProps) {
  const dateLabel = todayStr.split('-').reverse().join('/');
  const nextEvent = isRising ? nextHigh : nextLow;
  const nextEventLabel = isRising ? 'próxima alta' : 'próxima baixa';

  const isTomorrow = (event: TideEvent & { dayOffset?: number } | null) => {
    if (!event) return false;
    if (typeof event.dayOffset === 'number') return event.dayOffset > 0;
    return currentMin != null && timeToMin(event.hora) <= currentMin;
  };

  const eventSub = (event: (TideEvent & { dayOffset?: number }) | null) => {
    if (!event) return '--';
    if (isTomorrow(event)) return 'amanhã';
    if (currentMin != null) return getCountdownLabel(event.hora, currentMin);
    return event.hora;
  };

  const shareUrl = sharePath
    ? `https://mareagora.com.br${sharePath}`
    : `https://mareagora.com.br/mare/${stateSlug}/${portSlug}`;
  const whatsappText = encodeURIComponent(
    `${portName} — maré hoje, ${dateLabel} | MaréAgora\n${shareUrl}`
  );

  return (
    <section className="relative z-20 -mt-10 md:-mt-12" aria-label={`Resumo da maré de hoje em ${portName}`}>
      <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-b from-[#0d2339] to-[#0b1e31] p-3.5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-4">
          <h2 className="text-lg sm:text-2xl font-extrabold font-syne leading-tight text-white">
            {portName} — maré hoje, {dateLabel}
          </h2>
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-emerald-400 whitespace-nowrap">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
            Atualizado agora
          </span>
        </div>

        <p className="mt-2 sm:mt-3 text-sm sm:text-xl leading-snug text-slate-300">
          Agora:{' '}
          <strong className="text-xl sm:text-3xl font-extrabold text-white">
            {formatHeight(currentHeight)}
          </strong>
          <span className="mx-1">·</span>
          {isRising ? 'enchendo ↑' : 'vazando ↓'}
          {nextEvent && countdownLabel && (
            <>
              <span className="mx-1">·</span>
              {nextEventLabel} <strong className="font-extrabold text-white">{countdownLabel}</strong>
            </>
          )}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="min-w-0 rounded-xl border border-[#234565] bg-[#112b45]/80 px-2.5 py-2.5 sm:px-4 sm:py-3.5">
            <div className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.08em] text-[#7f9ab7] whitespace-nowrap overflow-hidden text-ellipsis">
              Preamar · Passou
            </div>
            <div className="mt-1 text-xl sm:text-3xl font-extrabold tabular-nums text-[#6f87a1]">
              {lastHigh?.hora ?? '--:--'}
            </div>
            <div className="mt-1 text-[10px] sm:text-sm font-semibold text-[#5c748c]">
              {formatHeight(lastHigh?.altura_m)}
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-[#234565] bg-[#112b45]/80 px-2.5 py-2.5 sm:px-4 sm:py-3.5">
            <div className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.08em] text-[#7f9ab7] whitespace-nowrap overflow-hidden text-ellipsis">
              Próxima baixa
            </div>
            <div className="mt-1 text-xl sm:text-3xl font-extrabold tabular-nums text-slate-100">
              {nextLow?.hora ?? '--:--'}
            </div>
            <div className="mt-1 text-[10px] sm:text-sm font-semibold text-[#8aa4bf]">
              {eventSub(nextLow)}
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-[#234565] bg-[#112b45]/80 px-2.5 py-2.5 sm:px-4 sm:py-3.5">
            <div className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.08em] text-[#7f9ab7] whitespace-nowrap overflow-hidden text-ellipsis">
              Próxima alta
            </div>
            <div className="mt-1 text-xl sm:text-3xl font-extrabold tabular-nums text-slate-100">
              {nextHigh?.hora ?? '--:--'}
            </div>
            <div className="mt-1 text-[10px] sm:text-sm font-semibold text-[#8aa4bf]">
              {eventSub(nextHigh)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-2xl border border-[#71879b] bg-[#5b7085] hover:bg-[#6a8197] text-white text-sm font-semibold transition-colors active:scale-95"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Compartilhar no WhatsApp
          </a>
        </div>

        <p className="mt-3 text-[11px] sm:text-sm text-[#7f97b0]">
          {sourceNote}
        </p>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import {
  getNextHighAndLow,
  tideAtMinute,
  minutesUntilTide,
  type TideEvent,
} from '@/lib/tideUtils';

type CardLocale = 'pt' | 'en';

const COPY = {
  pt: {
    now: 'Agora:',
    rising: 'enchendo ↑',
    falling: 'vazando ↓',
    nextHigh: 'próxima alta',
    nextLow: 'próxima baixa',
    passed: 'Preamar · Passou',
    nextLowLabel: 'Próxima baixa',
    nextHighLabel: 'Próxima alta',
    share: 'Compartilhar no WhatsApp',
    tomorrow: 'amanhã',
    source: 'Dados oficiais da Marinha (DHN).',
    estimatedAt: (hhmm: string) => `Estimado às ${hhmm}`,
    estimatedToday: 'Estimativa de hoje',
    title: (name: string, date: string) => `${name} — maré hoje, ${date}`,
    shareText: (name: string, date: string, url: string) =>
      `${name} — maré hoje, ${date} | MaréAgora\n${url}`,
    aria: (name: string) => `Resumo da maré de hoje em ${name}`,
  },
  en: {
    now: 'Now:',
    rising: 'rising ↑',
    falling: 'falling ↓',
    nextHigh: 'next high',
    nextLow: 'next low',
    passed: 'High tide · Passed',
    nextLowLabel: 'Next low',
    nextHighLabel: 'Next high',
    share: 'Share on WhatsApp',
    tomorrow: 'tomorrow',
    source: 'Official Navy tide data (DHN).',
    estimatedAt: (hhmm: string) => `Estimated at ${hhmm}`,
    estimatedToday: "Today's estimate",
    title: (name: string, date: string) => `${name} — tide today, ${date}`,
    shareText: (name: string, date: string, url: string) =>
      `${name} — tide today, ${date} | MaréAgora\n${url}`,
    aria: (name: string) => `Tide summary for today in ${name}`,
  },
} as const;

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
  countdownLabel?: string | null;
  /** Caminho relativo para compartilhar (padrão: `/mare/{estado}/{cidade}`). */
  sharePath?: string;
  /** Texto da fonte no rodapé (padrão: DHN). */
  sourceNote?: string;
  /** Idioma dos textos do card. Padrão: português. */
  locale?: CardLocale;
  /**
   * Dados brutos para recalcular os valores no navegador. Necessário em
   * páginas estáticas (ISR): sem isso, "Agora" e a contagem regressiva
   * ficariam congelados no horário do build. Páginas que já calculam no
   * cliente (BR) ou são dinâmicas (mundo PT) podem omitir.
   */
  liveTides?: {
    today: TideEvent[];
    nextDay: TideEvent[];
    utcOffsetMin: number;
  };
}

function timeToMin(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatHeight(value: number | null | undefined, locale: CardLocale): string {
  if (value == null) return '--';
  const text = value.toFixed(2);
  return `${locale === 'en' ? text : text.replace('.', ',')} m`;
}

function formatCountdown(hora: string, currentMinute: number, locale: CardLocale): string {
  const diff = minutesUntilTide(hora, currentMinute);
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (locale === 'en') {
    if (hours === 0) return `in ${mins}min`;
    if (mins === 0) return `in ${hours}h`;
    return `in ${hours}h ${mins}min`;
  }
  if (hours === 0) return `em ${mins}min`;
  if (mins === 0) return `em ${hours}h`;
  return `em ${hours}h ${mins}min`;
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
  sourceNote,
  locale = 'pt',
  liveTides,
}: TideTodayCardProps) {
  const copy = COPY[locale];

  // Em páginas estáticas (ISR), recalcula no navegador para "Agora" e a
  // contagem não ficarem congelados no horário do build.
  const liveToday = liveTides?.today;
  const liveNextDay = liveTides?.nextDay;
  const liveOffset = liveTides?.utcOffsetMin;
  const [live, setLive] = useState<{
    currentMin: number;
    currentHeight: number;
    isRising: boolean;
    nextHigh: TideEvent | null;
    nextLow: TideEvent | null;
    lastHigh: TideEvent | null;
  } | null>(null);

  useEffect(() => {
    if (!liveToday || liveOffset == null) return;
    const update = () => {
      const now = new Date();
      const placeDate = new Date(now.getTime() + liveOffset * 60 * 1000);
      const min = placeDate.getUTCHours() * 60 + placeDate.getUTCMinutes();
      const { nextHigh: nh, nextLow: nl } = getNextHighAndLow(liveToday, min, liveNextDay);
      const highIn = nh ? minutesUntilTide(nh.hora, min) : null;
      const lowIn = nl ? minutesUntilTide(nl.hora, min) : null;
      const rising = highIn !== null && (lowIn === null || highIn <= lowIn);
      const past = [...liveToday]
        .filter((t) => t.tipo === 'high' && timeToMin(t.hora) <= min)
        .sort((a, b) => timeToMin(a.hora) - timeToMin(b.hora))
        .pop() ?? null;
      setLive({
        currentMin: min,
        currentHeight: tideAtMinute(min, liveToday),
        isRising: rising,
        nextHigh: nh,
        nextLow: nl,
        lastHigh: past ?? lastHigh,
      });
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [liveToday, liveNextDay, liveOffset, lastHigh]);

  const effCurrentMin = live?.currentMin ?? currentMin;
  const effCurrentHeight = live?.currentHeight ?? currentHeight;
  const effIsRising = live?.isRising ?? isRising;
  const effNextHigh = live?.nextHigh ?? nextHigh;
  const effNextLow = live?.nextLow ?? nextLow;
  const effLastHigh = live?.lastHigh ?? lastHigh;

  const dateLabel = todayStr.split('-').reverse().join('/');

  const nextEvent = effIsRising ? effNextHigh : effNextLow;
  const nextEventLabel = effIsRising ? copy.nextHigh : copy.nextLow;
  const countdownText = nextEvent && effCurrentMin != null
    ? formatCountdown(nextEvent.hora, effCurrentMin, locale)
    : (countdownLabel ?? null);

  const isTomorrow = (event: (TideEvent & { dayOffset?: number }) | null) => {
    if (!event) return false;
    if (typeof event.dayOffset === 'number') return event.dayOffset > 0;
    return effCurrentMin != null && timeToMin(event.hora) <= effCurrentMin;
  };

  const eventSub = (event: (TideEvent & { dayOffset?: number }) | null) => {
    if (!event) return '--';
    if (isTomorrow(event)) return copy.tomorrow;
    if (effCurrentMin != null) return formatCountdown(event.hora, effCurrentMin, locale);
    return event.hora;
  };

  const shareUrl = sharePath
    ? `https://mareagora.com.br${sharePath}`
    : `https://mareagora.com.br/mare/${stateSlug}/${portSlug}`;
  const whatsappText = encodeURIComponent(copy.shareText(portName, dateLabel, shareUrl));

  const updatedLabel = effCurrentMin != null
    ? copy.estimatedAt(
        `${String(Math.floor(effCurrentMin / 60)).padStart(2, '0')}:${String(effCurrentMin % 60).padStart(2, '0')}`
      )
    : copy.estimatedToday;

  return (
    <section className="relative z-20 -mt-10 md:-mt-12" aria-label={copy.aria(portName)}>
      <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-b from-[#0d2339] to-[#0b1e31] p-3.5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-4">
          <h2 className="text-lg sm:text-2xl font-extrabold font-syne leading-tight text-white">
            {copy.title(portName, dateLabel)}
          </h2>
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-emerald-400 whitespace-nowrap">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
            {updatedLabel}
          </span>
        </div>

        <p className="mt-2 sm:mt-3 text-sm sm:text-xl leading-snug text-slate-300 min-h-[1.75rem] sm:min-h-[2.25rem]">
          {copy.now}{' '}
          <strong className="text-xl sm:text-3xl font-extrabold text-white">
            {formatHeight(effCurrentHeight, locale)}
          </strong>
          <span className="mx-1">·</span>
          {effIsRising ? copy.rising : copy.falling}
          {nextEvent && countdownText && (
            <>
              <span className="mx-1">·</span>
              {nextEventLabel} <strong className="font-extrabold text-white">{countdownText}</strong>
            </>
          )}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="min-w-0 rounded-xl border border-[#234565] bg-[#112b45]/80 px-2.5 py-2.5 sm:px-4 sm:py-3.5">
            <div className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.08em] text-[#7f9ab7] whitespace-nowrap overflow-hidden text-ellipsis">
              {copy.passed}
            </div>
            <div className="mt-1 text-xl sm:text-3xl font-extrabold tabular-nums text-[#6f87a1]">
              {effLastHigh?.hora ?? '--:--'}
            </div>
            <div className="mt-1 text-[10px] sm:text-sm font-semibold text-[#5c748c]">
              {formatHeight(effLastHigh?.altura_m, locale)}
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-[#234565] bg-[#112b45]/80 px-2.5 py-2.5 sm:px-4 sm:py-3.5">
            <div className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.08em] text-[#7f9ab7] whitespace-nowrap overflow-hidden text-ellipsis">
              {copy.nextLowLabel}
            </div>
            <div className="mt-1 text-xl sm:text-3xl font-extrabold tabular-nums text-slate-100">
              {effNextLow?.hora ?? '--:--'}
            </div>
            <div className="mt-1 text-[10px] sm:text-sm font-semibold text-[#8aa4bf]">
              {eventSub(effNextLow)}
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-[#234565] bg-[#112b45]/80 px-2.5 py-2.5 sm:px-4 sm:py-3.5">
            <div className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.08em] text-[#7f9ab7] whitespace-nowrap overflow-hidden text-ellipsis">
              {copy.nextHighLabel}
            </div>
            <div className="mt-1 text-xl sm:text-3xl font-extrabold tabular-nums text-slate-100">
              {effNextHigh?.hora ?? '--:--'}
            </div>
            <div className="mt-1 text-[10px] sm:text-sm font-semibold text-[#8aa4bf]">
              {eventSub(effNextHigh)}
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
            {copy.share}
          </a>
        </div>

        <p className="mt-3 text-[11px] sm:text-sm text-[#7f97b0]">
          {sourceNote ?? copy.source}
        </p>
      </div>
    </section>
  );
}

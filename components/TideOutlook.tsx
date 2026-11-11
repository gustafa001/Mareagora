import type { Port } from '@/lib/ports';
import { getEventosDia, type MareEvento } from '@/lib/mare';
import { addDays } from '@/lib/tideNow';
import type { HighlightType } from '@/data/porto-seo-config';

interface TideOutlookProps {
  port: Port;
  /** Hoje (AAAA-MM-DD, fuso de Brasília), calculado no servidor. */
  todayStr: string;
  type: HighlightType;
  /** Nome para o título (ex.: "Maceió"). */
  seoName: string;
  days?: number;
}

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function dayLabel(dateStr: string, offset: number): string {
  const wd = WEEKDAYS[new Date(`${dateStr}T12:00:00Z`).getUTCDay()];
  const dd = `${dateStr.slice(8, 10)}/${dateStr.slice(5, 7)}`;
  return `${offset === 0 ? 'Hoje' : wd} ${dd}`;
}

const m = (n: number) => n.toFixed(2).replace('.', ',');

/** Baixamares entre 06:00 e 17:59, quando dá para curtir a praia com luz do dia. */
function daytimeLows(eventos: MareEvento[]): MareEvento[] {
  return eventos.filter(e => {
    if (e.tipo !== 'low') return false;
    const h = Number(e.hora.slice(0, 2));
    return h >= 6 && h < 18;
  });
}

/**
 * Visão dos próximos dias, renderizada no servidor (entra no HTML para o Google).
 * - 'piscinas-naturais': baixamares diurnas, com as mais baixas da semana em destaque.
 * - 'amplitude': diferença entre a maior e a menor altura de cada dia.
 * Só usa as alturas da tábua; não faz afirmações além disso.
 */
export default function TideOutlook({ port, todayStr, type, seoName, days = 7 }: TideOutlookProps) {
  const dates = Array.from({ length: days }, (_, i) => addDays(todayStr, i));
  const byDay = dates.map((d, i) => ({ date: d, label: dayLabel(d, i), eventos: getEventosDia(port, d) }));
  if (byDay.every(d => d.eventos.length === 0)) return null;

  if (type === 'piscinas-naturais') {
    const rows = byDay.map(d => ({ ...d, lows: daytimeLows(d.eventos) }));
    const all = rows.flatMap(r => r.lows.map(l => l.altura_m)).sort((a, b) => a - b);
    if (all.length === 0) return null;
    const cutoff = all[Math.min(2, all.length - 1)]; // 3 mais baixas da semana

    return (
      <section aria-labelledby="outlook-title" className="mt-10">
        <div className="rounded-2xl border border-sky-500/30 bg-slate-900 p-4 sm:p-6 text-slate-200">
          <h2 id="outlook-title" className="text-xl sm:text-2xl font-bold text-white font-syne mb-2">
            Melhores horários de maré para as piscinas naturais de {seoName}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-4">
            Quanto menor a altura da baixamar, mais as piscinas ficam expostas. Veja as baixamares
            de dia (das 6h às 18h) nos próximos {days} dias; as três mais baixas do período estão marcadas.
          </p>
          <ul className="divide-y divide-white/10">
            {rows.map(r => (
              <li key={r.date} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                <span className="font-semibold text-white w-24">{r.label}</span>
                <span className="flex-1 text-sm sm:text-base">
                  {r.lows.length === 0 ? (
                    <span className="text-slate-400">Sem baixamar de dia</span>
                  ) : (
                    r.lows.map((l, i) => (
                      <span key={l.hora} className={l.altura_m <= cutoff ? 'text-sky-300 font-bold' : ''}>
                        {i > 0 && ' · '}
                        {l.hora} ({m(l.altura_m)} m){l.altura_m <= cutoff ? ' ★' : ''}
                      </span>
                    ))
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            Alturas em relação ao nível de referência da tábua de marés da Marinha do Brasil. Confira
            sempre as condições locais antes de entrar no mar.
          </p>
        </div>
      </section>
    );
  }

  if (type === 'amplitude') {
    const rows = byDay
      .filter(d => d.eventos.length >= 2)
      .map(d => {
        const hs = d.eventos.map(e => e.altura_m);
        const min = Math.min(...hs);
        const max = Math.max(...hs);
        return { ...d, min, max, amp: max - min };
      });
    if (rows.length === 0) return null;
    const maxAmp = Math.max(...rows.map(r => r.amp));

    return (
      <section aria-labelledby="outlook-title" className="mt-10">
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-4 sm:p-6 text-slate-200">
          <h2 id="outlook-title" className="text-xl sm:text-2xl font-bold text-white font-syne mb-2">
            Amplitude da maré em {seoName} nos próximos {days} dias
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-4">
            Amplitude é a diferença entre a maior e a menor altura do dia. Nos dias de maior amplitude
            a água sobe e desce mais, e a faixa de areia muda mais ao longo do dia.
          </p>
          <ul className="divide-y divide-white/10">
            {rows.map(r => (
              <li key={r.date} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                <span className="font-semibold text-white w-24">{r.label}</span>
                <span className={`flex-1 text-sm sm:text-base ${r.amp === maxAmp ? 'text-cyan-300 font-bold' : ''}`}>
                  {m(r.amp)} m (de {m(r.min)} m a {m(r.max)} m){r.amp === maxAmp ? ' ★ maior do período' : ''}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            Alturas em relação ao nível de referência da tábua de marés da Marinha do Brasil.
          </p>
        </div>
      </section>
    );
  }

  return null;
}

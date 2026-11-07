import type { Port } from '@/lib/ports';
import { getEventosDia, type MareEvento } from '@/lib/mare';
import { calcCoef } from '@/lib/monthlyTideCalc';
import { getNextHighAndLow } from '@/lib/tideUtils';
import { addDays } from '@/lib/tideNow';
import type { HighlightType } from '@/data/porto-seo-config';

interface TideHighlightProps {
  port: Port;
  todayStr: string;
  type: HighlightType;
}

export default function TideHighlight({ port, todayStr, type }: TideHighlightProps) {
  const eventos: MareEvento[] = getEventosDia(port, todayStr);
  if (!eventos || eventos.length === 0) return null;

  const coef = calcCoef(eventos);

  if (type === 'piscinas-naturais') {
    const baixas = eventos.filter(e => e.tipo === 'low');
    if (baixas.length === 0) return null;

    const baixasStr = baixas
      .map(b => `${b.hora} (${b.altura_m.toFixed(1).replace('.', ',')} m)`)
      .join(' e ');

    return (
      <aside aria-label="Destaque da maré para piscinas naturais" className="w-full">
        <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-blue-950/80 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            <span>🏖️ Destaque do Dia · Piscinas Naturais</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white leading-snug">
            Baixamar hoje às {baixasStr}
          </p>
          <p className="mt-1.5 text-sm sm:text-base text-slate-300 leading-relaxed">
            O melhor momento para as piscinas naturais da Pajuçara costuma ser perto da baixamar.
          </p>
          {coef !== null && (
            <p className="mt-2 text-xs sm:text-sm text-sky-300/90 font-medium">
              Coeficiente de hoje: {coef}.
            </p>
          )}
        </div>
      </aside>
    );
  }

  if (type === 'amplitude') {
    const alturas = eventos.map(e => e.altura_m);
    if (alturas.length < 2) return null;

    const min = Math.min(...alturas);
    const max = Math.max(...alturas);
    const amplitude = max - min;
    const ampStr = amplitude.toFixed(2).replace('.', ',');
    const minStr = min.toFixed(2).replace('.', ',');
    const maxStr = max.toFixed(2).replace('.', ',');

    const brNow = new Date();
    const brHour = Number(brNow.toLocaleTimeString('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit' }));
    const brMin = Number(brNow.toLocaleTimeString('en-GB', { timeZone: 'America/Sao_Paulo', minute: '2-digit' }));
    const currentMinute = brHour * 60 + brMin;

    const amanhaStr = addDays(todayStr, 1);
    const eventosAmanha = getEventosDia(port, amanhaStr);
    const { nextHigh, nextLow } = getNextHighAndLow(eventos, currentMinute, eventosAmanha);

    const proximasPartes: string[] = [];
    if (nextLow) {
      proximasPartes.push(`próxima baixamar às ${nextLow.hora} (${nextLow.altura_m.toFixed(2).replace('.', ',')} m)`);
    }
    if (nextHigh) {
      proximasPartes.push(`próxima preamar às ${nextHigh.hora} (${nextHigh.altura_m.toFixed(2).replace('.', ',')} m)`);
    }

    const proximasTexto = proximasPartes.length > 0
      ? proximasPartes.join('; ').charAt(0).toUpperCase() + proximasPartes.join('; ').slice(1) + '.'
      : null;

    return (
      <aside aria-label="Destaque da maré e amplitude no Golfão Maranhense" className="w-full">
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-blue-950/80 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            <span>🌊 Destaque do Dia · Golfão Maranhense</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white leading-snug">
            Amplitude de hoje: {ampStr} m (de {minStr} m a {maxStr} m)
          </p>
          {proximasTexto && (
            <p className="mt-1.5 text-sm sm:text-base text-slate-300 leading-relaxed">
              {proximasTexto}
            </p>
          )}
          {coef !== null && (
            <p className="mt-2 text-xs sm:text-sm text-cyan-300/90 font-medium">
              Coeficiente de hoje: {coef}.
            </p>
          )}
        </div>
      </aside>
    );
  }

  return null;
}


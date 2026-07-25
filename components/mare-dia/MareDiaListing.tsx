import Link from 'next/link';
import { PORTS, Port } from '@/lib/ports';
import { getEventosDia } from '@/lib/mare';
import { getStateSlug, getStateName } from '@/lib/states';

export interface EstadoDia {
  stateCode: string;
  stateName: string;
  port: Port;
  eventos: { hora: string; altura_m: number; tipo: 'high' | 'low' }[];
}

/** Um porto/praia representante por estado (o primeiro cadastrado), ignorando a região especial (Antártida) */
export function getRepresentativePorts(): Port[] {
  const seen = new Set<string>();
  const reps: Port[] = [];
  for (const p of PORTS) {
    if (p.region === 'especial') continue;
    if (!seen.has(p.state)) {
      seen.add(p.state);
      reps.push(p);
    }
  }
  return reps.sort((a, b) => a.state.localeCompare(b.state));
}

export function buildEstadosDia(dateStr: string): EstadoDia[] {
  return getRepresentativePorts().map((port) => ({
    stateCode: port.state,
    stateName: getStateName(port.state),
    port,
    eventos: getEventosDia(port, dateStr),
  }));
}

function fmtAltura(m: number) {
  return `${m >= 0 ? '+' : ''}${m.toFixed(2)}m`;
}

export default function MareDiaListing({
  estados,
  currentMin,
}: {
  estados: EstadoDia[];
  /** minuto atual (0-1439), para destacar o próximo evento; omitir em páginas de dia futuro */
  currentMin?: number;
}) {
  return (
    <div className="grid gap-3">
      {estados.map((e) => {
        const ordenados = [...e.eventos].sort((a, b) => a.hora.localeCompare(b.hora));
        const timeToMin = (h: string) => {
          const [hh, mm] = h.split(':').map(Number);
          return (hh || 0) * 60 + (mm || 0);
        };
        const proximoIdx = currentMin !== undefined
          ? ordenados.findIndex((ev) => timeToMin(ev.hora) > currentMin)
          : -1;

        return (
          <Link
            key={e.stateCode}
            href={`/mare/${getStateSlug(e.stateCode)}/${e.port.slug}`}
            className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between gap-4 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <div>
              <p className="font-bold text-slate-800">{e.stateName}</p>
              <p className="text-xs text-slate-400">{e.port.cityName}</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {ordenados.length === 0 && (
                <span className="text-xs text-slate-400">Sem dados</span>
              )}
              {ordenados.map((ev, i) => (
                <span
                  key={i}
                  className={`text-xs font-semibold px-2 py-1 rounded-lg border ${
                    ev.tipo === 'high'
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  } ${i === proximoIdx ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
                >
                  {ev.tipo === 'high' ? '▲' : '▼'} {ev.hora} {fmtAltura(ev.altura_m)}
                </span>
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

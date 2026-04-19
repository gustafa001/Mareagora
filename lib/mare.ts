import { Port } from './ports';

export interface MareEvento {
  hora: string;       // "03:40"
  altura_m: number;   // 1.25
  tipo: 'high' | 'low';
  dt_iso: string;     // "2026-04-03T03:40"
}

export interface MareDia {
  data: string;       // "2026-04-03"
  eventos: MareEvento[];
  mares: MareEvento[]; // alias para compatibilidade
}

function inferTipo(eventos: { dt: string; height_m: number }[]): MareEvento[] {
  return eventos.map((ev, i) => {
    const prev = eventos[i - 1]?.height_m ?? ev.height_m;
    const next = eventos[i + 1]?.height_m ?? ev.height_m;
    const tipo: 'high' | 'low' =
      ev.height_m >= prev && ev.height_m >= next ? 'high' : 'low';
    return {
      hora: ev.dt.slice(11, 16),
      altura_m: ev.height_m,
      tipo,
      dt_iso: ev.dt,
    };
  });
}

export function getEventosDia(port: Port, data: string): MareEvento[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require(`../data/mare/${port.dhnId}.json`);
    const eventos = (raw.events as { dt: string; height_m: number }[])
      .filter(ev => ev.dt.startsWith(data));
    return inferTipo(eventos);
  } catch {
    return [];
  }
}

export function getEventosRange(port: Port, dataInicio: string, dias: number): MareDia[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require(`../data/mare/${port.dhnId}.json`);
    const inicio = new Date(`${dataInicio}T00:00:00`);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + dias);

    const porDia: Record<string, { dt: string; height_m: number }[]> = {};
    for (const ev of raw.events as { dt: string; height_m: number }[]) {
      const d = new Date(ev.dt);
      if (d >= inicio && d < fim) {
        const dia = ev.dt.slice(0, 10);
        if (!porDia[dia]) porDia[dia] = [];
        porDia[dia].push(ev);
      }
    }

    return Object.entries(porDia).map(([data, evs]) => {
      const mares = inferTipo(evs);
      return { data, eventos: mares, mares };
    });
  } catch {
    return [];
  }
}

export function getEventosAno(port: Port, ano: number): MareDia[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require(`../data/mare/${port.dhnId}.json`);
    const anoStr = String(ano);

    const porDia: Record<string, { dt: string; height_m: number }[]> = {};
    for (const ev of raw.events as { dt: string; height_m: number }[]) {
      if (ev.dt.startsWith(anoStr)) {
        const dia = ev.dt.slice(0, 10);
        if (!porDia[dia]) porDia[dia] = [];
        porDia[dia].push(ev);
      }
    }

    return Object.entries(porDia).map(([data, evs]) => {
      const mares = inferTipo(evs);
      return { data, eventos: mares, mares };
    });
  } catch {
    return [];
  }
}

export function getMetadata(port: Port): { nivel_medio_m?: number } | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require(`../data/mare/${port.dhnId}.json`);
    return raw.metadata ?? null;
  } catch {
    return null;
  }
}

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

/**
 * Desloca o horário de um evento (dt no formato "YYYY-MM-DDTHH:MM") por N minutos.
 * Usado para aplicar a defasagem (offsetMinutes) de praias-satélite em relação
 * ao porto de referência (ex.: Bertioga = Santos + 15min, Peruíbe = Santos + 20min).
 */
function shiftDt(dt: string, offsetMinutes: number): string {
  if (!offsetMinutes) return dt;
  // dt vem sem timezone (ex: "2026-07-24T00:38"); tratamos como horário local "ingênuo"
  // para não sofrer conversão de fuso ao somar os minutos.
  const [datePart, timePart] = dt.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [h, min] = timePart.split(':').map(Number);

  const base = new Date(y, (m - 1), d, h, min);
  base.setMinutes(base.getMinutes() + offsetMinutes);

  const pad = (n: number) => String(n).padStart(2, '0');
  const newDate = `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`;
  const newTime = `${pad(base.getHours())}:${pad(base.getMinutes())}`;
  return `${newDate}T${newTime}`;
}

function loadShiftedEvents(port: Port): { dt: string; height_m: number }[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const raw = require(`../data/mare/${port.dhnId}.json`);
  const offset = port.offsetMinutes ?? 0;
  return (raw.events as { dt: string; height_m: number }[]).map(ev => ({
    ...ev,
    dt: shiftDt(ev.dt, offset),
  }));
}

export function getEventosDia(port: Port, data: string): MareEvento[] {
  try {
    const eventos = loadShiftedEvents(port).filter(ev => ev.dt.startsWith(data));
    return inferTipo(eventos);
  } catch {
    return [];
  }
}

export function getEventosRange(port: Port, dataInicio: string, dias: number): MareDia[] {
  try {
    const eventosShifted = loadShiftedEvents(port);
    const inicio = new Date(`${dataInicio}T00:00:00`);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + dias);

    const porDia: Record<string, { dt: string; height_m: number }[]> = {};
    for (const ev of eventosShifted) {
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
    const eventosShifted = loadShiftedEvents(port);
    const anoStr = String(ano);

    const porDia: Record<string, { dt: string; height_m: number }[]> = {};
    for (const ev of eventosShifted) {
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

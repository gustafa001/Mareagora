import { getPortBySlug } from './ports';
import { getEventosRange, type MareDia } from './mare';
import { getGlobalTideData } from './globalTide';

interface TideLocationInput {
  slug?: string;
  lat?: number;
  lon?: number;
}

interface TideRouterResult {
  dias: MareDia[];
  fonte: 'dhn-br' | 'neaps-global';
  isEstimate?: boolean;
  stationDistanceKm?: number;
}

export async function getTideForLocation(
  input: TideLocationInput,
  dataInicio: string,
  dias: number
): Promise<TideRouterResult> {
  if (input.slug) {
    const port = getPortBySlug(input.slug);
    if (port) {
      return { dias: getEventosRange(port, dataInicio, dias), fonte: 'dhn-br' };
    }
  }

  if (input.lat === undefined || input.lon === undefined) {
    return { dias: [], fonte: 'neaps-global' };
  }

  const global = await getGlobalTideData(input.lat, input.lon, dias);
  if (!global) return { dias: [], fonte: 'neaps-global' };

  const porDia: Record<string, { dt: string; height_m: number }[]> = {};
  for (const ev of global.events) {
    const dia = ev.dt.slice(0, 10);
    (porDia[dia] ??= []).push(ev);
  }

  const dias_: MareDia[] = Object.entries(porDia).map(([data, evs]) => {
    const mares = evs.map((ev, i, arr) => {
      const prev = arr[i - 1]?.height_m ?? ev.height_m;
      const next = arr[i + 1]?.height_m ?? ev.height_m;
      const tipo: 'high' | 'low' = ev.height_m >= prev && ev.height_m >= next ? 'high' : 'low';
      return { hora: ev.dt.slice(11, 16), altura_m: ev.height_m, tipo, dt_iso: ev.dt };
    });
    return { data, eventos: mares, mares };
  });

  return {
    dias: dias_,
    fonte: 'neaps-global',
    isEstimate: global.metadata.is_estimate,
    stationDistanceKm: global.metadata.station_distance_km,
  };
}

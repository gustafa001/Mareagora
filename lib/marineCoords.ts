/**
 * Coordenadas usadas só nas consultas à Open-Meteo Marine API.
 *
 * Alguns portos ficam em baías/estuários que a grade do modelo de ondas não
 * resolve: a API devolve null na série inteira e o gráfico fica vazio mesmo
 * com cell_selection=sea. Nesses casos consultamos um ponto de mar aberto
 * próximo. Maré e vento continuam usando a coordenada original do porto.
 *
 * Arquivo separado de lib/ports.ts de propósito: componentes de cliente
 * importam este helper e não devem carregar a lista inteira de portos.
 */

interface WaveOverride {
  lat: number; // coordenada do porto (como em lib/ports.ts)
  lon: number;
  waveLat: number; // ponto de mar aberto com dados de onda
  waveLon: number;
}

const WAVE_OVERRIDES: WaveOverride[] = [
  // São Luís (MA) — Baía de São Marcos não tem célula de onda
  { lat: -2.526667, lon: -44.311667, waveLat: -2.35, waveLon: -44.05 },
];

const EPS = 1e-4;

/** Coordenada a usar na Marine API para o local (lat, lon) informado. */
export function getWaveCoords(lat: number, lon: number): { lat: number; lon: number } {
  const o = WAVE_OVERRIDES.find(
    (w) => Math.abs(w.lat - lat) < EPS && Math.abs(w.lon - lon) < EPS
  );
  return o ? { lat: o.waveLat, lon: o.waveLon } : { lat, lon };
}

/** Trecho de query string pronto para a Marine API. */
export function marineLatLon(lat: number, lon: number): string {
  const c = getWaveCoords(lat, lon);
  return `latitude=${c.lat}&longitude=${c.lon}&cell_selection=sea`;
}

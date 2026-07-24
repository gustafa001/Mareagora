/**
 * Tipos compartilhados para o cache de regime de marés.
 * Gerado por: npm run build:tide-regime-cache
 * Arquivo:   data/tide-regime-cache.json
 */

export interface CachedTideRegime {
  regime: 'diurno' | 'semidiurno' | 'misto';
  amplitudeMedia: number;
  amplitudeMax: number;
  stationId: string;
  stationDistanceKm: number;
  isEstimate: boolean;
  computedAt: string;
}

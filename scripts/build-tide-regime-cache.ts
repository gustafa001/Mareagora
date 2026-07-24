import fs from 'fs';
import path from 'path';
import { GLOBAL_PLACES } from '../lib/globalPlaces';
import { getGlobalTideData } from '../lib/globalTide';
import type { CachedTideRegime } from '../lib/tideRegimeCache';

export type { CachedTideRegime };

export function classifyTideRegime(
  events: { dt: string; height_m: number }[]
): { regime: 'diurno' | 'semidiurno' | 'misto'; amplitudeMedia: number; amplitudeMax: number } {
  if (!events || events.length === 0) {
    return { regime: 'semidiurno', amplitudeMedia: 2.0, amplitudeMax: 2.5 };
  }

  const byDay: Record<string, number[]> = {};
  for (const ev of events) {
    const day = ev.dt.slice(0, 10);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(ev.height_m);
  }

  const days = Object.keys(byDay);
  if (days.length === 0) {
    return { regime: 'semidiurno', amplitudeMedia: 2.0, amplitudeMax: 2.5 };
  }

  const dailyRanges: number[] = [];
  const eventCounts: number[] = [];
  let totalDiurnalDiffRatio = 0;
  let daysWithDiurnalDiffCount = 0;

  for (const day of days) {
    const heights = byDay[day];
    eventCounts.push(heights.length);
    const min = Math.min(...heights);
    const max = Math.max(...heights);
    const range = max - min;
    dailyRanges.push(range);

    if (heights.length >= 4) {
      const sorted = [...heights].sort((a, b) => b - a);
      const high1 = sorted[0];
      const high2 = sorted[1];
      const diffHighs = Math.abs(high1 - high2);
      if (range > 0) {
        totalDiurnalDiffRatio += diffHighs / range;
        daysWithDiurnalDiffCount++;
      }
    }
  }

  const avgCount = eventCounts.reduce((a, b) => a + b, 0) / eventCounts.length;
  const amplitudeMedia = Math.round((dailyRanges.reduce((a, b) => a + b, 0) / dailyRanges.length) * 10) / 10;
  const amplitudeMax = Math.round(Math.max(...dailyRanges) * 10) / 10;

  let regime: 'diurno' | 'semidiurno' | 'misto';

  if (avgCount <= 2.5) {
    regime = 'diurno';
  } else if (avgCount >= 3.5) {
    const avgInequalityRatio = daysWithDiurnalDiffCount > 0 ? totalDiurnalDiffRatio / daysWithDiurnalDiffCount : 0;
    if (avgInequalityRatio > 0.35) {
      regime = 'misto';
    } else {
      regime = 'semidiurno';
    }
  } else {
    regime = 'misto';
  }

  return {
    regime,
    amplitudeMedia,
    amplitudeMax,
  };
}

async function buildCache() {
  console.log(`🚀 Iniciando pré-computação do cache de regime de marés para ${GLOBAL_PLACES.length} localidades...`);
  const computedAt = new Date().toISOString().slice(0, 10);
  const resultCache: Record<string, CachedTideRegime> = {};

  const BATCH_SIZE = 25;
  let processedCount = 0;

  for (let i = 0; i < GLOBAL_PLACES.length; i += BATCH_SIZE) {
    const batch = GLOBAL_PLACES.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (place) => {
        const tideData = await getGlobalTideData(place.lat, place.lon, 7);

        if (!tideData || !tideData.events || tideData.events.length === 0) {
          resultCache[place.slug] = {
            regime: 'semidiurno',
            amplitudeMedia: 2.0,
            amplitudeMax: 2.5,
            stationId: 'unknown',
            stationDistanceKm: 0,
            isEstimate: true,
            computedAt,
          };
        } else {
          const { regime, amplitudeMedia, amplitudeMax } = classifyTideRegime(tideData.events);
          resultCache[place.slug] = {
            regime,
            amplitudeMedia,
            amplitudeMax,
            stationId: tideData.metadata.station_id,
            stationDistanceKm: tideData.metadata.station_distance_km,
            isEstimate: tideData.metadata.is_estimate,
            computedAt,
          };
        }
      })
    );

    processedCount += batch.length;
    if (processedCount % 50 === 0 || processedCount === GLOBAL_PLACES.length) {
      console.log(`[${processedCount}/${GLOBAL_PLACES.length}] Processadas ${processedCount} localidades...`);
    }
  }

  const outputPath = path.join(process.cwd(), 'data', 'tide-regime-cache.json');
  fs.writeFileSync(outputPath, JSON.stringify(resultCache, null, 2), 'utf-8');
  console.log(`✅ Cache concluído com sucesso! Salvo em: ${outputPath} (${Object.keys(resultCache).length} entradas)`);
}

buildCache().catch((err) => {
  console.error('❌ Erro na geração do cache de regime de marés:', err);
  process.exit(1);
});

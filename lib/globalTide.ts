import { getExtremesPrediction, nearestStation } from 'neaps';

export interface GlobalTideEvent {
  dt: string;
  height_m: number;
}

export interface GlobalTideData {
  metadata: {
    station_id: string;
    station_name: string;
    station_distance_km: number;
    is_estimate: boolean;
    latitude: number;
    longitude: number;
    nivel_medio_m: number;
    source: 'neaps-harmonic';
  };
  events: GlobalTideEvent[];
}

const DISTANCIA_LIMITE_KM = 75;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getGlobalTideData(
  lat: number,
  lon: number,
  forecastDays: number = 7
): Promise<GlobalTideData | null> {
  try {
    const station = nearestStation({ lat, lon });
    if (!station) return null;

    const distKm = haversineKm(lat, lon, station.latitude, station.longitude);

    const start = new Date();
    start.setUTCDate(start.getUTCDate() - 1);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date();
    end.setUTCDate(end.getUTCDate() + forecastDays);

    const prediction = getExtremesPrediction({
      latitude: lat,
      longitude: lon,
      start,
      end,
      units: 'meters', // sempre calcular em metros; conversão pra pés fica na camada de exibição (Passo 3)
    });

    if (!prediction?.extremes?.length) return null;

    const events: GlobalTideEvent[] = prediction.extremes.map((e: any) => ({
      dt: new Date(e.time).toISOString().slice(0, 16),
      height_m: Math.round(e.level * 100) / 100, // Ajustado de e.height para e.level com base nos testes
    }));

    const nivelMedio =
      events.reduce((acc, e) => acc + e.height_m, 0) / (events.length || 1);

    return {
      metadata: {
        station_id: String(station.id),
        station_name: station.name,
        station_distance_km: Math.round(distKm),
        is_estimate: distKm > DISTANCIA_LIMITE_KM,
        latitude: lat,
        longitude: lon,
        nivel_medio_m: Math.round(nivelMedio * 1000) / 1000,
        source: 'neaps-harmonic',
      },
      events,
    };
  } catch (err) {
    console.error(`Erro no cálculo de maré global (${lat}, ${lon}):`, err);
    return null;
  }
}

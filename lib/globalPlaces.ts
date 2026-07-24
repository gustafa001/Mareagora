export interface GlobalPlace {
  slug: string;
  name: string;
  countryCode: string; // ISO 3166-1 alpha-2, minúsculo — ex: 'pt', 'us', 'au'
  countryName: string;
  lat: number;
  lon: number;
}

export const GLOBAL_PLACES: GlobalPlace[] = [
  { slug: 'lisboa',      name: 'Lisboa',      countryCode: 'pt', countryName: 'Portugal',        lat: 38.7223,  lon: -9.1393 },
  { slug: 'porto',       name: 'Porto',       countryCode: 'pt', countryName: 'Portugal',        lat: 41.1579,  lon: -8.6291 },
  { slug: 'faro',        name: 'Faro',        countryCode: 'pt', countryName: 'Portugal',        lat: 37.0194,  lon: -7.9322 },
  { slug: 'miami',       name: 'Miami',       countryCode: 'us', countryName: 'Estados Unidos',  lat: 25.7617,  lon: -80.1918 },
  { slug: 'bondi-beach', name: 'Bondi Beach', countryCode: 'au', countryName: 'Austrália',        lat: -33.8908, lon: 151.2743 },
  { slug: 'nova-york',   name: 'Nova York',   countryCode: 'us', countryName: 'Estados Unidos',  lat: 40.7128,  lon: -74.0060 },
];

export function getGlobalPlace(countryCode: string, slug: string): GlobalPlace | undefined {
  return GLOBAL_PLACES.find(p => p.countryCode === countryCode && p.slug === slug);
}

export function searchGlobalPlaces(query: string): GlobalPlace[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return GLOBAL_PLACES.filter(
    p => p.name.toLowerCase().includes(q) || p.countryName.toLowerCase().includes(q)
  ).slice(0, 10);
}

export function getPlacesByCountry(countryCode: string): GlobalPlace[] {
  return GLOBAL_PLACES.filter(p => p.countryCode === countryCode);
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Locais próximos, cruzando países — inspirado em getPortosProximos de lib/ports.ts */
export function getNearbyGlobalPlaces(place: GlobalPlace, limit: number = 6) {
  return GLOBAL_PLACES
    .filter(p => p.slug !== place.slug)
    .map(p => ({ place: p, distanciaKm: Math.round(haversineKm(place.lat, place.lon, p.lat, p.lon)) }))
    .sort((a, b) => a.distanciaKm - b.distanciaKm)
    .slice(0, limit);
}

/**
 * MaréAgora — Lugares de Pesca
 * Base de pontos de pesca (píers, molhes, praias, costões) para o mapa
 * de "Lugares de Pesca".
 *
 * Status da verificação (27/07/2026): ✅ 12 de 12 pontos conferidos no Google Maps.
 * 4 deles com coordenada exata extraída da página do local (fs-1, fs-2, fs-4, fs-5);
 * os demais com área geral confirmada visualmente (nível de praia/cidade).
 * Dois nomes foram corrigidos pra bater com o nome real no Maps (fs-4, fs-5, fs-11).
 *
 * Novos pontos podem ser adicionados seguindo o mesmo processo: buscar o nome
 * no Google Maps, abrir a página do local (não a lista de busca) e copiar os
 * números depois de "!3d" (latitude) e "!4d" (longitude) na URL.
 */

export type FishingSpotType = 'píer' | 'molhe' | 'praia' | 'costão' | 'rio' | 'represa';

export interface FishingSpot {
  id: string;
  name: string;
  slug: string;
  type: FishingSpotType;
  state: string;
  region: 'norte' | 'nordeste' | 'sudeste' | 'sul' | 'centro-oeste';
  lat: number;
  lon: number;
  species?: string[];
  description?: string;
  /** slug de um Port existente em lib/ports.ts, se houver, pra linkar a tábua de maré do local */
  nearestPortSlug?: string;
}

export const FISHING_SPOTS: FishingSpot[] = [
  {
    id: 'fs-1',
    name: 'Molhes da Barra',
    slug: 'molhes-da-barra-rio-grande',
    type: 'molhe',
    state: 'RS',
    region: 'sul',
    lat: -32.161085,
    lon: -52.0977989,
    species: ['corvina', 'pescada', 'linguado'],
    description: 'Um dos pontos de pesca de arremesso mais tradicionais do Sul, na barra do Rio Grande.',
    // ✅ coordenada verificada no Google Maps em 27/07/2026
  },
  {
    id: 'fs-2',
    name: 'Praia do Cassino',
    slug: 'praia-do-cassino',
    type: 'praia',
    state: 'RS',
    region: 'sul',
    lat: -32.2112752,
    lon: -52.18194,
    species: ['corvina', 'bagre', 'tainha'],
    description: 'Praia extensa, clássica para pesca de arremesso na areia.',
    // ✅ coordenada verificada no Google Maps em 27/07/2026
  },
  {
    id: 'fs-3',
    name: 'Barra de Tramandaí',
    slug: 'barra-de-tramandai',
    type: 'molhe',
    state: 'RS',
    region: 'sul',
    lat: -29.9806907,
    lon: -50.1266687,
    species: ['corvina', 'anchova', 'pescada'],
    // ✅ coordenada verificada no Google Maps em 27/07/2026
  },
  {
    id: 'fs-4',
    name: 'Molhe da Avenida Paraná (Caiobá)',
    slug: 'molhe-avenida-parana-caioba-guaratuba',
    type: 'molhe',
    state: 'PR',
    region: 'sul',
    lat: -25.8328088,
    lon: -48.5358458,
    species: ['robalo', 'corvina'],
    description: 'Molhe na região de Caiobá/Guaratuba, litoral do Paraná.',
    // ✅ nome e coordenada exata verificados no Google Maps em 27/07/2026
    // (nome oficial é "Molhe da Avenida Paraná em Caiobá")
  },
  {
    id: 'fs-5',
    name: 'Deck do Pescador (Ponta da Praia)',
    slug: 'deck-do-pescador-ponta-da-praia-santos',
    type: 'píer',
    state: 'SP',
    region: 'sudeste',
    lat: -23.9904376,
    lon: -46.3068957,
    species: ['corvina', 'bagre', 'robalo'],
    description: 'Ponto de pesca na Ponta da Praia, próximo ao Canal 6. Também vale conferir o "Pier do Rei", bem ao lado.',
    // ✅ coordenada exata verificada no Google Maps em 27/07/2026
  },
  {
    id: 'fs-6',
    name: 'Canal de Bertioga',
    slug: 'canal-de-bertioga',
    type: 'rio',
    state: 'SP',
    region: 'sudeste',
    lat: -23.8539,
    lon: -46.1392,
    species: ['robalo', 'tainha'],
    // ✅ confirmado visualmente no Google Maps em 27/07/2026 (mesma área)
  },
  {
    id: 'fs-7',
    name: 'Praia Grande (SP)',
    slug: 'praia-grande-sp',
    type: 'praia',
    state: 'SP',
    region: 'sudeste',
    lat: -24.0084,
    lon: -46.4121,
    species: ['corvina', 'bagre'],
    nearestPortSlug: 'praia-grande',
    // ✅ confirmado visualmente no Google Maps em 27/07/2026 (mesma área)
  },
  {
    id: 'fs-8',
    name: 'Praia de Copacabana (Posto 6)',
    slug: 'copacabana-posto-6',
    type: 'praia',
    state: 'RJ',
    region: 'sudeste',
    lat: -22.9868,
    lon: -43.1897,
    species: ['corvina', 'xerelete'],
    // ✅ confirmado visualmente no Google Maps em 27/07/2026 (mesma área)
  },
  {
    id: 'fs-9',
    name: 'Barra da Tijuca',
    slug: 'barra-da-tijuca',
    type: 'praia',
    state: 'RJ',
    region: 'sudeste',
    lat: -23.0069,
    lon: -43.3654,
    species: ['corvina', 'robalo'],
    // ✅ confirmado visualmente no Google Maps em 27/07/2026 (mesma área)
  },
  {
    id: 'fs-10',
    name: 'Praia do Forte',
    slug: 'praia-do-forte-cabo-frio',
    type: 'praia',
    state: 'RJ',
    region: 'sudeste',
    lat: -22.8894,
    lon: -42.0186,
    species: ['garoupa', 'sargo'],
    // ✅ confirmado visualmente no Google Maps em 27/07/2026 (mesma área)
  },
  {
    id: 'fs-11',
    name: 'Praia do Farol da Barra',
    slug: 'farol-da-barra-salvador',
    type: 'costão',
    state: 'BA',
    region: 'nordeste',
    lat: -13.0100,
    lon: -38.5325,
    species: ['garoupa', 'sargo', 'xareu'],
    description: 'Costão rochoso famoso em Salvador, bom para pesca com molinete.',
    // ✅ nome ajustado em 27/07/2026 — no Maps o local se chama "Praia do Farol da Barra"
  },
  {
    id: 'fs-12',
    name: 'Praia do Futuro',
    slug: 'praia-do-futuro-fortaleza',
    type: 'praia',
    state: 'CE',
    region: 'nordeste',
    lat: -3.7492,
    lon: -38.4472,
    species: ['carapeba', 'robalo'],
    nearestPortSlug: 'praia-do-futuro',
    // ✅ confirmado visualmente no Google Maps em 27/07/2026 (mesma área)
  },
];

export function getFishingSpotBySlug(slug: string): FishingSpot | undefined {
  return FISHING_SPOTS.find((s) => s.slug === slug);
}

const REGION_ORDER: FishingSpot['region'][] = ['norte', 'nordeste', 'centro-oeste', 'sudeste', 'sul'];

export function groupFishingSpotsByRegion(): { region: FishingSpot['region']; spots: FishingSpot[] }[] {
  return REGION_ORDER.map((region) => ({
    region,
    spots: FISHING_SPOTS.filter((s) => s.region === region),
  })).filter((g) => g.spots.length > 0);
}

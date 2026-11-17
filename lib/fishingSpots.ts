/**
 * MaréAgora — Lugares de Pesca
 * Base de pontos de pesca (píers, molhes, praias, costões) para o mapa
 * de "Lugares de Pesca".
 *
 * Status da verificação (27/07/2026): ✅ 12 pontos conferidos no Google Maps; 13/09/2026: +3 (fs-13 a fs-15).
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
    name: 'Canal de Bertioga (lado de Bertioga)',
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
    name: 'Praia do Forte (Cabo Frio)',
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
  {
    id: 'fs-13',
    name: 'Costão do Mar Casado',
    slug: 'costao-do-mar-casado-guaruja',
    type: 'costão',
    state: 'SP',
    region: 'sudeste',
    lat: -23.9717044,
    lon: -46.1864624,
    species: ['corvina', 'garoupa', 'badejo', 'sargo'],
    description: 'Costão rochoso na Praia do Pernambuco (Guarujá), procurado para pesca de arremesso.',
    nearestPortSlug: 'guaruja',
    // ✅ coordenada verificada no Google Maps em 13/09/2026 (Praia do Mar Casado)
  },
  {
    id: 'fs-14',
    name: 'Costão das Tartarugas',
    slug: 'costao-das-tartarugas-guaruja',
    type: 'costão',
    state: 'SP',
    region: 'sudeste',
    lat: -23.9942151,
    lon: -46.1998453,
    species: ['corvina', 'garoupa', 'badejo', 'sargo'],
    description: 'Costão rochoso na Praia da Enseada (Guarujá), um dos pontos mais tradicionais para pesca de terra na cidade.',
    nearestPortSlug: 'guaruja',
    // ✅ área geral confirmada visualmente no Google Maps em 13/09/2026
  },
  {
    id: 'fs-15',
    name: 'Canal de Bertioga (Praia da Enseada)',
    slug: 'canal-de-bertioga-enseada-guaruja',
    type: 'rio',
    state: 'SP',
    region: 'sudeste',
    lat: -23.9832,
    lon: -46.1706,
    species: ['robalo-flecha', 'robalo-peva'],
    description: 'Trecho do Canal de Bertioga junto à Praia da Enseada, o ponto mais tradicional de Guarujá para pesca de robalo, especialmente na virada da maré.',
    nearestPortSlug: 'guaruja',
    // ⚠️ coordenada aproximada — ajustar após conferência exata no Google Maps
  },
  {
    id: 'fs-16',
    name: 'Espigão Costeiro',
    slug: 'espigao-costeiro-sao-luis',
    type: 'molhe',
    state: 'MA',
    region: 'nordeste',
    lat: -2.501186,
    lon: -44.3217298,
    description: 'Espigão costeiro de São Luís, mapeado como pesqueiro pela comunidade do OpenStreetMap.',
    nearestPortSlug: 'sao-luis',
    // ⚠️ coordenada do OpenStreetMap (nó 2959807624, nome "PESQUEIRO ESPIGÃO COSTEIRO", 17/11/2026) — conferir no Google Maps; espécies a preencher
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

/**
 * Píeres e cais públicos do Nordeste mapeados no OpenStreetMap (export de 17/11/2026,
 * © colaboradores do OpenStreetMap, ODbL). NÃO são pontos de pesca verificados: o OSM não diz
 * se a pesca é permitida ou produtiva ali. Aparecem em seção separada, com aviso, e não
 * no mapa. Terminais industriais, pesque-pagues e locais privados ficaram de fora.
 */
export interface OsmPier {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export const OSM_PIERS: OsmPier[] = [
  { name: 'Marco dos Corais', state: 'AL', lat: -9.6655493, lon: -35.6962822 },
  { name: 'Píer do Marco Zero', state: 'PE', lat: -8.0631591, lon: -34.8708287 },
  { name: 'Píer Aurora', state: 'PE', lat: -8.0548064, lon: -34.8761426 },
  { name: 'Píer Apipucos', state: 'PE', lat: -8.0209305, lon: -34.9338188 },
  { name: 'Píer Mariassú', state: 'PE', lat: -8.6843259, lon: -35.1026548 },
  { name: 'Cais de São José de Ribamar', state: 'MA', lat: -2.5651983, lon: -44.0565268 },
  { name: 'Cais de Alcântara', state: 'MA', lat: -2.4059752, lon: -44.4241806 },
  { name: 'Cais Pesqueiro', state: 'MA', lat: -2.5066305, lon: -43.443657 },
  { name: 'Píer do Mailame', state: 'BA', lat: -15.682776, lon: -38.9430532 },
  { name: 'Píer de Cachoeira', state: 'BA', lat: -12.6058562, lon: -38.963686 },
  { name: 'Píer do Pontal', state: 'BA', lat: -14.806868, lon: -39.0410123 },
  { name: 'Atracadouro de Campinho', state: 'BA', lat: -13.9126, lon: -38.9887864 },
  { name: 'Cais de Cairu', state: 'BA', lat: -13.4835047, lon: -39.0449569 },
  { name: 'Píer de Mutá', state: 'BA', lat: -12.9915501, lon: -38.7767262 },
  { name: 'Ponte do Lôrete', state: 'BA', lat: -12.9204686, lon: -38.5030285 },
  { name: 'Praia dos Pescadores', state: 'BA', lat: -12.9271345, lon: -38.619031 },
];

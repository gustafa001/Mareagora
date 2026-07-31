import { PORTS, type Port } from './ports';

/**
 * Câmeras ao vivo que JÁ RODAM nas páginas de maré (/mare/[estado]/[slug]),
 * lidas direto de PORTS.cameras — não duplica dado, então nunca desincroniza
 * com o que está tocando lá. Adiciona só o que é específico da vitrine
 * /cameras: descrição da praia e agrupamento visual por região.
 */

export interface LiveCamera {
  id: string;
  title: string;
  cityName: string;
  state: string;
  groupLabel: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  videoId?: string;
  channelId?: string;
  portSlug: string;
}

// Descrição curta por vídeo — mantida separada de ports.ts pra não poluir
// aquele arquivo com texto editorial.
const DESCRIPTIONS: Record<string, string> = {
  qM5J5aPdmMY:
    'Vista da praia de São Conrado, na Zona Sul do Rio, point tradicional de voo livre com a Pedra da Gávea ao fundo.',
  'gmc9ryoJ-vs':
    'Vista da Praia do Gonzaga, um dos trechos mais movimentados da orla de Santos.',
  '5BxqzvR6TgM':
    'Vista da entrada do canal do Porto de Santos, o maior porto da América Latina, com a movimentação de navios em tempo real.',
  CkHrJQGVukI:
    'Vista do Canal 1 de Santos, um dos canais que cortam a cidade e conectam a orla à parte continental.',
  'yPSJYJk-Szc':
    'Uma das praias mais procuradas de Ubatuba, no trecho conhecido como Baguari.',
  pJvaJY7pKvk:
    'Praia central do Guarujá, ao lado do calçadão, uma das mais movimentadas da cidade.',
  WJ6LLt6xxkY:
    'Vista da orla de Praia Grande, no litoral sul de São Paulo.',
  ukoSyGLdoTQ:
    'Vista do Morro do Itararé, em São Vicente, mirante natural com vista panorâmica da Baía de Santos.',
  yf7EqBAnFek:
    'Vista da Praia dos Milionários, em São Vicente, um dos trechos mais nobres da orla da cidade.',
  OlEJOalq4oQ:
    'Vista da Praia dos Sonhos, em Itanhaém, no litoral sul de São Paulo.',
};

// Agrupamento visual por região turística (mais legível que o campo
// genérico "sudeste" de PORTS.region).
const GROUP_LABELS: Record<string, string> = {
  'porto-de-santos': 'Baixada Santista',
  guaruja: 'Baixada Santista',
  'praia-grande': 'Baixada Santista',
  'sao-vicente': 'Baixada Santista',
  itanhaem: 'Baixada Santista',
  ubatuba: 'Litoral Norte SP',
  'rio-de-janeiro-fiscal': 'Rio de Janeiro',
  'cabo-frio': 'Região dos Lagos',
};

const GROUP_ORDER = ['Baixada Santista', 'Litoral Norte SP', 'Rio de Janeiro', 'Região dos Lagos'];

function toLiveCameras(port: Port): LiveCamera[] {
  if (!port.cameras || port.cameras.length === 0) return [];
  return port.cameras
    .filter((cam) => Boolean(cam.videoId) || Boolean(cam.channelId))
    .map((cam) => ({
      id: `${port.slug}-${cam.videoId ?? cam.channelId}`,
      title: cam.title,
      cityName: port.cityName,
      state: port.state,
      groupLabel: GROUP_LABELS[port.slug] ?? port.cityName,
      description: (cam.videoId && DESCRIPTIONS[cam.videoId]) ?? '',
      sourceName: cam.sourceName,
      sourceUrl: cam.sourceUrl,
      videoId: cam.videoId,
      channelId: cam.channelId,
      portSlug: port.slug,
    }));
}

export function getLiveCameras(): LiveCamera[] {
  return PORTS.flatMap(toLiveCameras);
}

export function getLiveCameraGroups(): { label: string; cameras: LiveCamera[] }[] {
  const cameras = getLiveCameras();

  const known = GROUP_ORDER.map((label) => ({
    label,
    cameras: cameras.filter((c) => c.groupLabel === label),
  })).filter((g) => g.cameras.length > 0);

  // qualquer região nova que apareça no futuro (fora da lista fixa acima)
  // ainda assim é exibida, só entra no final.
  const knownSet = new Set(GROUP_ORDER);
  const extraLabels = Array.from(
    new Set(cameras.filter((c) => !knownSet.has(c.groupLabel)).map((c) => c.groupLabel))
  );
  const extra = extraLabels.map((label) => ({
    label,
    cameras: cameras.filter((c) => c.groupLabel === label),
  }));

  return [...known, ...extra];
}

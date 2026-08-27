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
  videoId: string;
  portSlug: string;
}

// Descrição curta por vídeo — mantida separada de ports.ts pra não poluir
// aquele arquivo com texto editorial.
const DESCRIPTIONS: Record<string, string> = {
  qM5J5aPdmMY:
    'Vista da praia de São Conrado, na Zona Sul do Rio, point tradicional de voo livre com a Pedra da Gávea ao fundo.',
  '5BxqzvR6TgM':
    'Vista da entrada do canal do Porto de Santos, o maior porto da América Latina, com a movimentação de navios em tempo real.',
  CkHrJQGVukI:
    'Vista do Canal 1 de Santos, um dos canais que cortam a cidade e conectam a orla à parte continental.',
  'q5jrRV0Tc-Y':
    'Praia central do Guarujá, ao lado do calçadão, uma das mais movimentadas da cidade.',
  zd6V3jeNSOk:
    'Praia central do Guarujá, ao lado do calçadão, uma das mais movimentadas da cidade.',
  ukoSyGLdoTQ:
    'Vista do Morro do Itararé, em São Vicente, mirante natural com vista panorâmica da Baía de Santos.',
  'qqcsE-v9Cac':
    'Vista da Praia do Itararé, em São Vicente.',
  'DvjGg1E-BZ8':
    'Vista da Praia dos Sonhos, em Itanhaém, no litoral sul de São Paulo.',
  OlEJOalq4oQ:
    'Vista da Praia dos Sonhos, em Itanhaém, no litoral sul de São Paulo.',
  jrleSsjuNqw:
    'Transmissão 24h da Praia do Forte, em Cabo Frio.',
};

// Agrupamento visual por região turística (mais legível que o campo
// genérico "sudeste" de PORTS.region).
const GROUP_LABELS: Record<string, string> = {
  'porto-de-santos': 'Baixada Santista',
  guaruja: 'Baixada Santista',
  'sao-vicente': 'Baixada Santista',
  itanhaem: 'Baixada Santista',
  ubatuba: 'Litoral Norte SP',
  'rio-de-janeiro-fiscal': 'Rio de Janeiro',
  'cabo-frio': 'Região dos Lagos',
};

const GROUP_ORDER = ['Baixada Santista', 'Litoral Norte SP', 'Rio de Janeiro'];

function toLiveCameras(port: Port): LiveCamera[] {
  if (!port.cameras || port.cameras.length === 0) return [];
  return port.cameras
    .filter((cam) => cam.active !== false && Boolean(cam.videoId))
    .map((cam) => ({
      id: `${port.slug}-${cam.videoId}`,
      title: cam.title,
      cityName: port.cityName,
      state: port.state,
      groupLabel: GROUP_LABELS[port.slug] ?? port.cityName,
      description: DESCRIPTIONS[cam.videoId as string] ?? '',
      sourceName: cam.sourceName,
      sourceUrl: cam.sourceUrl,
      videoId: cam.videoId as string,
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

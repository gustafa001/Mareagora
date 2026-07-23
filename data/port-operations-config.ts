/**
 * MaréAgora — Operações Portuárias
 * ---------------------------------------------------------------------------
 * Configuração operacional por porto. Valores de calado/canal/berços
 * atualizados com dados oficiais publicados por Autoridades Portuárias,
 * Capitanias dos Portos e Ministério de Portos e Aeroportos (ver `sourceUrl`
 * e `lastVerified` de cada porto). Calado é uma medida que muda com
 * dragagem/assoreamento — reconfira periodicamente na fonte oficial antes
 * de usar para decisões operacionais reais.
 *
 * Este arquivo é aditivo: não é lido por nenhuma outra parte do sistema.
 */

export interface PortOperationsConfig {
  /** calado máximo autorizado no canal de acesso, em metros */
  maxDraftM: number;
  /** maré mínima (m) para operação segura considerando o calado do canal */
  minTideM: number;
  /** maré (m) considerada ideal/confortável */
  idealTideM: number;
  /** vento (km/h) considerado ideal */
  windIdealKmh: number;
  /** vento (km/h) limite para operação de atracação/desatracação */
  windLimitKmh: number;
  /** altura de onda (m) considerada ideal */
  waveIdealM: number;
  /** altura de onda (m) limite operacional */
  waveLimitM: number;
  channel: string;
  berths: string;
  pilotage: string;
  tugboats: string;
  /** URL da fonte oficial usada para verificar calado/canal/berços */
  sourceUrl?: string;
  /** Data (YYYY-MM-DD) em que os dados acima foram checados na fonte oficial */
  lastVerified?: string;
  /** false = ainda não foi possível confirmar um valor oficial específico; mantém estimativa anterior */
  verified?: boolean;
}

const DEFAULT_CONFIG: PortOperationsConfig = {
  maxDraftM: 12.5,
  minTideM: 0.6,
  idealTideM: 1.6,
  windIdealKmh: 20,
  windLimitKmh: 45,
  waveIdealM: 1.0,
  waveLimitM: 2.5,
  channel: 'Canal de acesso único, mão dupla sinalizada',
  berths: 'Consulte disponibilidade com a Autoridade Portuária',
  pilotage: 'Praticagem obrigatória — solicitar com 24h de antecedência',
  tugboats: '2 rebocadores disponíveis mediante escala',
  verified: false,
};

/** Overrides por slug de porto (baseado em `lib/ports.ts`). */
const OVERRIDES: Record<string, Partial<PortOperationsConfig>> = {
  'porto-de-santos': {
    maxDraftM: 15.0, minTideM: 0.8, idealTideM: 1.8,
    channel: 'Canal principal com calado operacional de 15m (dragagem em andamento para 16m em 2026)',
    berths: '90+ berços distribuídos em 8 terminais',
    pilotage: 'Praticagem obrigatória — Zona 14',
    tugboats: 'Frota de rebocadores disponível 24h',
    sourceUrl: 'https://www.portodesantos.com.br/informacoes-operacionais/operacoes-portuarias/calados-operacionais-dos-bercos-de-atracacao/',
    lastVerified: '2026-07-22',
    verified: true,
  },
  'porto-de-suape': {
    maxDraftM: 16.2, minTideM: 0.7, idealTideM: 1.7,
    channel: 'Canal externo dragado a 20m; canal interno ampliado para 16,2m (concluído em jan/2026)',
    berths: '5 berços públicos ativos (15,5m) + terminais arrendados (Tecon Suape, APM Terminals)',
    sourceUrl: 'https://www.suape.pe.gov.br/pt/73-porto/infraestutura-portuaria/guia-portuario',
    lastVerified: '2026-07-22',
    verified: true,
  },
  'porto-de-vitoria': {
    maxDraftM: 14.0, minTideM: 0.6, idealTideM: 1.6,
    channel: 'Canal interno e externo com 14m de profundidade (Normap 84/2018)',
    berths: 'Cais Comercial, Capuaba e Paul, calados de 9m a 12,5m por berço',
    sourceUrl: 'https://vports.com.br/',
    lastVerified: '2026-07-22',
    verified: true,
  },
  'porto-de-itaqui': {
    maxDraftM: 19.0, minTideM: 1.0, idealTideM: 2.2,
    channel: 'Canal natural profundo (baía de São Marcos); berços de 12m a 19,8m conforme terminal',
    berths: '9 berços operacionais com profundidades de 12m a 19m',
    sourceUrl: 'https://www.portodoitaqui.com/porto-do-itaqui/infraestrutura',
    lastVerified: '2026-07-22',
    verified: true,
  },
  'porto-do-recife': {
    maxDraftM: 11.0, minTideM: 0.6, idealTideM: 1.5,
    channel: 'Berços com profundidades entre 8m e 11m conforme trecho, após dragagem de manutenção',
    sourceUrl: 'https://www.portodorecife.pe.gov.br/noticia-int.php?id=1624364720',
    lastVerified: '2026-07-22',
    verified: true,
  },
  'porto-de-salvador': {
    maxDraftM: 15.0, minTideM: 0.6, idealTideM: 1.6,
    channel: 'Baía de Todos os Santos — canal principal dragado para 15m; sistema de calado dinâmico ReDRAFT para navios classe 366m',
    berths: '~10 berços operacionais (cais comercial + Tecon Salvador)',
    sourceUrl: 'https://www.codeba.gov.br/eficiente/sites/portalcodeba/pt-br/porto_salvador.php',
    lastVerified: '2026-07-22',
    verified: true,
  },
  'porto-de-itaguai': {
    maxDraftM: 18.3, minTideM: 0.8, idealTideM: 2.0,
    channel: 'Canal Principal e Canal da Ilha das Cabras — calado operacional de 18,3m (profundidade máxima do canal: 20m)',
    sourceUrl: 'https://www.portosrio.gov.br/pt-br/node/2820',
    lastVerified: '2026-07-22',
    verified: true,
  },
  'rio-de-janeiro-fiscal': {
    maxDraftM: 15.3, minTideM: 0.7, idealTideM: 1.7,
    channel: 'Canal de acesso ampliado para 16,2m de profundidade mínima',
    berths: 'Berços operacionais com calado de até 15,3m para navios New Panamax',
    sourceUrl: 'https://www.portosrio.gov.br/',
    lastVerified: '2025-04-07',
    verified: true,
  },
  'porto-de-itajai': {
    maxDraftM: 13.8, minTideM: 0.6, idealTideM: 1.6,
    channel: 'Canal externo 14,0m; interno 13,6m; bacias de evolução 13,5m-13,6m',
    berths: 'Berços 1, 2 e 4 (13,8m), Berço 3 (13,7m), Portonave (13,5m)',
    sourceUrl: 'https://www.portoitajai.com.br/Menor-profundidade-observada-(MPO)',
    lastVerified: '2026-07-08',
    verified: true,
  },
  'porto-de-rio-grande': {
    maxDraftM: 12.2, minTideM: 0.7, idealTideM: 1.8,
    channel: 'Canal de acesso com 16,5m (homologado), mas com calado restrito a 12,2m (provisório 2026)',
    berths: 'Terminais de Contêineres (12,2m) e Graneleiros conforme batimetria recente',
    sourceUrl: 'https://www.portosrs.com.br/',
    lastVerified: '2024-06-24',
    verified: true,
  },
  'porto-de-paranagua': {
    maxDraftM: 13.3, minTideM: 0.6, idealTideM: 1.6,
    channel: 'Canais Sueste e Galheta com calado operacional de 13,3m',
    berths: 'TCP e berços públicos operando com calado máximo de 13,3m',
    sourceUrl: 'https://www.tcp.com.br/',
    lastVerified: '2026-02-25',
    verified: true,
  },
  'porto-de-sao-sebastiao': {
    maxDraftM: 9.4, minTideM: 0.6, idealTideM: 1.5,
    channel: 'Canal de acesso com até 25m de profundidade (um dos maiores do Brasil); calado operacional do berço público principal: 9,4m',
    berths: '1 berço principal (150m) + 2 berços internos; TEBAR/Petrobras com profundidade de 14m a 26m',
    sourceUrl: 'https://www.portoss.sp.gov.br/cdss/infra_portu%C3%A1ria/o_porto',
    lastVerified: '2026-07-22',
    verified: true,
  },
};

export function getPortOperationsConfig(slug: string): PortOperationsConfig {
  const override = OVERRIDES[slug];
  return override ? { ...DEFAULT_CONFIG, ...override } : DEFAULT_CONFIG;
}

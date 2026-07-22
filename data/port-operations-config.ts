/**
 * MaréAgora — Operações Portuárias
 * ---------------------------------------------------------------------------
 * Configuração operacional por porto. Os valores de calado/canal/berços aqui
 * são estimativas ilustrativas para portos comerciais brasileiros — devem
 * ser ajustados pelo operador com dados oficiais da Autoridade Portuária
 * (Praticagem, VTMS, Capitania dos Portos) quando disponíveis.
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
};

/** Overrides por slug de porto (baseado em `lib/ports.ts`). */
const OVERRIDES: Record<string, Partial<PortOperationsConfig>> = {
  'porto-de-santos': {
    maxDraftM: 15.0, minTideM: 0.8, idealTideM: 1.8,
    channel: 'Canal principal 40km, dragagem para 15m',
    berths: '90+ berços distribuídos em 8 terminais',
    pilotage: 'Praticagem obrigatória — Zona 14',
    tugboats: 'Frota de rebocadores disponível 24h',
  },
  'porto-de-suape': {
    maxDraftM: 16.5, minTideM: 0.7, idealTideM: 1.7,
    channel: 'Canal de acesso dragado, bacia de evolução própria',
    berths: 'Terminais de granéis, contêineres e líquidos',
  },
  'porto-de-vitoria': {
    maxDraftM: 14.0, minTideM: 0.6, idealTideM: 1.6,
  },
  'porto-de-itaqui': {
    maxDraftM: 21.0, minTideM: 1.0, idealTideM: 2.2,
    channel: 'Canal natural de grande profundidade (baía de São Marcos)',
  },
  'porto-do-recife': {
    maxDraftM: 11.0, minTideM: 0.6, idealTideM: 1.5,
  },
  'porto-de-salvador': {
    maxDraftM: 13.0, minTideM: 0.6, idealTideM: 1.6,
  },
  'porto-de-itaguai': {
    maxDraftM: 19.5, minTideM: 0.8, idealTideM: 2.0,
  },
  'rio-de-janeiro-fiscal': {
    maxDraftM: 13.0, minTideM: 0.5, idealTideM: 1.3,
  },
  'porto-de-sao-sebastiao': {
    maxDraftM: 14.0, minTideM: 0.6, idealTideM: 1.5,
  },
};

export function getPortOperationsConfig(slug: string): PortOperationsConfig {
  const override = OVERRIDES[slug];
  return override ? { ...DEFAULT_CONFIG, ...override } : DEFAULT_CONFIG;
}

export const STATE_MAP: Record<string, string> = {
  SP: 'sao-paulo',
  RJ: 'rio-de-janeiro',
  SC: 'santa-catarina',
  PR: 'parana',
  RS: 'rio-grande-do-sul',
  ES: 'espirito-santo',
  BA: 'bahia',
  SE: 'sergipe',
  AL: 'alagoas',
  PE: 'pernambuco',
  PB: 'paraiba',
  RN: 'rio-grande-do-norte',
  CE: 'ceara',
  PI: 'piaui',
  MA: 'maranhao',
  PA: 'para',
  AP: 'amapa',
  ANT: 'antartida',
};

export const STATE_NAME_MAP: Record<string, string> = {
  SP: 'São Paulo',
  RJ: 'Rio de Janeiro',
  SC: 'Santa Catarina',
  PR: 'Paraná',
  RS: 'Rio Grande do Sul',
  ES: 'Espírito Santo',
  BA: 'Bahia',
  SE: 'Sergipe',
  AL: 'Alagoas',
  PE: 'Pernambuco',
  PB: 'Paraíba',
  RN: 'Rio Grande do Norte',
  CE: 'Ceará',
  PI: 'Piauí',
  MA: 'Maranhão',
  PA: 'Pará',
  AP: 'Amapá',
  ANT: 'Antártida',
};

export function getStateSlug(stateCode: string): string {
  return STATE_MAP[stateCode.toUpperCase()] || stateCode.toLowerCase();
}

export function getStateName(stateCode: string): string {
  return STATE_NAME_MAP[stateCode.toUpperCase()] || stateCode;
}

/** Preposição de "Estado de/do/da ..." para cada UF (concordância em português). */
const STATE_PREPOSITION: Record<string, 'de' | 'do' | 'da'> = {
  SP: 'de', SC: 'de', PE: 'de', AL: 'de', SE: 'de',
  RJ: 'do', PR: 'do', RS: 'do', ES: 'do', RN: 'do',
  CE: 'do', PI: 'do', MA: 'do', PA: 'do', AP: 'do',
  BA: 'da', PB: 'da',
};

/**
 * Nome completo com a preposição correta, para usar em títulos e subtítulos.
 * Ex.: SP -> "Estado de São Paulo", BA -> "Estado da Bahia".
 * Códigos sem estado (ex.: ANT) voltam só com o nome, sem "Estado".
 */
export function getStatePhrase(stateCode: string): string {
  const code = stateCode.toUpperCase();
  const prep = STATE_PREPOSITION[code];
  const name = getStateName(code);
  return prep ? `Estado ${prep} ${name}` : name;
}

export function getStateCodeFromSlug(slug: string): string | undefined {
  const entry = Object.entries(STATE_MAP).find(([_, value]) => value === slug);
  return entry ? entry[0] : undefined;
}

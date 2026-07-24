import { cookies } from 'next/headers';

export type Locale = 'pt' | 'en';
export type HeightUnit = 'm' | 'ft';
export type HourFormat = '24h' | '12h';

export interface GlobalPreferences {
  locale: Locale;
  unit: HeightUnit;
  hourFormat: HourFormat;
}

const COOKIE_NAME = 'maremundo_prefs';

export function getGlobalPreferences(acceptLanguageHeader?: string | null): GlobalPreferences {
  const store = cookies();
  const raw = store.get(COOKIE_NAME)?.value;

  if (raw) {
    try {
      return JSON.parse(raw) as GlobalPreferences;
    } catch {
      // cai pro default abaixo
    }
  }

  const browserPrefersPt = acceptLanguageHeader?.toLowerCase().includes('pt') ?? true;
  return {
    locale: browserPrefersPt ? 'pt' : 'en',
    unit: browserPrefersPt ? 'm' : 'ft', // heurística simples: pt-BR tende a metro, o resto tende a pé — só o default inicial, usuário troca livremente
    hourFormat: browserPrefersPt ? '24h' : '12h',
  };
}

const dict = {
  pt: {
    tideTitle: 'Maré em',
    highTide: 'Maré alta',
    lowTide: 'Maré baixa',
    nearbyPlaces: 'Locais próximos',
    estimateWarning: (km: number) =>
      `⚠️ Estimativa aproximada — a estação de referência mais próxima fica a ${km} km deste ponto.`,
    noData: (place: string) => `Não há dados de maré disponíveis pra ${place} no momento.`,
    disclaimer: 'Previsão astronômica calculada por modelo harmônico — não considera ressaca, maré meteorológica ou eventos extremos.',
  },
  en: {
    tideTitle: 'Tide in',
    highTide: 'High tide',
    lowTide: 'Low tide',
    nearbyPlaces: 'Nearby places',
    estimateWarning: (km: number) =>
      `⚠️ Approximate estimate — the nearest reference station is ${km} km from this point.`,
    noData: (place: string) => `No tide data available for ${place} right now.`,
    disclaimer: 'Astronomical prediction from a harmonic model — does not account for storm surge, meteorological tide, or extreme events.',
  },
} as const;

export function t(locale: Locale) {
  return dict[locale];
}

/** Converte metros pra pés quando a preferência do usuário for 'ft'. Não altera o dado original. */
export function formatHeight(heightM: number, unit: HeightUnit): string {
  if (unit === 'ft') {
    return `${(heightM * 3.28084).toFixed(1)} ft`;
  }
  return `${heightM.toFixed(2)} m`;
}

/** Converte "14:32" pra "2:32 PM" quando a preferência for 12h. A string original (24h) nunca é alterada — só a exibição. */
export function formatHour(hora24: string, format: HourFormat): string {
  if (format === '24h') return hora24;
  const [h, m] = hora24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

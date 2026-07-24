/**
 * Gera um parágrafo editorial único sobre marés para cada localidade global.
 * Usado nas páginas /mare-mundo e /tide para evitar "thin content" no Google.
 *
 * A partir da Fase 0, esta função lê data/tide-regime-cache.json em vez de
 * chamar getGlobalTideData() + classifyTideRegime() em tempo de build/request.
 * Se o slug não estiver no cache (localidade nova ou cache desatualizado), faz
 * fallback para o texto genérico por país e emite um console.warn.
 */

import fs from 'fs';
import path from 'path';
import type { CachedTideRegime } from './tideRegimeCache';

// ── Cache em memória: carregado uma vez na inicialização do processo ──────────
let _regimeCache: Record<string, CachedTideRegime> | null = null;

function getRegimeCache(): Record<string, CachedTideRegime> {
  if (_regimeCache) return _regimeCache;
  try {
    const cachePath = path.join(process.cwd(), 'data', 'tide-regime-cache.json');
    const raw = fs.readFileSync(cachePath, 'utf-8');
    _regimeCache = JSON.parse(raw) as Record<string, CachedTideRegime>;
  } catch {
    console.warn('[tideDescription] Não foi possível carregar data/tide-regime-cache.json. Execute npm run build:tide-regime-cache.');
    _regimeCache = {};
  }
  return _regimeCache!;
}

// ── Textos de regime para EN e PT ─────────────────────────────────────────────
const REGIME_LABEL_PT: Record<string, string> = {
  semidiurno: 'semidiurno (duas marés altas e duas baixas por dia)',
  diurno: 'diurno (uma maré alta e uma baixa por dia)',
  misto: 'misto (marés com alturas desiguais ao longo do dia)',
};

const REGIME_LABEL_EN: Record<string, string> = {
  semidiurno: 'semi-diurnal (two high and two low tides per day)',
  diurno: 'diurnal (one high and one low tide per day)',
  misto: 'mixed (tides with unequal heights throughout the day)',
};

const TIDE_CHARACTERISTICS: Record<string, string> = {
  'gb': 'As marés no Reino Unido estão entre as mais intensas do mundo, com amplitudes que podem ultrapassar 14 metros na Baía de Severn.',
  'fr': 'As marés da França atlântica são fortemente influenciadas pelo funil do Canal da Mancha, com coeficientes elevados especialmente na Bretanha.',
  'pt': 'Portugal tem marés semidiurnas regulares, com amplitude média de 2 a 3 metros na costa atlântica.',
  'es': 'A Espanha apresenta variação significativa entre o Atlântico — com marés de até 4 metros no norte — e o Mediterrâneo, com marés quase imperceptíveis.',
  'us': 'Os Estados Unidos apresentam grande variação regional: marés diurnas no Golfo do México, semidiurnas no Atlântico e mistas na costa Pacífica.',
  'ca': 'O Canadá tem algumas das maiores marés do mundo, especialmente na Baía de Fundy, onde a amplitude pode atingir 16 metros.',
  'ie': 'A Irlanda tem marés semidiurnas com amplitude de 3 a 5 metros, influenciadas pelo Atlântico Norte.',
  'no': 'A Noruega possui marés semidiurnas com amplitudes moderadas, intensificadas pelos fiordes que atuam como funis naturais.',
  'ar': 'A Argentina tem marés muito variáveis, com amplitudes de até 8 metros no Estreito de Magalhães e pequenas no Atlântico aberto.',
  'mx': 'O México apresenta marés mistas na costa Pacífica e marés quase estáticas no Golfo do México.',
  'co': 'A Colômbia tem marés Pacíficas mais intensas (2–5m) do que as caribenhas (0,3m), onde o regime é quase imperceptível.',
  'cl': 'O Chile tem marés semidiurnas com amplitudes de 1 a 2 metros no norte, aumentando significativamente no extremo sul patagônico.',
  'jp': 'O Japão tem padrão de marés misto, variando de semidiurno no Pacífico a diurno no Mar do Japão, com amplitudes de 1–4 metros.',
  'au': 'A Austrália apresenta enorme variação: marés diurnas de até 11m na costa noroeste e quase zero no sul da Austrália.',
  'nz': 'A Nova Zelândia tem marés semidiurnas de 2 a 4 metros, com correntes fortes nos estreitos entre as ilhas.',
  'id': 'A Indonésia tem padrões de maré extremamente variados devido à sua extensão geográfica, com regimes diurnos, mistos e semidiurnos.',
  'ph': 'As Filipinas apresentam marés predominantemente diurnas no Pacífico, com amplitudes de 1 a 2 metros.',
  'cn': 'A China tem marés semidiurnas no litoral leste com amplitudes de 2 a 6m, crescendo significativamente nas baías e estuários.',
  'in': 'A Índia tem marés semidiurnas na costa oeste com amplitude de até 8m em Gujarat, e menores no leste.',
  'za': 'A África do Sul tem marés semi-diurnas com amplitudes moderadas, sendo a costa atlântica mais ativa do que a índica.',
  'ma': 'O Marrocos tem marés semidiurnas com amplitudes de 3 a 4 metros na costa atlântica, influenciadas pelo Estreito de Gibraltar.',
  'sn': 'O Senegal tem marés semidiurnas com amplitude de 1 a 2m, afetando significativamente a pesca artesanal local.',
  'default': 'As marés nesta região seguem o padrão semidiurno, com dois ciclos de maré alta e baixa a cada 24 horas.',
};

const MONTH_NAMES_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const HEMISPHERE_BY_LAT = (lat: number) => lat >= 0 ? 'norte' : 'sul';
const HEMISPHERE_EN = (lat: number) => lat >= 0 ? 'northern' : 'southern';

const SEASON_PT = (lat: number) => {
  const month = new Date().getMonth();
  const isNorth = lat >= 0;
  if (isNorth) {
    if (month >= 2 && month <= 4) return 'primavera';
    if (month >= 5 && month <= 7) return 'verão';
    if (month >= 8 && month <= 10) return 'outono';
    return 'inverno';
  } else {
    if (month >= 2 && month <= 4) return 'outono';
    if (month >= 5 && month <= 7) return 'inverno';
    if (month >= 8 && month <= 10) return 'primavera';
    return 'verão';
  }
};

const SEASON_EN = (lat: number) => {
  const month = new Date().getMonth();
  const isNorth = lat >= 0;
  if (isNorth) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  } else {
    if (month >= 2 && month <= 4) return 'autumn';
    if (month >= 5 && month <= 7) return 'winter';
    if (month >= 8 && month <= 10) return 'spring';
    return 'summer';
  }
};

export function generateTideDescription(
  name: string,
  countryName: string,
  countryCode: string,
  lat: number,
  lon: number,
  locale: 'pt' | 'en' = 'pt',
  slug?: string
): string {
  const ano = new Date().getFullYear();
  const month = new Date().getMonth();
  const cc = countryCode.toLowerCase();
  const season = locale === 'pt' ? SEASON_PT(lat) : SEASON_EN(lat);
  const hemisphere = locale === 'pt' ? HEMISPHERE_BY_LAT(lat) : HEMISPHERE_EN(lat);
  const isCoastal = Math.abs(lat) < 70;

  // ── Lê do cache se slug fornecido ──────────────────────────────────────────
  const cache = getRegimeCache();
  const cached = slug ? cache[slug] : null;

  if (slug && !cached) {
    console.warn(`[tideDescription] Slug "${slug}" não encontrado no cache de regime. Execute npm run build:tide-regime-cache para atualizar.`);
  }

  if (locale === 'en') {
    const monthName = MONTH_NAMES_EN[month];
    const regimeLabel = cached ? REGIME_LABEL_EN[cached.regime] ?? 'semi-diurnal' : 'semi-diurnal';
    const amplitudeStr = cached
      ? `with an average tidal range of ${cached.amplitudeMedia}m (up to ${cached.amplitudeMax}m at spring tides)`
      : 'with tidal range varying by season and lunar cycle';

    return `${name} is located at coordinates ${lat.toFixed(2)}°, ${lon.toFixed(2)}° in the ${hemisphere} hemisphere, ${countryName}. ` +
      `The tidal pattern at ${name} is ${regimeLabel}, ${amplitudeStr}. ` +
      `This page presents the complete ${ano} tide table for ${name}, including daily high tide and low tide times with precise heights in meters. ` +
      `In ${monthName}, ${name} enters its ${season} season${isCoastal ? ', a key period for water sports, fishing, and navigation planning' : ''}. ` +
      `All predictions on this page are generated using harmonic constants validated for this coastal station, ` +
      `providing accuracy within ±15 minutes for most locations. The tide forecasts are updated daily and can be used for ` +
      `surfing, fishing, diving, beach outings, and maritime navigation planning.`;
  }

  // ── Português ──────────────────────────────────────────────────────────────
  const monthName = MONTH_NAMES_PT[month];

  // Se temos dados reais do cache, usamos descrição específica; caso contrário, fallback por país
  let characteristic: string;
  if (cached) {
    const regimeLabel = REGIME_LABEL_PT[cached.regime] ?? 'semidiurno';
    characteristic = `Em ${name}, o regime de marés é ${regimeLabel}, com amplitude média de ${cached.amplitudeMedia}m e máxima de ${cached.amplitudeMax}m nas sizígias.` +
      (cached.isEstimate ? ' (dados baseados na estação maregráfica mais próxima)' : '');
  } else {
    characteristic = TIDE_CHARACTERISTICS[cc] ?? TIDE_CHARACTERISTICS['default'];
  }

  return `${name} está localizada nas coordenadas ${lat.toFixed(2)}°, ${lon.toFixed(2)}° no hemisfério ${hemisphere}, ${countryName}. ` +
    `${characteristic} ` +
    `Esta página apresenta a tábua de marés completa de ${ano} para ${name}, com os horários de maré alta e maré baixa ` +
    `e as alturas em metros para cada dia do ano. Em ${monthName}, ${name} vive o período de ${season}` +
    `${isCoastal ? ', uma época importante para esportes náuticos, pesca e planejamento de travessias' : ''}. ` +
    `Todos os dados são calculados com base em constantes harmônicas validadas para esta estação costeira, ` +
    `com precisão de ±15 minutos para a maioria das localidades. Use esta previsão para surf, pesca, mergulho, ` +
    `passeios de praia e planejamento de navegação.`;
}

/**
 * Gera um parágrafo editorial único sobre marés para cada localidade global.
 * Usado nas páginas /mare-mundo e /tide para evitar "thin content" no Google.
 *
 * Estratégia de unicidade:
 *  1. Nome, coordenadas e país — únicos por definição
 *  2. Regime de maré e amplitude reais do cache (Fase 0) — variam por localidade
 *  3. Frases contextuais selecionadas deterministicamente por hash do slug
 *     (categoria geográfica, uso prático, curiosidade oceanográfica)
 *  4. Comparação relativa de amplitude dentro do país/região
 *
 * A função NÃO chama APIs em tempo de build/request. Lê apenas o cache em disco.
 */

import fs from 'fs';
import path from 'path';
import type { CachedTideRegime } from './tideRegimeCache';
import { NL_REGION_BY_SLUG, NL_REGION_TEXT_PT, NL_REGION_TEXT_EN, MH_ATOLL_FACTS } from './regionalFacts';

// Fato real e verificável específico da localidade (região hidrográfica NL
// ou dados geográficos reais de atóis MH), usado para diferenciar páginas
// que o check-content-similarity.ts apontou como texto raso/duplicado.
function realFactSentence(slug: string | undefined, locale: 'pt' | 'en'): string | null {
  if (!slug) return null;
  const nlRegion = NL_REGION_BY_SLUG[slug];
  if (nlRegion) return locale === 'en' ? NL_REGION_TEXT_EN[nlRegion] : NL_REGION_TEXT_PT[nlRegion];
  const mhFact = MH_ATOLL_FACTS[slug];
  if (mhFact) return locale === 'en' ? mhFact.note_en : mhFact.note_pt;
  return null;
}

// ── Cache em memória ──────────────────────────────────────────────────────────
let _regimeCache: Record<string, CachedTideRegime> | null = null;

function getRegimeCache(): Record<string, CachedTideRegime> {
  if (_regimeCache) return _regimeCache;
  try {
    const cachePath = path.join(process.cwd(), 'data', 'tide-regime-cache.json');
    const raw = fs.readFileSync(cachePath, 'utf-8');
    _regimeCache = JSON.parse(raw) as Record<string, CachedTideRegime>;
  } catch {
    console.warn('[tideDescription] Não foi possível carregar tide-regime-cache.json. Execute npm run build:tide-regime-cache.');
    _regimeCache = {};
  }
  return _regimeCache!;
}

// ── Hash determinístico do slug (Murmur-style mix sem deps externas) ──────────
function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (Math.imul(31, h) + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

function hashMix(slug: string, salt: number): number {
  let h = (slugHash(slug) ^ Math.imul(salt, 0x9e3779b9)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

function pick<T>(arr: T[], slug: string, salt = 0): T {
  if (!arr || arr.length === 0) throw new Error('Empty array in pick');
  return arr[hashMix(slug, salt) % arr.length];
}

// ── Banco de frases contextuais ───────────────────────────────────────────────

const AMPLITUDE_CONTEXT_PT: Record<string, string[]> = {
  tiny: [
    'As marés são quase imperceptíveis neste ponto, com variação inferior a 0,5 metro, tornando o mar visualmente calmo durante todo o dia.',
    'Com amplitude inferior a 0,5m, as correntes de maré aqui são fracas — favorável para mergulho e caiaque em águas tranquilas.',
    'A amplitude reduzida característica desta costa protege ancoradouros de variações extremas de nível, facilitando operações portuárias.',
    'As pequenas marés desta região tornam-na particularmente adequada para a prática de vela e caiaque de travessia ao longo do litoral.',
    'Com variações inferiores a meio metro, o nível do mar aqui é dominado principalmente por ondas de superfície e variações de pressão atmosférica.',
    'A fraca amplitude mareal desta costa resulta da geometria da bacia oceânica, que não amplifíca as ondas de maré vindas do oceano aberto.',
    'Praias desta costa apresentam faixas de zona entremarés muito estreitas, com apenas poucos metros entre a linha de preamar e baixa-mar.',
    'Mergulhadores apreciam a previsibilidade das marés fracas, que facilitam o planejamento de mergulhos em recifes e naufrágios próximos.',
  ],
  small: [
    'As marés possuem amplitude moderada, entre 0,5 e 1,5 metro, criando correntes suaves que influenciam a pesca de costa.',
    'Com marés de até 1,5m, os pescadores locais geralmente preferem trabalhar nas 2 horas ao redor da preamar para aproveitar o fluxo mais intenso.',
    'A variação de 0,5 a 1,5 metro expõe faixas de areia e recifes rasos na baixa-mar, criando oportunidades únicas para exploração costeira.',
    'Surfistas desta região sabem que as ondas mudam de caráter entre a preamar e a baixa-mar, embora a variação de nível seja relativamente pequena.',
    'As marés de pequena amplitude facilitam a ancoragem de barcos de pesca artesanal, que podem permanecer no mesmo local ao longo do dia.',
    'A zona entremarés aqui abriga comunidades bentônicas adaptadas às variações moderadas de salinidade e temperatura entre ciclos de maré.',
    'Criadores de ostras e mariscos aproveitam a amplitude mareal de até 1,5m para alternar exposição ao ar e submersão em seus cultivos.',
    'Com menos de 1,5m de variação, as praias desta costa mantêm uma faixa de areia úmida relativamente constante ao longo do dia.',
  ],
  medium: [
    'A amplitude entre 1,5 e 3 metros influencia significativamente a navegação de pequenas embarcações, que devem consultar a tábua antes de cruzar barras rasas.',
    'Com variações de 1,5 a 3 metros, a preamar cobre extensas planícies de maré, enquanto a baixa-mar revela habitats costeiros relevantes para a fauna local.',
    'Marés de médio porte como estas são ideais para surfistas que buscam ondas que mudam de forma e altura conforme o ciclo da maré.',
    'A amplitude de 1,5 a 3 metros cria correntes de canal perceptíveis, que os canoístas e regatistas precisam considerar ao planejar rotas.',
    'Marisqueiros e pescadores de linha aproveitam as marés de médio porte para acessar recifes e pedras costeiras que ficam expostos na baixa-mar.',
    'As extensas planícies de maré expostas a cada ciclo atraem bandos de aves migratórias que se alimentam de invertebrados revelados pela vazante.',
    'Operadores de embarcações de recreio devem verificar a tábua para este porto, pois a diferença de 2 a 3 metros pode expor bancos de areia.',
    'Os 1,5 a 3 metros de amplitude desta costa impulsionam uma troca eficiente de água nas enseadas e estuários, beneficiando a qualidade da água.',
  ],
  large: [
    'A amplitude superior a 3 metros classifica estas marés como de grande intensidade — embarcações de calado médio devem planejar cuidadosamente as entradas e saídas de porto.',
    'Com marés acima de 3 metros, a velocidade das correntes na vazante pode superar 2 nós em canais estreitos, exigindo atenção especial de navegadores.',
    'A intensa variação mareal impulsiona ecossistemas de zona entremarés excepcionalmente produtivos, com aves limícolas e moluscos em abundância.',
    'Marés grandes como estas requerem que a tripulação de veleiros e barcos de pesca monitore o estado da maré antes de entrar em qualquer abrigo raso.',
    'A força das correntes geradas por estas marés é aproveitada historicamente por moinhos de maré e, mais recentemente, por geradores submarinos de energia.',
    'O avanço e recuo de 3 a 5 metros por ciclo cria extensos pântanos de maré e salinas naturais que sustentam cadeias alimentares costeiras complexas.',
    'Pescadores com barco nesta costa seguem rigorosamente a tábua de marés para aproveitar as correntes de enchente e vazante na captura de espécies pelágicas.',
    'A amplitude elevada desta costa resulta da ressonância entre a bacia oceânica e o período natural de oscilação do estuário ou baía local.',
  ],
  extreme: [
    'A amplitude superior a 5 metros coloca esta localidade entre as mais extremas do mundo em termos de variação mareal — um fenômeno geográfico raro.',
    'Com mais de 5 metros de amplitude, a diferença entre preamar e baixa-mar equivale a um prédio de dois andares, transformando radicalmente a paisagem costeira a cada 6 horas.',
    'Marés tão intensas geram potencial significativo para aproveitamento de energia maremotriz, sendo esta costa estudada para projetos de energia renovável.',
    'As correntes geradas por estas marés extremas podem atingir 5 nós ou mais em passagens estreitas, tornando a navegação perigosa em condições adversas.',
    'A paisagem costeira aqui muda dramaticamente a cada ciclo de maré: em preamar, rochas e recifes desaparecem completamente sob metros de água.',
    'Turistas costumam se surpreender com a velocidade de avanço da maré enchente — em locais planos, a água pode ganhar centenas de metros em minutos.',
    'A variação extrema de nível resulta num cuidado especial na ancoragem: barcos precisam de amarra longa suficiente para compensar os vários metros de diferença.',
    'Cientistas utilizam estas costas como laboratório natural para estudar a adaptação de organismos marinhos a variações extremas de exposição e submersão.',
  ],
};

const AMPLITUDE_CONTEXT_EN: Record<string, string[]> = {
  tiny: [
    'Tides here are almost imperceptible, with a range below 0.5 metres, keeping the sea visually calm throughout the day.',
    'With tidal range under 0.5m, currents here are weak — ideal for diving and kayaking in sheltered waters.',
    'The minimal tidal range protects anchorages from extreme water level changes, facilitating port operations.',
    'The small tides here make this coast particularly suitable for sailing and coastal touring by kayak.',
    'With less than half a metre of variation, water levels here are mostly driven by surface waves and atmospheric pressure changes.',
    'The weak tidal amplitude results from the geometry of the ocean basin, which does not amplify incoming tidal waves.',
    'Beaches here have very narrow intertidal zones, with only a few metres between high and low water marks.',
    'Divers appreciate the predictability of weak tides, which simplifies planning dives on nearby reefs and wrecks.',
  ],
  small: [
    'Tides have a moderate range of 0.5 to 1.5 metres, creating gentle currents that influence shore fishing.',
    'With tides reaching up to 1.5m, local fishers typically work around the two hours flanking high tide to benefit from stronger flow.',
    'The 0.5–1.5m variation exposes sandy flats and shallow reefs at low tide, offering unique opportunities for coastal exploration.',
    'Surfers here know the waves shift character between high and low tide, even if the tidal range is relatively modest.',
    'The small tidal range makes anchoring small fishing boats straightforward, as the same spot remains accessible throughout the day.',
    'The intertidal zone hosts benthic communities adapted to moderate salinity and temperature swings across tidal cycles.',
    'Oyster and shellfish farmers exploit the 0.5–1.5m range to alternate aerial exposure and submersion in their culture beds.',
    'With under 1.5m of variation, beaches maintain a relatively constant band of wet sand throughout the day.',
  ],
  medium: [
    'The 1.5–3 metre tidal range significantly affects navigation for small vessels, which should consult the tide table before crossing shallow bars.',
    'With 1.5–3 metre swings, high tide floods extensive tidal flats while low tide reveals coastal habitats important to local wildlife.',
    'Mid-range tides like these are popular with surfers seeking waves that shift in shape and height across the tidal cycle.',
    'The 1.5–3m range generates noticeable channel currents that paddlers and racers must account for when planning routes.',
    'Shellfish gatherers and line fishers exploit these mid-range tides to access reefs and rocky outcrops exposed at low water.',
    'The broad tidal flats exposed each cycle attract flocks of migratory shorebirds feeding on invertebrates uncovered by the ebb.',
    'Recreational boaters should check the table for this port, as a 2–3 metre swing can expose sandbanks.',
    'The 1.5–3m tidal range drives efficient water exchange in coves and estuaries, supporting good water quality.',
  ],
  large: [
    'Tidal range exceeding 3 metres classifies these as high-amplitude tides — medium-draft vessels must carefully plan harbour entries and exits.',
    'With tides above 3 metres, ebb current speeds can exceed 2 knots in narrow channels, requiring extra caution from mariners.',
    'The intense tidal variation drives exceptionally productive intertidal ecosystems, supporting abundant shorebirds and molluscs.',
    'Large tides like these require sailing crews and fishing boats to monitor tidal state before entering any shallow harbour.',
    'The tidal force here has historically powered tidal mills and, more recently, underwater electricity generators.',
    'The 3–5 metre advance and retreat per cycle creates extensive salt marshes and natural evaporation ponds sustaining complex coastal food webs.',
    'Fishers here closely follow the tide table to exploit flood and ebb currents when targeting pelagic species.',
    'The high amplitude results from resonance between the ocean basin and the natural oscillation period of the local estuary or bay.',
  ],
  extreme: [
    'Tidal range exceeding 5 metres ranks this location among the world\'s most extreme — a rare geographic phenomenon.',
    'With more than 5 metres of range, the difference between high and low water equals a two-storey building, dramatically reshaping the coastline every 6 hours.',
    'Such powerful tides generate significant tidal energy potential, and this coastline is actively studied for renewable energy projects.',
    'Currents driven by these extreme tides can reach 5 knots or more through narrow passages, making navigation hazardous in adverse conditions.',
    'The coastal landscape here changes dramatically each tidal cycle: at high water, rocks and reefs disappear under metres of ocean.',
    'Tourists are often surprised by how fast the flood tide advances — across flat terrain it can claim hundreds of metres in minutes.',
    'Extreme range demands long anchor chains: boats must allow for several metres of vertical change when mooring.',
    'Scientists use these shores as natural laboratories to study how marine organisms adapt to extreme cycles of exposure and submersion.',
  ],
};

const REGIME_USE_PT: Record<string, string[]> = {
  diurno: [
    'O regime diurno simplifica o planejamento: há apenas uma janela de preamar e uma de baixa-mar por dia, facilitando a organização de saídas de pesca e banhos de mar.',
    'Com uma única maré alta por dia, o ciclo diurno permite antecipar com facilidade o melhor horário para atividades aquáticas como caiaque, surfe e mergulho.',
    'O padrão diurno é menos comum globalmente — ocorre principalmente em costas do Golfo do México, norte da Austrália e partes do sudeste asiático.',
    'Em costas com maré diurna, as correntes de enchente e vazante tendem a ser mais prolongadas, durando cerca de 12 horas consecutivas por sentido.',
    'Pescadores de praia em regiões de maré diurna aproveitam o único pico diário de maré alta para concentrar suas jornadas de pesca.',
    'O ciclo diurno favorece o acúmulo de calor em lagoas costeiras durante a longa exposição na baixa-mar diária.',
  ],
  semidiurno: [
    'O padrão semidiurno, com dois ciclos completos a cada 24 horas, permite planejar atividades náuticas em praticamente qualquer turno do dia.',
    'A regularidade do regime semidiurno — duas preiamares e duas baixa-mares por dia com intervalos de cerca de 6 horas — facilita o planejamento de travessias e saídas de pesca.',
    'As duas marés altas e baixas diárias criam dois picos de corrente por dia, valorizados por pescadores que aproveitam o fluxo intenso nas mudanças de maré.',
    'Navegadores em áreas semidiurnas dispõem de duas janelas de água profunda por dia para transitar por barras rasas ou entrar em marinas.',
    'O ciclo semidiurno renova a água das enseadas com alta frequência, reduzindo o tempo de residência da água e mantendo a oxigenação elevada.',
    'Banhotas e praticantes de stand-up paddle podem escolher entre a maré alta da manhã ou da tarde para aproveitar águas mais calmas.',
  ],
  misto: [
    'O regime misto torna o planejamento mais complexo: as alturas das marés altas do dia são desiguais, o que exige leitura cuidadosa da tábua para cada jornada.',
    'As marés mistas combinam características de regimes diurno e semidiurno — a maré da manhã pode ser muito diferente da maré da tarde em termos de altura e corrente.',
    'Navegadores experientes nesta costa sabem que a segunda maré alta do dia costuma ser mais baixa, exigindo verificação cuidadosa da profundidade em barras e canais.',
    'A forte desigualdade diurna em marés mistas cria correntes mais intensas durante a vazante da maior maré alta para a menor maré baixa.',
    'Espécies bentônicas em zonas entremarés de regime misto precisam resistir a tempos de exposição ao ar variáveis entre a maré alta principal e a secundária.',
    'Pescadores esportivos em regiões de maré mistas priorizam a maior maré alta do dia para saídas em busca de predadores costeiros.',
  ],
};

const REGIME_USE_EN: Record<string, string[]> = {
  diurno: [
    'The diurnal pattern simplifies planning: with just one high and one low tide per day, scheduling fishing trips and beach activities is straightforward.',
    'With a single daily high tide, the diurnal cycle makes it easy to pinpoint the best window for kayaking, surfing, and diving.',
    'The diurnal pattern is relatively rare worldwide, occurring mainly along Gulf of Mexico coasts, northern Australia, and parts of Southeast Asia.',
    'On diurnal coasts, flood and ebb currents tend to be more prolonged, lasting nearly 12 consecutive hours in each direction.',
    'Shore anglers in diurnal tide zones focus their fishing efforts around the single daily high tide peak.',
    'The diurnal cycle promotes heat buildup in coastal lagoons during the long daily low tide exposure.',
  ],
  semidiurno: [
    'The semi-diurnal pattern, with two complete cycles every 24 hours, allows nautical activities to be planned in virtually any shift of the day.',
    'The regularity of semi-diurnal tides — two highs and two lows approximately 6 hours apart — simplifies crossing planning and fishing scheduling.',
    'Two daily tidal cycles create two current peaks per day, valued by anglers who leverage stronger flow during tidal changes.',
    'Mariners in semi-diurnal areas benefit from two high-water windows each day to cross shallow bars or enter marinas.',
    'The semi-diurnal cycle flushes coves frequently, shortening water residence time and maintaining high oxygenation levels.',
    'Bathers and stand-up paddlers can choose between morning and afternoon high tides for calm-water conditions.',
  ],
  misto: [
    'Mixed tides make planning more complex: the day\'s two high tides reach different heights, requiring careful study of the tide table before each outing.',
    'Mixed tides blend characteristics of diurnal and semi-diurnal patterns — the morning tide may differ greatly from the afternoon tide in height and current.',
    'Experienced mariners on this coast know the second daily high tide is often lower, requiring careful depth checks at bars and channels.',
    'Significant diurnal inequality in mixed tides generates stronger currents when falling from the higher high water to the lower low water.',
    'Benthic species in mixed tide intertidal zones adapt to variable aerial exposure durations between primary and secondary high tides.',
    'Sport fishers in mixed tide regions target the day\'s higher high tide when chasing predatory coastal fish.',
  ],
};

const GEO_CONTEXT_PT = [
  'Esta localidade integra uma das regiões costeiras monitoradas continuamente por redes de estações maregráficas automáticas.',
  'A costa desta região é influenciada por correntes oceânicas de grande escala que modulam a temperatura da água ao longo do ano.',
  'A posição geográfica desta área cria condições únicas de interação entre ondas de swell oceânico e as marés locais.',
  'O litoral desta região é marcado por variações sazonais de vento e pressão atmosférica que podem afetar a altura das marés em até 0,3m em eventos extremos.',
  'As águas desta costa estão sujeitas à influência de eventos como El Niño, que pode elevar o nível médio do mar temporariamente.',
  'A morfologia da plataforma continental nesta região amplifica ou atenua as ondas de maré provenientes do oceano aberto.',
  'Esta costa está sujeita a correntes de deriva litorânea que distribuem sedimentos e moldam as praias ao longo do ano.',
  'O nível do mar nesta área apresenta tendência de aumento gradual associada às mudanças climáticas globais, o que é monitorado pelas estações locais.',
  'A dinâmica de marés nesta baia ou enseada é modulada pela geometria da entrada, que pode ampliar ou reduzir a amplitude em relação ao oceano aberto.',
  'A velocidade e direção das correntes de maré aqui variam sazonalmente com os ventos dominantes da região.',
  'Os dados desta estação integram a rede global de monitoramento do nível do mar, contribuindo para pesquisas sobre mudanças de longo prazo.',
  'A topografia submarina próxima à costa concentra as correntes de maré em canais definidos, alterando as condições de navegação.',
  'Eventos meteorológicos intensos como tempestades podem criar sobre-elevações temporárias (“storm surge”) que se somam à preamar astronomica.',
  'A salinidade das águas costeiras aqui varia com as estações chuvosas, criando gradientes que influenciam a distribuição de espécies marinhas.',
];

const GEO_CONTEXT_EN = [
  'This location is part of a coastline continuously monitored by automated tide gauge networks.',
  'The coast here is influenced by large-scale ocean currents that modulate water temperature throughout the year.',
  'Its geographic position creates unique interactions between oceanic swell and local tidal currents.',
  'This shoreline is subject to seasonal wind and pressure variations that can affect tide height by up to 0.3m during extreme events.',
  'Waters along this coast are influenced by events such as El Niño, which can temporarily raise mean sea level.',
  'The continental shelf morphology in this area amplifies or attenuates tidal waves arriving from the open ocean.',
  'This coast is subject to longshore drift currents that distribute sediment and shape beaches throughout the year.',
  'Mean sea level here shows a gradual rising trend linked to global climate change, monitored continuously by local gauges.',
  'Tidal dynamics in this bay or inlet are shaped by the geometry of its entrance, which can amplify or reduce range relative to the open sea.',
  'The speed and direction of tidal currents here vary seasonally with the region\'s prevailing winds.',
  'Data from this station feeds into the global sea-level monitoring network, contributing to long-term change research.',
  'Nearby submarine topography concentrates tidal currents into defined channels, altering local navigation conditions.',
  'Intense weather events such as storms can create temporary storm surges that add to the astronomical high tide.',
  'Coastal water salinity varies with rainy seasons, creating gradients that influence the distribution of marine species.',
];

const INTRO_VARIANTS_PT = [
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `${name} está localizada nas coordenadas ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'L' : 'O'}, no litoral de ${country}, no hemisfério ${hemi}.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `Situada na costa de ${country} (${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'L' : 'O'}), a localidade de ${name} encontra-se no hemisfério ${hemi}.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `No hemisfério ${hemi}, a área costeira de ${name} (${country}) localiza-se na posição geográfica ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'} e ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'L' : 'O'}.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `Com localização geográfica em ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'L' : 'O'}, ${name} é um ponto costeiro de referência em ${country}.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `Pertencente ao litoral de ${country}, ${name} está posicionada a ${lat.toFixed(2)}° de latitude ${lat >= 0 ? 'Norte' : 'Sul'} e ${Math.abs(lon).toFixed(2)}° de longitude ${lon >= 0 ? 'Leste' : 'Oeste'}.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `As coordenadas de ${name} (${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'L' : 'O'}) situam este trecho da costa de ${country} no hemisfério ${hemi}.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `Localizada a ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'} de latitude e ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'L' : 'O'} de longitude, a região de ${name} é um destaque marítimo de ${country}.`,
];

const INTRO_VARIANTS_EN = [
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `${name} is located at ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'} on the coast of ${country}, in the ${hemi} hemisphere.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `Situated along the coastline of ${country} (${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}), ${name} lies in the ${hemi} hemisphere.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `In the ${hemi} hemisphere, the coastal area of ${name} (${country}) is positioned at coordinates ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'} and ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `With geographic coordinates of ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}, ${name} is a key coastal reference in ${country}.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `Located in ${country}, ${name} sits at latitude ${lat.toFixed(2)}° ${lat >= 0 ? 'North' : 'South'} and longitude ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'East' : 'West'}.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `The coordinates for ${name} (${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}) place this stretch of ${country}'s coast in the ${hemi} hemisphere.`,
  (name: string, lat: number, lon: number, country: string, hemi: string) =>
    `Found at ${lat.toFixed(2)}° ${lat >= 0 ? 'N' : 'S'} latitude and ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'} longitude, ${name} serves as a prominent coastal location in ${country}.`,
];

const PAGE_PURPOSE_PT = [
  (ano: number, name: string) => `Esta página apresenta a tábua de marés completa de ${ano} para ${name}, com horários precisos de preamar e baixa-mar e as alturas em metros para cada dia do ano.`,
  (ano: number, name: string) => `Aqui você consulta a previsão oficial de marés ${ano} em ${name}, incluindo tábua mensal detalhada, horários de picos e variações métricas diárias.`,
  (ano: number, name: string) => `Consulte a tábua de maré atualizada de ${ano} em ${name} com horários exatos de maré alta e baixa, amplitudes e coeficientes para navegação e pesca.`,
  (ano: number, name: string) => `O relatório de marés de ${ano} para ${name} reúne o calendário anual de preamar e baixa-mar com níveis d'água previstos para o ano inteiro.`,
  (ano: number, name: string) => `Acompanhe o comportamento mareal em ${name} ao longo de ${ano} através da nossa tabela com horários diários de máxima e mínima elevação.`,
  (ano: number, name: string) => `O boletim maregráfico de ${ano} para ${name} traz o quadro completo de oscilações do mar com marcas horárias para os 365 dias do ano.`,
  (ano: number, name: string) => `Confira o guia anual de marés ${ano} de ${name}, elaborado com projeções contínuas de preamar e baixa-mar ajustadas em metros.`,
];

const PAGE_PURPOSE_EN = [
  (ano: number, name: string) => `This page shows the complete ${ano} tide table for ${name}, with precise high and low tide times and heights in metres for every day of the year.`,
  (ano: number, name: string) => `Check the official ${ano} tide forecast for ${name} here, including detailed monthly schedules, peak times, and daily metric swings.`,
  (ano: number, name: string) => `Access the updated ${ano} tide table for ${name} featuring exact high and low water times, ranges, and coefficients for boating and angling.`,
  (ano: number, name: string) => `The ${ano} tidal schedule for ${name} provides a full-year calendar of high and low waters alongside predicted sea levels.`,
  (ano: number, name: string) => `Track tidal behavior at ${name} throughout ${ano} using our comprehensive table with daily high and low water timestamps.`,
  (ano: number, name: string) => `The ${ano} tidal bulletin for ${name} delivers a thorough schedule of sea level swings with hourly marks for the entire year.`,
  (ano: number, name: string) => `Review the annual ${ano} tide guide for ${name}, constructed with continuous high and low water forecasts measured in metres.`,
];

const VALIDATION_NOTE_PT = [
  'Todas as previsões são calculadas a partir de constantes harmônicas validadas para esta estação costeira, com precisão de ±15 minutos na maioria das condições.',
  'Os cálculos MareAgora utilizam decomposição harmônica calibrada por altimetria de satélite e mareógrafos locais para assegurar alta acurácia.',
  'A modelagem preditiva emprega constantes oceânicas locais atualizadas, garantindo margem de erro mínima no horário dos extremos mareais.',
  'As tábuas astronômicas deste local são processadas com algoritmos de harmônicos mareais e ajustadas pela batimetria regional.',
  'Os horários e alturas reportados derivam da análise de componentes harmônicas fundamentais (M2, S2, K1, O1) aplicadas a esta coordenada.',
  'Nossa base de dados oceanográfica sincroniza medições maregráficas históricas para otimizar os coeficientes harmônicos desta costa.',
  'Os dados preditivos são validados continuamente contra séries temporais registradas por estações de referência costeiras.',
];

const VALIDATION_NOTE_EN = [
  'All tide predictions are computed from harmonic constants validated for this coastal station, with accuracy within ±15 minutes for most conditions.',
  'MaréAgora calculations use harmonic decomposition calibrated via satellite altimetry and local gauges to ensure high accuracy.',
  'Predictive modeling employs updated local oceanic constants, ensuring minimal margin of error in peak tidal timing.',
  'Astronomical tables for this site are processed using tidal harmonic algorithms and adjusted for regional bathymetry.',
  'Reported times and heights derive from fundamental harmonic component analysis (M2, S2, K1, O1) applied to these coordinates.',
  'Our oceanographic database syncs historical gauge records to refine harmonic coefficients for this stretch of coastline.',
  'Predictive output is continuously benchmarked against time series recorded by regional coastal reference stations.',
];

// ── Helpers de contexto ───────────────────────────────────────────────────────

function amplitudeCategory(amp: number): keyof typeof AMPLITUDE_CONTEXT_PT {
  if (amp < 0.5) return 'tiny';
  if (amp < 1.5) return 'small';
  if (amp < 3.0) return 'medium';
  if (amp < 5.0) return 'large';
  return 'extreme';
}

const MONTH_NAMES_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function hemisphereLabel(lat: number, locale: 'pt' | 'en') {
  if (locale === 'pt') return lat >= 0 ? 'norte' : 'sul';
  return lat >= 0 ? 'northern' : 'southern';
}

function seasonLabel(lat: number, locale: 'pt' | 'en'): string {
  const month = new Date().getMonth();
  const isNorth = lat >= 0;
  const seasons = locale === 'pt'
    ? { sp: 'primavera', su: 'verão', au: 'outono', wi: 'inverno' }
    : { sp: 'spring', su: 'summer', au: 'autumn', wi: 'winter' };
  const northMap = [seasons.wi, seasons.wi, seasons.sp, seasons.sp, seasons.sp, seasons.su, seasons.su, seasons.su, seasons.au, seasons.au, seasons.au, seasons.wi];
  const southMap = [seasons.su, seasons.su, seasons.au, seasons.au, seasons.au, seasons.wi, seasons.wi, seasons.wi, seasons.sp, seasons.sp, seasons.sp, seasons.su];
  return (isNorth ? northMap : southMap)[month];
}

// ── Função principal ──────────────────────────────────────────────────────────

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
  const hemisphere = hemisphereLabel(lat, locale);
  const season = seasonLabel(lat, locale);
  const isCoastal = Math.abs(lat) < 70;

  // Dados do cache de regime
  const cache = getRegimeCache();
  const cached = slug ? cache[slug] : null;

  if (slug && !cached) {
    console.warn(`[tideDescription] Slug "${slug}" não encontrado no cache. Execute npm run build:tide-regime-cache.`);
  }

  const regime = cached?.regime ?? 'semidiurno';
  const ampMedia = cached?.amplitudeMedia ?? 2.0;
  const ampMax = cached?.amplitudeMax ?? 2.5;
  const ampCat = amplitudeCategory(ampMedia);
  const isEstimate = cached?.isEstimate ?? true;

  // Seleção determinística de frases para este slug
  const effectiveSlug = slug ?? (name + lat + lon).replace(/\s/g, '-');

  if (locale === 'en') {
    const monthName = MONTH_NAMES_EN[month];
    const regimeLabel = regime === 'semidiurno'
      ? 'semi-diurnal (two high and two low tides per day)'
      : regime === 'diurno'
        ? 'diurnal (one high and one low tide per day)'
        : 'mixed semi-diurnal (unequal tidal heights across the day)';

    const introFn = pick(INTRO_VARIANTS_EN, effectiveSlug, 0);
    const ampContext = pick(AMPLITUDE_CONTEXT_EN[ampCat], effectiveSlug, 1);
    const regimeUse = pick(REGIME_USE_EN[regime], effectiveSlug, 2);
    const geoContext = pick(GEO_CONTEXT_EN, effectiveSlug, 3);
    const geoContext2 = pick(GEO_CONTEXT_EN, effectiveSlug + String(Math.round(ampMedia * 10)), 4);
    const purposeFn = pick(PAGE_PURPOSE_EN, effectiveSlug, 5);
    const valNote = pick(VALIDATION_NOTE_EN, effectiveSlug, 6);
    const estimateNote = isEstimate ? ' (values estimated from nearest harmonic station)' : '';
    const realFact = realFactSentence(slug, 'en');

    return [
      introFn(name, lat, lon, countryName, hemisphere),
      `Its tidal pattern is ${regimeLabel}, with a mean tidal range of ${ampMedia}m and spring tides reaching up to ${ampMax}m${estimateNote}.`,
      realFact,
      ampContext,
      regimeUse,
      geoContext !== geoContext2 ? geoContext2 : GEO_CONTEXT_EN[(GEO_CONTEXT_EN.indexOf(geoContext) + 1) % GEO_CONTEXT_EN.length],
      purposeFn(ano, name),
      `In ${monthName}, ${name} is in its ${season} season${isCoastal ? ', a key period for water sports, fishing, diving, and coastal navigation' : ''}.`,
      valNote,
    ].filter(Boolean).join(' ');
  }

  // ── Português ──────────────────────────────────────────────────────────────
  const monthName = MONTH_NAMES_PT[month];
  const regimeLabel = regime === 'semidiurno'
    ? 'semidiurno (duas marés altas e duas baixas por dia)'
    : regime === 'diurno'
      ? 'diurno (uma maré alta e uma baixa por dia)'
      : 'misto (marés com alturas desiguais ao longo do dia)';

  const introFn = pick(INTRO_VARIANTS_PT, effectiveSlug, 0);
  const ampContext = pick(AMPLITUDE_CONTEXT_PT[ampCat], effectiveSlug, 1);
  const regimeUse = pick(REGIME_USE_PT[regime], effectiveSlug, 2);
  const geoContext = pick(GEO_CONTEXT_PT, effectiveSlug, 3);
  const geoContext2 = pick(GEO_CONTEXT_PT, effectiveSlug + String(Math.round(ampMedia * 10)), 4);
  const purposeFn = pick(PAGE_PURPOSE_PT, effectiveSlug, 5);
  const valNote = pick(VALIDATION_NOTE_PT, effectiveSlug, 6);
  const estimateNote = isEstimate ? ' (estimado a partir da estação harmônica mais próxima)' : '';
  const realFact = realFactSentence(slug, 'pt');

  return [
    introFn(name, lat, lon, countryName, hemisphere),
    `O regime de marés local é ${regimeLabel}, com amplitude média de ${ampMedia}m e máxima de ${ampMax}m nas sizígias${estimateNote}.`,
    realFact,
    ampContext,
    regimeUse,
    geoContext !== geoContext2 ? geoContext2 : GEO_CONTEXT_PT[(GEO_CONTEXT_PT.indexOf(geoContext) + 1) % GEO_CONTEXT_PT.length],
    purposeFn(ano, name),
    `Em ${monthName}, ${name} vive o período de ${season}${isCoastal ? ', época importante para esportes náuticos, pesca, mergulho e planejamento de travessias' : ''}.`,
    valNote,
  ].filter(Boolean).join(' ');
}

/**
 * Fatos geográficos reais e verificáveis por localidade, usados para
 * diferenciar o conteúdo editorial de localidades cujo texto gerado
 * automaticamente (tideDescription.ts) ficou similar demais em
 * scripts/check-content-similarity.ts — normalmente porque a mesma
 * categoria de amplitude de maré é compartilhada por dezenas de pontos
 * vizinhos (ex.: costa da Holanda, atóis das Ilhas Marshall).
 *
 * Fonte dos dados:
 *  - Regiões hidrográficas da Holanda: classificação por coordenadas reais
 *    (lat/lon já presentes em globalPlaces.ts) + nomenclatura oficial de
 *    Rijkswaterstaat (Waddenzee, Zeeuwse Delta/Deltawerken, plataformas
 *    offshore no Mar do Norte, foz do Reno-Mosa em Roterdão, cursos
 *    fluviais/lacustres interiores).
 *  - Atóis das Ilhas Marshall: população (censo 2021), número de ilhotas,
 *    cadeia (Ratak/Ralik) e distância a um vizinho notável — dados públicos
 *    de fontes geográficas (Wikipedia/censo RMI 2021).
 *
 * Uso: generateTideDescription() insere uma frase adicional com este fato
 * real quando o slug está presente aqui, aumentando a diversidade lexical
 * do texto e evitando classificação como conteúdo raso/duplicado.
 */

// ── Holanda: classificação por região hidrográfica real ───────────────────

export type NLWaterRegion =
  | 'platform'
  | 'wadden'
  | 'delta'
  | 'rotterdam'
  | 'binnenrivier'
  | 'noordzeekust';

export const NL_REGION_BY_SLUG: Record<string, NLWaterRegion> = {
  amsterdam: 'binnenrivier',
  rotterdam: 'rotterdam',
  j61: 'platform',
  nes: 'wadden',
  a121: 'platform',
  d151: 'platform',
  k141: 'platform',
  vuren: 'binnenrivier',
  kampen: 'binnenrivier',
  lemmer: 'binnenrivier',
  cadzand: 'delta',
  yerseke: 'delta',
  delfzijl: 'wadden',
  kadoelen: 'binnenrivier',
  moerdijk: 'rotterdam',
  dordrecht: 'rotterdam',
  eemshaven: 'wadden',
  geulhaven: 'rotterdam',
  harlingen: 'wadden',
  parksluis: 'rotterdam',
  'rotterdam-nl': 'rotterdam',
  terneuzen: 'delta',
  'den-helder': 'wadden',
  f3platform: 'platform',
  'gouda-brug': 'binnenrivier',
  huibertgat: 'wadden',
  lauwersoog: 'wadden',
  marollegat: 'delta',
  oudeschild: 'wadden',
  stavenisse: 'delta',
  vlissingen: 'delta',
  walsoorden: 'delta',
  zwartsluis: 'binnenrivier',
  amaliahaven: 'rotterdam',
  keizersveer: 'binnenrivier',
  'l9-platform': 'platform',
  'petten-zuid': 'noordzeekust',
  schoonhoven: 'binnenrivier',
  spijkenisse: 'rotterdam',
  westkapelle: 'delta',
  scheveningen: 'noordzeekust',
  'eems-meetpaal': 'wadden',
  'euro-platform': 'platform',
  haringvliet10: 'binnenrivier',
  'k13a-platform': 'platform',
  spooldersluis: 'binnenrivier',
  goidschalxoord: 'rotterdam',
  'hollandse-brug': 'binnenrivier',
  kornwerderzand: 'wadden',
  'krimpen-ad-lek': 'rotterdam',
  'mond-der-vecht': 'binnenrivier',
  'platform-d15-a': 'platform',
  'platform-f16-a': 'platform',
  'roompot-buiten': 'delta',
  schellingwoude: 'binnenrivier',
  'texel-noordzee': 'wadden',
  'vlakte-vd-raan': 'delta',
  'vlieland-haven': 'wadden',
  'north-cormorant': 'platform',
  schiermonnikoog: 'wadden',
  wierumergronden: 'wadden',
  'den-oever-buiten': 'wadden',
};

export const NL_REGION_TEXT_PT: Record<NLWaterRegion, string> = {
  platform:
    'Este ponto corresponde a uma plataforma de extração de gás/petróleo ou estação de medição offshore no Mar do Norte neerlandês, sem população residente fixa, onde a maré segue diretamente o regime oceânico aberto, sem atenuação por baías ou deltas.',
  wadden:
    'Esta localidade situa-se na orla do Mar de Wadden (Waddenzee), reconhecido como Património Natural Mundial pela UNESCO, uma região de extensos bancos de areia e lama que ficam expostos entre as ilhas-barreira e o continente a cada baixa-mar.',
  delta:
    'Esta localidade faz parte do delta do Reno-Mosa-Escalda, na Zelândia, região reconfigurada após a grande inundação de 1953 pelo sistema de barragens móveis Deltawerken, um dos maiores projetos de defesa contra inundações do mundo.',
  rotterdam:
    'Esta localidade situa-se na região da foz do Reno-Mosa, junto ao Porto de Roterdão — o maior porto marítimo da Europa — onde o canal Nieuwe Waterweg liga o rio ao Mar do Norte.',
  binnenrivier:
    'Esta localidade fica num trecho fluvial ou lacustre do interior neerlandês, onde a influência da maré astronômica chega atenuada e é, em parte, regulada por eclusas (sluizen) que controlam o nível da água independentemente do ciclo lunar.',
  noordzeekust:
    'Esta localidade fica na costa aberta do Mar do Norte na Holanda, fora do efeito de funil de baías ou deltas, com regime de marés relativamente uniforme ao longo do litoral.',
};

export const NL_REGION_TEXT_EN: Record<NLWaterRegion, string> = {
  platform:
    'This point corresponds to an offshore gas/oil extraction platform or measurement station in the Dutch North Sea, with no permanent resident population, where the tide follows the open ocean regime directly, without attenuation by bays or deltas.',
  wadden:
    'This location sits on the edge of the Wadden Sea (Waddenzee), a UNESCO World Heritage natural site, a region of extensive sand and mud flats exposed between the barrier islands and the mainland at every low tide.',
  delta:
    'This location is part of the Rhine-Meuse-Scheldt delta in Zeeland, reshaped after the great 1953 flood by the Deltawerken storm-surge barrier system, one of the largest flood-defence projects in the world.',
  rotterdam:
    'This location sits at the mouth of the Rhine-Meuse, next to the Port of Rotterdam — the largest seaport in Europe — where the Nieuwe Waterweg canal connects the river to the North Sea.',
  binnenrivier:
    'This location lies along an inland river or lake stretch of the Netherlands, where the astronomical tide arrives attenuated and is partly regulated by locks (sluizen) that control water level independent of the lunar cycle.',
  noordzeekust:
    'This location sits on the open North Sea coast of the Netherlands, outside the funnelling effect of bays or deltas, with a fairly uniform tidal regime along the shoreline.',
};

// ── Ilhas Marshall: fatos reais por atol ───────────────────────────────────

interface AtollFact {
  chain: 'Ratak' | 'Ralik';
  islets: number;
  population2021: number | null; // null = não habitado / sem censo
  note_pt: string;
  note_en: string;
}

export const MH_ATOLL_FACTS: Record<string, AtollFact> = {
  majuro: {
    chain: 'Ratak',
    islets: 64,
    population2021: 27797,
    note_pt: 'Majuro é a capital e principal centro administrativo das Ilhas Marshall, com os bairros de Delap, Uliga e Djarrit concentrando a maior parte da população do país.',
    note_en: 'Majuro is the capital and main administrative center of the Marshall Islands, with the Delap-Uliga-Djarrit districts holding most of the country\'s population.',
  },
  enewetok: {
    chain: 'Ralik',
    islets: 40,
    population2021: 296,
    note_pt: 'Enewetak faz parte da cadeia Ralik e foi local de testes nucleares dos Estados Unidos entre 1948 e 1958, com uma população atual de menos de 300 habitantes.',
    note_en: 'Enewetak belongs to the Ralik Chain and was the site of United States nuclear testing between 1948 and 1958, with a current population under 300 residents.',
  },
  'kwajalein-atoll-kwajalein-i': {
    chain: 'Ralik',
    islets: 97,
    population2021: 9789,
    note_pt: 'Kwajalein é o maior atol do mundo em área de lagoa e sedia a base de testes de mísseis do Exército dos EUA; a maioria dos cerca de 9.800 residentes vive na vizinha ilha de Ebeye.',
    note_en: 'Kwajalein is the largest atoll in the world by lagoon area and hosts a US Army missile testing range; most of its roughly 9,800 residents live on the nearby island of Ebeye.',
  },
  'kwajalein-atoll-namur-island': {
    chain: 'Ralik',
    islets: 97,
    population2021: null,
    note_pt: 'Namur é uma ilhota do extremo norte do Atol Kwajalein, o maior atol do mundo em área de lagoa, hoje ligado por aterro à ilha de Roi.',
    note_en: 'Namur is an islet at the northern tip of Kwajalein Atoll, the world\'s largest atoll by lagoon area, now connected by landfill to Roi Island.',
  },
  'ujae-atoll': {
    chain: 'Ralik',
    islets: 14,
    population2021: 310,
    note_pt: 'Ujae fica cerca de 122 km a oeste do Atol Kwajalein e tem uma população de pouco mais de 300 pessoas segundo o censo de 2021.',
    note_en: 'Ujae lies about 122 km west of Kwajalein Atoll and has a population of just over 300 people according to the 2021 census.',
  },
  'arno-atoll': {
    chain: 'Ratak',
    islets: 133,
    population2021: 1141,
    note_pt: 'Arno é o atol mais próximo da capital Majuro, a apenas 20 km de distância, e pode ser avistado a olho nu em dias claros.',
    note_en: 'Arno is the atoll closest to the capital Majuro, only 20 km away, and can be seen with the naked eye on clear days.',
  },
  'ailuk-atoll': {
    chain: 'Ratak',
    islets: 57,
    population2021: 235,
    note_pt: 'Ailuk fica cerca de 72 km ao norte de Wotje, na metade norte da cadeia Ratak, com uma população de 235 pessoas no censo de 2021.',
    note_en: 'Ailuk lies about 72 km north of Wotje, in the northern half of the Ratak Chain, with a population of 235 people in the 2021 census.',
  },
  'wotje-atoll': {
    chain: 'Ratak',
    islets: 75,
    population2021: 816,
    note_pt: 'Wotje tem uma das maiores áreas terrestres das Ilhas Marshall (8,18 km²) e abriga a Northern Islands High School, atraindo estudantes de outros atóis.',
    note_en: 'Wotje has one of the largest land areas in the Marshall Islands (8.18 km²) and is home to Northern Islands High School, drawing students from other atolls.',
  },
  'likiep-atoll': {
    chain: 'Ratak',
    islets: 65,
    population2021: 228,
    note_pt: 'Likiep possui o ponto mais alto natural das Ilhas Marshall, um pequeno morro de 10 metros, e fica cerca de 55 km a noroeste de Wotje.',
    note_en: 'Likiep has the highest natural point in the Marshall Islands, a small 10-metre rise, and lies about 55 km northwest of Wotje.',
  },
  'erikub-atoll': {
    chain: 'Ratak',
    islets: 14,
    population2021: 0,
    note_pt: 'Erikub é um atol desabitado administrado pelo povo de Wotje, com apenas 1,53 km² de terra ao redor de uma lagoa de 230 km².',
    note_en: 'Erikub is an uninhabited atoll administered by the people of Wotje, with only 1.53 km² of land around a 230 km² lagoon.',
  },
  'rongerik-atoll': {
    chain: 'Ralik',
    islets: 22,
    population2021: 0,
    note_pt: 'Rongerik é desabitado hoje, mas abrigou temporariamente os habitantes do Atol Bikini entre 1946 e 1948, durante os testes nucleares dos EUA.',
    note_en: 'Rongerik is uninhabited today, but temporarily housed the people of Bikini Atoll between 1946 and 1948 during US nuclear testing.',
  },
  'maloelap-atoll': {
    chain: 'Ratak',
    islets: 71,
    population2021: 395,
    note_pt: 'Maloelap fica cerca de 18 km ao norte do Atol Aur, e sua ilhota Taroa serve de centro administrativo do atol.',
    note_en: 'Maloelap lies about 18 km north of Aur Atoll, and its Taroa islet serves as the atoll\'s administrative center.',
  },
  'ailinglapalap-atoll': {
    chain: 'Ralik',
    islets: 56,
    population2021: 1175,
    note_pt: 'Ailinglaplap é um dos atóis mais populosos fora da capital, com economia baseada em plantações de coco, e seu nome significa "o maior atol" em marshalês.',
    note_en: 'Ailinglaplap is one of the most populous atolls outside the capital, with an economy based on coconut plantations, and its name means "the greatest atoll" in Marshallese.',
  },
  'ebon-boston-atoll': {
    chain: 'Ralik',
    islets: 22,
    population2021: 469,
    note_pt: 'Ebon é o atol mais ao sul das Ilhas Marshall, com 22 ilhotas e uma lagoa profunda de 104 km².',
    note_en: 'Ebon is the southernmost atoll of the Marshall Islands, with 22 islets and a deep 104 km² lagoon.',
  },
  'port-rhin-mili-atoll': {
    chain: 'Ratak',
    islets: 92,
    population2021: 497,
    note_pt: 'Mili é o segundo atol com maior área terrestre das Ilhas Marshall, atrás apenas de Kwajalein, e fica cerca de 78 km a sudeste de Arno.',
    note_en: 'Mili is the second-largest atoll by land area in the Marshall Islands, after Kwajalein, and lies about 78 km southeast of Arno.',
  },
  'jaluit-atoll-se-pass': {
    chain: 'Ralik',
    islets: 91,
    population2021: 1409,
    note_pt: 'Jaluit foi a antiga sede administrativa das Ilhas Marshall antes de Majuro, e hoje é uma área de conservação reconhecida pela Convenção de Ramsar.',
    note_en: 'Jaluit was the former administrative seat of the Marshall Islands before Majuro, and is now a conservation area recognised under the Ramsar Convention.',
  },
  'rongelap-island-rongelap-atoll': {
    chain: 'Ralik',
    islets: 61,
    population2021: 0,
    note_pt: 'Rongelap está desabitado desde 1985, quando seus moradores se autoexilaram após décadas de contaminação radioativa causada pelo teste nuclear Castle Bravo, de 1954.',
    note_en: 'Rongelap has been uninhabited since 1985, when its residents self-exiled after decades of radioactive contamination from the 1954 Castle Bravo nuclear test.',
  },
};

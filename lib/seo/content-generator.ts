import { Port } from '@/lib/ports';
import { getEventosDia, MareEvento } from '@/lib/mare';
import { getMoonPhase } from '@/lib/tideUtils';
import { calcCoef } from '@/lib/monthlyTideCalc';
import { SeaConditionsSummary } from '@/lib/seo/sea-conditions';
import {
  getPeriodosSolunares,
  getIdadeLua,
  getAvaliacaoSolunar,
  inicioDiaLocal,
  type AvaliacaoSolunar,
  type PeriodoSolunar,
} from '@/lib/solunar';

export interface SEOContent {
  text: string;
  faq: { question: string; answer: string }[];
}

/**
 * Classifica a força da maré em 3 faixas usando o coeficiente real (20–120).
 * < 45  → morta  (maré de quadratura fraca)
 * 45–70 → intermediária (sem adjetivo forte)
 * > 70  → viva   (maré de sizígia)
 */
export function classifyTideStrength(coef: number): 'morta' | 'intermediaria' | 'viva' {
  if (coef < 45) return 'morta';
  if (coef <= 70) return 'intermediaria';
  return 'viva';
}

/** Score de pesca calculado no servidor (ver lib/fishingScore.ts). */
export interface FishingSEO {
  score: number;
  label: string;
}

/**
 * Períodos solunares reais do dia para um porto — fonte única compartilhada
 * entre o texto SSR (aqui) e o score de pesca (page.tsx / lib/fishingScore.ts),
 * para os dois nunca divergirem do motor do SolunarTable.
 */
export function getSolunarPeriodos(port: Port, date: string): PeriodoSolunar[] {
  return getPeriodosSolunares(inicioDiaLocal(date), port.lat, port.lon);
}

// CHANGED: aceita `sea` opcional (resumo de ondas/vento buscado no servidor).
// Quando ausente (ex.: falha na API externa), cai para o texto genérico
// antigo — nunca quebra a página por causa disso.
export function generateSEOContent(port: Port, date: string, sea?: SeaConditionsSummary | null, fishing?: FishingSEO | null): SEOContent {
  const eventos: MareEvento[] = getEventosDia(port, date);
  const dateObj = new Date(`${date}T12:00:00Z`);

  const season = getSeason(dateObj);
  const moonPhaseName = getMoonPhase(dateObj).name;

  const amplitude = getAmplitude(eventos);
  const coef = calcCoef(eventos) ?? Math.round(amplitude * 55);
  const tideClass = classifyTideStrength(coef);

  // Mesmo motor solunar do SolunarTable (client-side), calculado aqui no
  // servidor para o "dia atual" — assim a nota em ★ sai no HTML/FAQ (SSR),
  // não só depois da hidratação. Usa offset -180 (BRT) por padrão, igual
  // ao resto do site (SolunarTable também assume BRT hoje).
  const inicioDia = inicioDiaLocal(date);
  const periodos = getSolunarPeriodos(port, date);
  const idadeLua = getIdadeLua(inicioDia);
  const solunar = getAvaliacaoSolunar(idadeLua, periodos, eventos);

  const text = generateSpintaxText(port, date, eventos, season, moonPhaseName, amplitude, tideClass, sea, solunar, fishing);
  const faq = generateFAQ(port, date, eventos, moonPhaseName, tideClass, sea, solunar, fishing);

  return { text, faq };
}

function getSeason(date: Date) {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Outono';
  if (month >= 6 && month <= 8) return 'Inverno';
  if (month >= 9 && month <= 11) return 'Primavera';
  return 'Verão';
}

function getAmplitude(eventos: MareEvento[]) {
  if (eventos.length < 2) return 1.0;
  let max = -999;
  let min = 999;
  for (const ev of eventos) {
    if (ev.altura_m > max) max = ev.altura_m;
    if (ev.altura_m < min) min = ev.altura_m;
  }
  return max - min;
}

function generateSpintaxText(
  port: Port,
  date: string,
  eventos: MareEvento[],
  season: string,
  moonPhase: string,
  amplitude: number,
  tideClass: 'morta' | 'intermediaria' | 'viva',
  sea?: SeaConditionsSummary | null,
  solunar?: AvaliacaoSolunar,
  fishing?: FishingSEO | null
) {
  const isCommercial = port.name.toLowerCase().includes('porto') || port.name.toLowerCase().includes('terminal');

  const highTides = eventos.filter(e => e.tipo === 'high');
  const lowTides = eventos.filter(e => e.tipo === 'low');

  const highStr = highTides.map(t => `${t.hora} (${t.altura_m.toFixed(2).replace('.', ',')}m)`).join(' e ');
  const lowStr = lowTides.map(t => `${t.hora} (${t.altura_m.toFixed(2).replace('.', ',')}m)`).join(' e ');

  const highInfo = highTides.length > 0
    ? `As marés altas do dia estão previstas para ${highStr}.`
    : '';
  const lowInfo = lowTides.length > 0
    ? `Já as marés baixas ocorrem às ${lowStr}.`
    : '';

  // Frase de ondas/vento usa números reais quando `sea` está disponível.
  const seaInfo = sea
    ? `As ondas hoje variam entre ${sea.waveMin}m e ${sea.waveMax}m, com período de ${sea.wavePeriod}s vindo de ${sea.waveDirectionCardinal}. O vento sopra de ${sea.windDirectionCardinal} entre ${sea.windMin} e ${sea.windMax} km/h, com rajadas de até ${sea.windGustMax} km/h.`
    : 'As ondas e os ventos na região costeira podem sofrer leves alterações dependendo do horário.';

  // Nota solunar real (mesmo motor do SolunarTable) exposta no HTML/SSR
  const solunarInfo = solunar
    ? ` A qualidade solunar de hoje para pesca é ${solunar.estrelas}/5${solunar.destaque ? ', com um período maior coincidindo com a maré cheia — janela especialmente favorável' : ''}.`
    : '';

  const fishingInfo = fishing
    ? ` A atividade de pesca hoje está avaliada em ${fishing.score}/10 (${fishing.label}).`
    : '';

  const moonText = moonPhase.toLowerCase().startsWith('lua ') ? moonPhase : `lua ${moonPhase}`;

  // Descrição da força da maré em 3 faixas (coeficiente real, não amplitude estimada)
  const tideStrengthCommercial =
    tideClass === 'viva'
      ? 'indicando marés vivas (sizígia) que exigem atenção nas manobras portuárias.'
      : tideClass === 'morta'
        ? 'caracterizando marés de quadratura fraca, com variações suaves no calado dinâmico.'
        : 'com marés de intensidade intermediária, dentro da faixa habitual para a região.';

  const tideStrengthBeach =
    tideClass === 'viva'
      ? 'Com a maré viva, o mar recua bastante na baixamar, excelente para pesca na beira e encontrar piscinas naturais.'
      : tideClass === 'morta'
        ? 'Com maré fraca (quadratura), a variação é menor, proporcionando águas mais estáveis para banhistas e navegação leve.'
        : 'A maré está em intensidade intermediária — variação moderada, condições equilibradas para banho e navegação.';

  let baseText = '';

  if (isCommercial) {
    baseText = `As condições de maré em ${port.name}, ${port.state} para a data atual apresentam uma amplitude de ${amplitude.toFixed(2)}m sob a influência da ${moonText}. ${highInfo} ${lowInfo} Este cenário de ${season} é característico da região, ${tideStrengthCommercial} ${seaInfo}${solunarInfo}${fishingInfo}`;
  } else {
    baseText = `Confira as condições para a praia de ${port.name} (${port.state}) durante ${season === 'Primavera' ? 'a' : 'o'} ${season.toLowerCase()}. Hoje, com a ${moonText}, a amplitude da maré é de ${amplitude.toFixed(2)} metros. ${highInfo} ${lowInfo} ${tideStrengthBeach} ${seaInfo}${solunarInfo}${fishingInfo}`;
  }

  return baseText;
}

// CHANGED: novo parâmetro `sea` opcional no final, adiciona uma 5ª
// pergunta ao FAQ (JSON-LD) só quando os dados de mar estão disponíveis.
function generateFAQ(
  port: Port,
  date: string,
  eventos: MareEvento[],
  moonPhase: string,
  tideClass: 'morta' | 'intermediaria' | 'viva',
  sea?: SeaConditionsSummary | null,
  solunar?: AvaliacaoSolunar,
  fishing?: FishingSEO | null
) {
  const faq = [];
  const highTides = eventos.filter(e => e.tipo === 'high');
  const lowTides = eventos.filter(e => e.tipo === 'low');

  // Q1
  if (highTides.length > 0) {
    faq.push({
      question: `Qual o horário da maré alta em ${port.name} hoje?`,
      answer: `Os picos de maré alta (preamar) estão previstos para ${highTides.map(t => `${t.hora} (${t.altura_m}m)`).join(' e ')}.`
    });
  }

  // Q2
  if (lowTides.length > 0) {
    faq.push({
      question: `Que horas a maré enche ou seca em ${port.cityName}?`,
      answer: `A maré atinge o seu nível mais baixo às ${lowTides.map(t => `${t.hora} (${t.altura_m}m)`).join(' e ')}.`
    });
  }

  // Q3 — 3 faixas: viva / intermediária / morta
  const solunarSufixo = solunar
    ? ` A tábua solunar de hoje marca ${solunar.estrelas}/5 estrelas${solunar.destaque ? ', com um período maior batendo com a maré cheia — vale priorizar essa janela' : ''}.`
    : '';

  const fishingTideNote =
    tideClass === 'viva'
      ? 'As marés vivas (sizígia) aumentam a movimentação das correntes e costumam ativar a alimentação dos peixes.'
      : tideClass === 'morta'
        ? 'As marés fracas (quadratura) têm pouca correnteza — melhor para pesca de fundo e em locais de maior calado.'
        : 'Com maré de intensidade intermediária, as correntes são moderadas — condições equilibradas para pesca.';

  const fishingTideGeneric =
    tideClass === 'viva'
      ? 'Sim! A maré viva (sizígia) aumenta a movimentação das correntes e dos nutrientes, o que costuma ativar a alimentação dos peixes.'
      : tideClass === 'morta'
        ? 'A maré fraca (quadratura) apresenta pouca correnteza. É ideal para pesca de fundo ou em locais de maior calado, embora os peixes possam estar menos ativos.'
        : 'A maré está em intensidade intermediária. As correntes são moderadas — verifique também os períodos solunares para escolher a melhor janela.';

  faq.push({
    question: `A maré está boa para pesca em ${port.cityName}?`,
    answer: fishing
      ? `Hoje a atividade de pesca está avaliada em ${fishing.score}/10 (${fishing.label}), considerando maré, lua e condições do mar. ${fishingTideNote}${solunarSufixo}`
      : fishingTideGeneric + solunarSufixo
  });

  // Q4 — evita duplicar "lua" quando moonPhase já começa com "Lua "
  // ex.: "Lua Minguante" → "Como a Lua Minguante influencia..." (não "Como a lua Lua Minguante")
  const moonPhaseName = moonPhase.match(/^(Lua |Quarto |Gibosa )/i) ? moonPhase : `Lua ${moonPhase}`;
  // Para o corpo da resposta, usa a fase sem prefixo de artigo
  const moonPhaseShort = moonPhaseName.replace(/^Lua /i, '');

  faq.push({
    question: `Como a ${moonPhaseName} influencia a maré em ${port.state}?`,
    answer: (moonPhaseShort === 'Cheia' || moonPhaseShort === 'Nova')
      ? `A fase ${moonPhaseShort} alinha o Sol e a Terra, criando uma atração gravitacional muito forte. Isso causa as famosas marés vivas (ou de sizígia), resultando em marés muito altas e baixas bem secas.`
      : `Na fase ${moonPhaseShort}, o sol e a lua formam um ângulo reto. Isso distribui a atração gravitacional e cria marés de quadratura, com menor variação de nível.`
  });

  // Q5 (NOVA) — só entra se tivermos dados reais de onda/vento.
  if (sea) {
    faq.push({
      question: `Como estão as ondas e o vento em ${port.cityName} hoje?`,
      answer: `As ondas variam entre ${sea.waveMin}m e ${sea.waveMax}m, com período de ${sea.wavePeriod}s vindo de ${sea.waveDirectionCardinal}. O vento é de ${sea.windDirectionCardinal}, entre ${sea.windMin} e ${sea.windMax} km/h, com rajadas de até ${sea.windGustMax} km/h.`
    });
  }

  return faq;
}

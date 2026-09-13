import { Port } from '@/lib/ports';
import { getEventosDia, MareDia, MareEvento } from '@/lib/mare';
import { getMoonAge, getMoonPhase } from '@/lib/tideUtils';
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
  const isViva = amplitude > 2.0; // Simplification

  // Horário atual no fuso de São Paulo, para saber quais marés já passaram.
  const nowMinutes = getNowMinutesBR(date);

  // Mesmo motor solunar do SolunarTable (client-side), calculado aqui no
  // servidor para o "dia atual" — assim a nota em ★ sai no HTML/FAQ (SSR),
  // não só depois da hidratação. Usa offset -180 (BRT) por padrão, igual
  // ao resto do site (SolunarTable também assume BRT hoje).
  const inicioDia = inicioDiaLocal(date);
  const periodos = getSolunarPeriodos(port, date);
  const idadeLua = getIdadeLua(inicioDia);
  const solunar = getAvaliacaoSolunar(idadeLua, periodos, eventos);

  const text = generateSpintaxText(port, date, eventos, season, moonPhaseName, amplitude, isViva, nowMinutes, sea, solunar, fishing);
  const faq = generateFAQ(port, date, eventos, moonPhaseName, isViva, sea, solunar, fishing);

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

/**
 * Minutos desde 00:00 no horário de São Paulo, para a data informada.
 * Se `date` não for hoje (ex: página gerada estaticamente com antecedência),
 * cai para 0 e o texto usa a primeira maré do dia normalmente.
 */
function getNowMinutesBR(date: string): number {
  const todayBR = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  if (todayBR !== date) return -1; // data não é "hoje": não filtra por horário atual

  const timeStr = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function timeToMin(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Retorna a próxima maré (do tipo pedido) a partir do horário atual.
 * Se todas já passaram (ou não sabemos o horário atual), cai para a primeira do dia.
 */
function proximoEvento(eventos: MareEvento[], nowMinutes: number): MareEvento | undefined {
  if (nowMinutes >= 0) {
    const proximo = eventos.find(e => timeToMin(e.hora) > nowMinutes);
    if (proximo) return proximo;
  }
  return eventos[0];
}

// CHANGED: novo parâmetro `sea` opcional no final da assinatura.
function generateSpintaxText(
  port: Port,
  date: string,
  eventos: MareEvento[],
  season: string,
  moonPhase: string,
  amplitude: number,
  isViva: boolean,
  nowMinutes: number,
  sea?: SeaConditionsSummary | null,
  solunar?: AvaliacaoSolunar,
  fishing?: FishingSEO | null
) {
  const isCommercial = port.name.toLowerCase().includes('porto') || port.name.toLowerCase().includes('terminal');

  const highTides = eventos.filter(e => e.tipo === 'high');
  const lowTides = eventos.filter(e => e.tipo === 'low');

  const nextHigh = proximoEvento(highTides, nowMinutes);
  const nextLow = proximoEvento(lowTides, nowMinutes);

  const highInfo = nextHigh ? `A próxima maré alta ocorre às ${nextHigh.hora} com ${nextHigh.altura_m}m.` : '';
  const lowInfo = nextLow ? `Já a próxima maré baixa é registrada às ${nextLow.hora} atingindo ${nextLow.altura_m}m.` : '';

  // CHANGED: frase de ondas/vento agora usa números reais quando `sea`
  // está disponível. Mantém a frase genérica antiga como fallback.
  const seaInfo = sea
    ? `As ondas hoje variam entre ${sea.waveMin}m e ${sea.waveMax}m, com período de ${sea.wavePeriod}s vindo de ${sea.waveDirectionCardinal}. O vento sopra de ${sea.windDirectionCardinal} entre ${sea.windMin} e ${sea.windMax} km/h, com rajadas de até ${sea.windGustMax} km/h.`
    : 'As ondas e os ventos na região costeira podem sofrer leves alterações dependendo do horário.';

  // NOVO: nota solunar real (mesmo motor do SolunarTable) exposta no HTML/SSR,
  // não só no client depois da hidratação.
  const solunarInfo = solunar
    ? ` A qualidade solunar de hoje para pesca é ${solunar.estrelas}/5${solunar.destaque ? ', com um período maior coincidindo com a maré cheia — janela especialmente favorável' : ''}.`
    : '';

  const fishingInfo = fishing
    ? ` A atividade de pesca hoje está avaliada em ${fishing.score}/10 (${fishing.label}).`
    : '';

  let baseText = '';

  if (isCommercial) {
    baseText = `As condições de maré em ${port.name}, ${port.state} para a data atual apresentam uma amplitude de ${amplitude.toFixed(2)}m sob a influência da lua ${moonPhase}. ${highInfo} ${lowInfo} Este cenário de ${season} é característico da região, ${isViva ? 'indicando marés vivas (sizígia) que exigem atenção nas manobras portuárias.' : 'caracterizando marés de quadratura, com variações mais suaves no calado dinâmico.'} ${seaInfo}${solunarInfo}${fishingInfo}`;
  } else {
    baseText = `Confira as condições para a praia de ${port.name} (${port.state}) durante o ${season}. Hoje, com a lua ${moonPhase}, a amplitude da maré é de ${amplitude.toFixed(2)} metros. ${highInfo} ${lowInfo} ${isViva ? 'Com a maré viva, o mar recua bastante na baixamar, excelente para pesca na beira e encontrar piscinas naturais.' : 'Sendo maré morta, a variação é menor, proporcionando águas mais estáveis para banhistas e navegação leve.'} ${seaInfo}${solunarInfo}${fishingInfo}`;
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
  isViva: boolean,
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

  // Q3
  const solunarSufixo = solunar
    ? ` A tábua solunar de hoje marca ${solunar.estrelas}/5 estrelas${solunar.destaque ? ', com um período maior batendo com a maré cheia — vale priorizar essa janela' : ''}.`
    : '';
  faq.push({
    question: `A maré está boa para pesca em ${port.cityName}?`,
    answer: fishing
      ? `Hoje a atividade de pesca está avaliada em ${fishing.score}/10 (${fishing.label}), considerando maré, lua e condições do mar. ${isViva ? 'As marés vivas (sizígia) aumentam a movimentação das correntes e costumam ativar a alimentação dos peixes.' : 'As marés de quadratura (mortas) têm pouca correnteza — melhor para pesca de fundo e em locais de maior calado.'}${solunarSufixo}`
      : (isViva
        ? 'Sim! A atual maré viva (sizígia) aumenta a movimentação das correntes e dos nutrientes, o que costuma ativar a alimentação dos peixes.'
        : 'A maré de quadratura (morta) apresenta pouca correnteza. É ideal para pesca de fundo ou em locais de maior calado, embora os peixes possam estar menos ativos.'
      ) + solunarSufixo
  });

  // Q4
  faq.push({
    question: `Como a lua ${moonPhase} influencia a maré em ${port.state}?`,
    answer: (moonPhase === 'Cheia' || moonPhase === 'Nova')
      ? `A fase ${moonPhase} alinha o Sol e a Terra, criando uma atração gravitacional muito forte. Isso causa as famosas marés vivas (ou de sizígia), resultando em marés muito altas e baixas bem secas.`
      : `Na fase ${moonPhase}, o sol e a lua formam um ângulo reto. Isso distribui a atração gravitacional e cria marés de quadratura (mortas), com menor variação de nível.`
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
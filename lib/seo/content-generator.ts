import { Port } from '@/lib/ports';
import { getEventosDia, MareDia, MareEvento } from '@/lib/mare';
import { getMoonAge, getMoonPhase } from '@/lib/tideUtils';

export interface SEOContent {
  text: string;
  faq: { question: string; answer: string }[];
}

export function generateSEOContent(port: Port, date: string): SEOContent {
  const eventos: MareEvento[] = getEventosDia(port, date);
  const dateObj = new Date(`${date}T12:00:00Z`);

  const season = getSeason(dateObj);
  const moonPhaseName = getMoonPhase(dateObj).name;

  const amplitude = getAmplitude(eventos);
  const isViva = amplitude > 2.0; // Simplification

  // Horário atual no fuso de São Paulo, para saber quais marés já passaram.
  const nowMinutes = getNowMinutesBR(date);

  const text = generateSpintaxText(port, date, eventos, season, moonPhaseName, amplitude, isViva, nowMinutes);
  const faq = generateFAQ(port, date, eventos, moonPhaseName, isViva);

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

function generateSpintaxText(
  port: Port,
  date: string,
  eventos: MareEvento[],
  season: string,
  moonPhase: string,
  amplitude: number,
  isViva: boolean,
  nowMinutes: number
) {
  const isCommercial = port.name.toLowerCase().includes('porto') || port.name.toLowerCase().includes('terminal');

  const highTides = eventos.filter(e => e.tipo === 'high');
  const lowTides = eventos.filter(e => e.tipo === 'low');

  const nextHigh = proximoEvento(highTides, nowMinutes);
  const nextLow = proximoEvento(lowTides, nowMinutes);

  const highInfo = nextHigh ? `A próxima maré alta ocorre às ${nextHigh.hora} com ${nextHigh.altura_m}m.` : '';
  const lowInfo = nextLow ? `Já a próxima maré baixa é registrada às ${nextLow.hora} atingindo ${nextLow.altura_m}m.` : '';

  let baseText = '';

  if (isCommercial) {
    baseText = `As condições de maré em ${port.name}, ${port.state} para a data atual apresentam uma amplitude de ${amplitude.toFixed(2)}m sob a influência da lua ${moonPhase}. ${highInfo} ${lowInfo} Este cenário de ${season} é característico da região, ${isViva ? 'indicando marés vivas (sizígia) que exigem atenção nas manobras portuárias.' : 'caracterizando marés de quadratura, com variações mais suaves no calado dinâmico.'}`;
  } else {
    baseText = `Confira as condições para a praia de ${port.name} (${port.state}) durante o ${season}. Hoje, com a lua ${moonPhase}, a amplitude da maré é de ${amplitude.toFixed(2)} metros. ${highInfo} ${lowInfo} ${isViva ? 'Com a maré viva, o mar recua bastante na baixamar, excelente para pesca na beira e encontrar piscinas naturais.' : 'Sendo maré morta, a variação é menor, proporcionando águas mais estáveis para banhistas e navegação leve.'} As ondas e os ventos na região costeira podem sofrer leves alterações dependendo do horário.`;
  }

  return baseText;
}

function generateFAQ(
  port: Port,
  date: string,
  eventos: MareEvento[],
  moonPhase: string,
  isViva: boolean
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
  faq.push({
    question: `A maré está boa para pesca em ${port.cityName}?`,
    answer: isViva
      ? 'Sim! A atual maré viva (sizígia) aumenta a movimentação das correntes e dos nutrientes, o que costuma ativar a alimentação dos peixes.'
      : 'A maré de quadratura (morta) apresenta pouca correnteza. É ideal para pesca de fundo ou em locais de maior calado, embora os peixes possam estar menos ativos.'
  });

  // Q4
  faq.push({
    question: `Como a lua ${moonPhase} influencia a maré em ${port.state}?`,
    answer: (moonPhase === 'Cheia' || moonPhase === 'Nova')
      ? `A fase ${moonPhase} alinha o Sol e a Terra, criando uma atração gravitacional muito forte. Isso causa as famosas marés vivas (ou de sizígia), resultando em marés muito altas e baixas bem secas.`
      : `Na fase ${moonPhase}, o sol e a lua formam um ângulo reto. Isso distribui a atração gravitacional e cria marés de quadratura (mortas), com menor variação de nível.`
  });

  return faq;
}

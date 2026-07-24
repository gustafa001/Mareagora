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
  const text = generateSpintaxText(port, date, eventos, season, moonPhaseName, amplitude, isViva);
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

function generateSpintaxText(
  port: Port, 
  date: string, 
  eventos: MareEvento[], 
  season: string, 
  moonPhase: string,
  amplitude: number,
  isViva: boolean
) {
  const isCommercial = port.name.toLowerCase().includes('porto') || port.name.toLowerCase().includes('terminal');
  
  const highTides = eventos.filter(e => e.tipo === 'high');
  const lowTides = eventos.filter(e => e.tipo === 'low');
  
  const highInfo = highTides.length > 0 ? `A primeira maré alta ocorre às ${highTides[0].hora} com ${highTides[0].altura_m}m.` : '';
  const lowInfo = lowTides.length > 0 ? `Já a maré baixa principal é registrada às ${lowTides[0].hora} atingindo ${lowTides[0].altura_m}m.` : '';
  
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

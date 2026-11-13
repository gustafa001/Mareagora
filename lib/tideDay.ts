/**
 * MaréAgora — Página por dia (/mare/[estado]/[porto]/[AAAA-MM-DD])
 *
 * Camada de dados + textos da página de um único dia. Só REAPROVEITA o que já
 * existe (getEventosDia, pickBestFour, calcCoef, getSunTimes): nenhum cálculo
 * novo de maré, para a página por dia nunca divergir da tábua mensal.
 */

import { addDaysBR, getTodayBR, parseDateBR } from './dateBR';
import { getEventosDia } from './mare';
import {
  calcCoef,
  getSunTimes,
  isAlta,
  pickBestFour,
  type MareResumo,
} from './monthlyTideCalc';
import type { Port } from './ports';

/** Janela de datas atendidas: de hoje até hoje + N dias (BRT). */
export const DAY_PAGE_WINDOW_DAYS = 30;

/**
 * Portos cujas páginas por dia podem ser indexadas pelo Google.
 * COMEÇA VAZIO de propósito: todas as páginas saem com noindex até a gente
 * liberar os portos principais (Passo 5 do plano). Para liberar, adicione o
 * slug do porto (ex.: 'porto-de-santos') e faça deploy.
 */
export const DAY_PAGE_INDEXABLE_SLUGS: ReadonlySet<string> = new Set<string>([]);

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

/** true se a string é uma data real (YYYY-MM-DD, sem 31/02 etc.). */
export function isValidISODate(data: string): boolean {
  if (!DATE_FORMAT.test(data)) return false;
  try {
    return addDaysBR(data, 0) === data;
  } catch {
    return false;
  }
}

/** true se a data é válida e está entre hoje e hoje + DAY_PAGE_WINDOW_DAYS. */
export function isDayInWindow(data: string, hoje: string = getTodayBR()): boolean {
  if (!isValidISODate(data)) return false;
  return data >= hoje && data <= addDaysBR(hoje, DAY_PAGE_WINDOW_DAYS);
}

export interface DiaMare {
  data: string; // YYYY-MM-DD
  dataBR: string; // DD/MM/YYYY
  diaSemana: string; // "sábado"
  mares: MareResumo[]; // até 4, em ordem de horário
  coef: number | null;
  amplitude: number; // m
  sunrise: string;
  sunset: string;
  anterior: string | null; // dia anterior dentro da janela (ou null)
  proximo: string | null; // dia seguinte dentro da janela (ou null)
}

export function formatDataBR(data: string): string {
  return data.split('-').reverse().join('/');
}

export function formatDiaSemana(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(parseDateBR(data));
}

function fmtAltura(m: number): string {
  return m.toFixed(2).replace('.', ',');
}

/**
 * Dados do dia para um porto. Retorna null quando a data é inválida, está fora
 * da janela ou o porto não tem marés naquele dia — a rota responde 404 nesses
 * casos (nunca renderiza página vazia).
 */
export function getDiaMare(
  port: Port,
  data: string,
  hoje: string = getTodayBR()
): DiaMare | null {
  if (!isDayInWindow(data, hoje)) return null;

  const eventos = getEventosDia(port, data);
  if (eventos.length === 0) return null;

  const brutas = pickBestFour(eventos.map(e => ({ hora: e.hora, altura_m: e.altura_m })));
  if (brutas.length === 0) return null;

  const mares: MareResumo[] = brutas.map((t, i) => ({
    hora: t.hora,
    altura_m: t.altura_m,
    alta: isAlta(t, i, brutas),
  }));

  const alturas = mares.map(m => m.altura_m);
  const amplitude = Math.max(...alturas) - Math.min(...alturas);

  const [y, m, d] = data.split('-').map(Number);
  const { sunrise, sunset } = getSunTimes(y, m, d, port.lat, port.lon);

  const ontem = addDaysBR(data, -1);
  const amanha = addDaysBR(data, 1);

  return {
    data,
    dataBR: formatDataBR(data),
    diaSemana: formatDiaSemana(data),
    mares,
    coef: calcCoef(brutas),
    amplitude,
    sunrise,
    sunset,
    anterior: isDayInWindow(ontem, hoje) ? ontem : null,
    proximo: isDayInWindow(amanha, hoje) ? amanha : null,
  };
}

/** Classificação da força da maré pelo coeficiente (mesmas faixas de content-generator). */
export function forcaDaMare(coef: number): 'morta' | 'intermediária' | 'viva' {
  if (coef < 45) return 'morta';
  if (coef <= 70) return 'intermediária';
  return 'viva';
}

function listar(partes: string[]): string {
  if (partes.length <= 1) return partes.join('');
  return `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]}`;
}

/** Resumo em texto que responde direto a busca ("maré santos 14 de novembro"). */
export function buildDiaResumo(seoName: string, uf: string, dia: DiaMare, faseLua: string): string {
  const altas = dia.mares.filter(m => m.alta).map(m => `${m.hora} (${fmtAltura(m.altura_m)} m)`);
  const baixas = dia.mares.filter(m => !m.alta).map(m => `${m.hora} (${fmtAltura(m.altura_m)} m)`);

  const partes: string[] = [];
  if (altas.length) partes.push(`preamar (maré alta) às ${listar(altas)}`);
  if (baixas.length) partes.push(`baixamar (maré baixa) às ${listar(baixas)}`);

  const coefTxt = dia.coef !== null
    ? ` Coeficiente ${dia.coef}, maré ${forcaDaMare(dia.coef)}.`
    : '';

  const cap = dia.diaSemana.charAt(0).toUpperCase() + dia.diaSemana.slice(1);
  return `${cap}, ${dia.dataBR}, em ${seoName} (${uf}): ${partes.join('; ')}.${coefTxt} Amplitude de ${fmtAltura(dia.amplitude)} m e ${faseLua}.`;
}

/** Descrição curta p/ meta description: abre com os horários (dado concreto aumenta o CTR). */
export function buildDiaMetaDescription(seoName: string, uf: string, dia: DiaMare): string {
  // 1 casa decimal, igual ao buildTideSnippet da página do porto.
  const fmt1 = (m: MareResumo) => `${m.hora} (${m.altura_m.toFixed(1).replace('.', ',')} m)`;
  const altas = dia.mares.filter(m => m.alta).map(fmt1);
  const baixas = dia.mares.filter(m => !m.alta).map(fmt1);
  const partes: string[] = [];
  if (altas.length) partes.push(`maré alta ${altas.join(', ')}`);
  if (baixas.length) partes.push(`baixa ${baixas.join(', ')}`);
  const base = `Maré em ${seoName} (${uf}) em ${dia.dataBR}: ${partes.join('; ')}. Coeficiente, sol, lua e melhor horário de pesca.`;
  return base.length <= 200 ? base : `${base.slice(0, 197).trimEnd()}…`;
}

/** FAQ com os dados do dia (vira texto visível e JSON-LD FAQPage). */
export function buildDiaFaq(
  seoName: string,
  dia: DiaMare
): { question: string; answer: string }[] {
  const altas = dia.mares.filter(m => m.alta);
  const baixas = dia.mares.filter(m => !m.alta);
  const fmt = (m: MareResumo) => `${m.hora} (${fmtAltura(m.altura_m)} m)`;

  const faq: { question: string; answer: string }[] = [];

  if (altas.length) {
    faq.push({
      question: `Que horas é a maré alta em ${seoName} em ${dia.dataBR}?`,
      answer: `Em ${seoName}, em ${dia.dataBR} (${dia.diaSemana}), a maré alta (preamar) acontece às ${listar(altas.map(fmt))}, horário de Brasília.`,
    });
  }
  if (baixas.length) {
    faq.push({
      question: `Que horas é a maré baixa em ${seoName} em ${dia.dataBR}?`,
      answer: `Em ${seoName}, em ${dia.dataBR} (${dia.diaSemana}), a maré baixa (baixamar) acontece às ${listar(baixas.map(fmt))}, horário de Brasília.`,
    });
  }
  if (dia.coef !== null) {
    faq.push({
      question: `Como estará a maré em ${seoName} no ${dia.diaSemana}, ${dia.dataBR}?`,
      answer: `O coeficiente de maré previsto é ${dia.coef}, o que indica maré ${forcaDaMare(dia.coef)}, com amplitude de ${fmtAltura(dia.amplitude)} m entre a maior e a menor altura do dia.`,
    });
  }
  return faq;
}

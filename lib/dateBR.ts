/**
 * Utilitários de data no fuso de Brasília (America/Sao_Paulo).
 *
 * O servidor (Vercel) roda em UTC. Usar `new Date()` direto faz o "hoje"
 * virar o dia seguinte depois das 21h de Brasília. Estas funções mantêm
 * todas as páginas alinhadas ao calendário brasileiro.
 */

const TZ_BR = 'America/Sao_Paulo';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function parseISODate(date: string): { year: number; month: number; day: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    throw new Error(`Data inválida (esperado YYYY-MM-DD): ${date}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Rejeita datas impossíveis (ex.: 2026-02-31).
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new Error(`Data inválida: ${date}`);
  }

  return { year, month, day };
}

/** Retorna a data de hoje em America/Sao_Paulo no formato YYYY-MM-DD. */
export function getTodayBR(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ_BR,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${get('year')}-${get('month')}-${get('day')}`;
}

/**
 * Soma (ou subtrai) dias a uma data YYYY-MM-DD.
 * Usa aritmética em UTC — nunca `setDate` em um Date local/UTC.
 */
export function addDaysBR(date: string, days: number): string {
  const { year, month, day } = parseISODate(date);
  const shifted = new Date(Date.UTC(year, month - 1, day) + days * MS_PER_DAY);

  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(
    shifted.getUTCDate(),
  )}`;
}

/**
 * Converte uma data YYYY-MM-DD em Date fixo ao meio-dia UTC.
 * Nesse horário o dia civil é o mesmo em America/Sao_Paulo (UTC-3),
 * então formatações com `timeZone: 'America/Sao_Paulo'` não escorregam.
 */
export function parseDateBR(date: string): Date {
  const { year, month, day } = parseISODate(date);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

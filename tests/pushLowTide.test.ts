import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { PORTS } from '../lib/ports';
import { getEventosDia } from '../lib/mare';
import { findIncomingLowTide, formatLead, LEAD_MINUTES } from '../lib/pushLowTide';

// lib/mare.ts carrega data/mare/*.json com `require()`, que o Next/webpack provê
// mas o ESM puro do tsx não. Disponibiliza um require relativo a lib/mare.ts
// (a chamada só acontece em runtime, depois dos imports).
(globalThis as { require?: NodeRequire }).require = createRequire(
  new URL('../lib/mare.ts', import.meta.url),
);

const port = PORTS.find((p) => p.slug === 'porto-de-santos') ?? PORTS[0];

/** Instante real que corresponde a um horário de Brasília (UTC-3, sem horário de verão). */
function brt(dt: string): Date {
  return new Date(`${dt.slice(0, 16)}:00-03:00`);
}

function minus(date: Date, minutes: number): Date {
  return new Date(date.getTime() - minutes * 60_000);
}

/** Procura uma maré baixa em algum dia de 2026 que satisfaça o filtro de hora. */
function findLow(hourFilter: (h: number) => boolean) {
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= 28; d++) {
      const day = `2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const low = getEventosDia(port, day).find(
        (e) => e.tipo === 'low' && hourFilter(Number(e.hora.slice(0, 2))),
      );
      if (low) return low;
    }
  }
  throw new Error('nenhuma maré baixa encontrada para o teste');
}

test('avisa quando a maré baixa está dentro da janela', () => {
  const low = findLow((h) => h >= 8 && h <= 20);
  const found = findIncomingLowTide(port, minus(brt(low.dt_iso), 90));
  assert.ok(found, 'deveria achar a maré baixa');
  assert.equal(found.hora, low.hora);
  assert.equal(found.minutesAhead, 90);
  assert.equal(found.key, `${port.slug}|${low.dt_iso.slice(0, 16)}`);
});

test('não avisa antes da janela nem depois que a maré passou', () => {
  const low = findLow((h) => h >= 8 && h <= 20);
  const early = findIncomingLowTide(port, minus(brt(low.dt_iso), LEAD_MINUTES + 30));
  assert.notEqual(early?.key, `${port.slug}|${low.dt_iso.slice(0, 16)}`);

  const late = findIncomingLowTide(port, minus(brt(low.dt_iso), -5));
  assert.notEqual(late?.key, `${port.slug}|${low.dt_iso.slice(0, 16)}`);
});

test('mesma maré gera a mesma chave em execuções seguidas (base do controle de repetição)', () => {
  const low = findLow((h) => h >= 8 && h <= 20);
  const a = findIncomingLowTide(port, minus(brt(low.dt_iso), 100));
  const b = findIncomingLowTide(port, minus(brt(low.dt_iso), 90));
  const c = findIncomingLowTide(port, minus(brt(low.dt_iso), 80));
  assert.ok(a && b && c);
  assert.equal(a.key, b.key);
  assert.equal(b.key, c.key);
});

test('avisa na noite anterior uma maré baixa que cai na madrugada seguinte', () => {
  const low = findLow((h) => h <= 1);
  const found = findIncomingLowTide(port, minus(brt(low.dt_iso), 60));
  assert.ok(found, 'deveria achar a maré baixa da madrugada');
  assert.equal(found.dt_iso.slice(0, 16), low.dt_iso.slice(0, 16));
});

test('mede a antecedência pelo relógio de Brasília, não pelo do servidor', () => {
  const low = findLow((h) => h >= 8 && h <= 20);
  // instante absoluto (ISO em UTC) 45 min antes da maré, em horário de Brasília
  const instant = minus(brt(low.dt_iso), 45);
  const found = findIncomingLowTide(port, new Date(instant.toISOString()));
  assert.ok(found);
  assert.equal(found.minutesAhead, 45);
});

test('formatLead descreve a antecedência em texto curto', () => {
  assert.equal(formatLead(11), 'em 11 min');
  assert.equal(formatLead(60), 'em cerca de 1h');
  assert.equal(formatLead(75), 'em cerca de 1h30');
  assert.equal(formatLead(110), 'em cerca de 2h');
});

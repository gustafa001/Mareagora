/**
 * tests/tideRegimeClassifier.test.ts
 *
 * Testes unitários para classifyTideRegime() com dados sintéticos para os
 * 3 regimes: diurno, semidiurno e misto.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyTideRegime } from '../lib/seo/tideRegimeClassifier';
import type { GlobalTideEvent } from '../lib/globalTide';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Gera uma sequência de eventos para N dias com um padrão fixo por dia */
function makeDays(
  pattern: number[], // alturas dos extremos em um dia (ex: [0.2, 1.8] = baixa, alta)
  days: number = 7,
  startDate = '2026-07-17'
): GlobalTideEvent[] {
  const events: GlobalTideEvent[] = [];
  const base = new Date(startDate + 'T00:00:00Z');

  for (let d = 0; d < days; d++) {
    const dayStart = new Date(base);
    dayStart.setUTCDate(dayStart.getUTCDate() + d);

    // Espaça os eventos igualmente ao longo do dia
    const intervalH = 24 / pattern.length;
    for (let i = 0; i < pattern.length; i++) {
      const t = new Date(dayStart);
      t.setUTCHours(Math.floor(i * intervalH), (i * intervalH % 1) * 60, 0, 0);
      const dt = t.toISOString().slice(0, 16);
      events.push({ dt, height_m: pattern[i] });
    }
  }
  return events;
}

// ── Testes ────────────────────────────────────────────────────────────────────

test('Regime DIURNO: 1 alta + 1 baixa por dia (~2 eventos/dia)', () => {
  // Golfo do México / norte da Austrália: 1 ciclo por dia
  const events = makeDays([0.15, 1.65], 7); // baixa 0.15m, alta 1.65m → amplitude ~1.5m
  const result = classifyTideRegime(events);

  assert.equal(result.regime, 'diurno', `Esperado 'diurno', obtido '${result.regime}'`);
  assert.ok(result.amplitudeMedia > 1.0, `amplitudeMedia deve ser > 1.0m (obtido: ${result.amplitudeMedia})`);
  assert.ok(result.amplitudeMax >= result.amplitudeMedia, 'amplitudeMax >= amplitudeMedia');
});

test('Regime SEMIDIURNO: 2 altas + 2 baixas parecidas por dia (~4 eventos/dia)', () => {
  // Atlântico europeu: 2 ciclos simétricos por dia
  // Padrão: baixa → alta → baixa → alta (amplitudes semelhantes ~2m cada)
  const events = makeDays([0.3, 2.3, 0.4, 2.2], 7);
  const result = classifyTideRegime(events);

  assert.equal(result.regime, 'semidiurno', `Esperado 'semidiurno', obtido '${result.regime}'`);
  assert.ok(result.amplitudeMedia > 1.5, `amplitudeMedia deve ser > 1.5m (obtido: ${result.amplitudeMedia})`);
  assert.ok(result.amplitudeMax >= result.amplitudeMedia, 'amplitudeMax >= amplitudeMedia');
});

test('Regime MISTO: 4 extremos/dia mas com grande desigualdade diurna', () => {
  // Pacífico norte: 2 ciclos por dia mas a alta das 07h é muito maior que a das 19h
  // Padrão: baixa → alta grande → baixa → alta pequena
  const events = makeDays([0.1, 2.8, 0.6, 1.0], 7);
  const result = classifyTideRegime(events);

  assert.equal(result.regime, 'misto', `Esperado 'misto', obtido '${result.regime}'`);
  assert.ok(result.amplitudeMax > result.amplitudeMedia, 'amplitudeMax > amplitudeMedia no misto');
});

test('Regime MISTO: contagem de extremos varia entre dias (inconsistente)', () => {
  // Simula dias com 2 e 4 eventos alternados (transição diurno ↔ semidiurno)
  const base = new Date('2026-07-17T00:00:00Z');
  const events: GlobalTideEvent[] = [];

  for (let d = 0; d < 7; d++) {
    const dayStart = new Date(base);
    dayStart.setUTCDate(dayStart.getUTCDate() + d);

    if (d % 2 === 0) {
      // Dias pares: 4 extremos (semidiurno)
      events.push(
        { dt: new Date(dayStart.getTime() + 0 * 3600000).toISOString().slice(0, 16), height_m: 0.3 },
        { dt: new Date(dayStart.getTime() + 6 * 3600000).toISOString().slice(0, 16), height_m: 2.2 },
        { dt: new Date(dayStart.getTime() + 12 * 3600000).toISOString().slice(0, 16), height_m: 0.4 },
        { dt: new Date(dayStart.getTime() + 18 * 3600000).toISOString().slice(0, 16), height_m: 2.1 },
      );
    } else {
      // Dias ímpares: 2 extremos (diurno)
      events.push(
        { dt: new Date(dayStart.getTime() + 0 * 3600000).toISOString().slice(0, 16), height_m: 0.2 },
        { dt: new Date(dayStart.getTime() + 12 * 3600000).toISOString().slice(0, 16), height_m: 1.8 },
      );
    }
  }

  const result = classifyTideRegime(events);
  assert.equal(result.regime, 'misto', `Esperado 'misto' (variável), obtido '${result.regime}'`);
});

test('Dados vazios: retorna semidiurno com valores padrão', () => {
  const result = classifyTideRegime([]);
  assert.equal(result.regime, 'semidiurno');
  assert.equal(result.amplitudeMedia, 2.0);
  assert.equal(result.amplitudeMax, 2.5);
});

test('amplitudeMax >= amplitudeMedia em todos os casos', () => {
  const cases = [
    makeDays([0.15, 1.65], 7),          // diurno
    makeDays([0.3, 2.3, 0.4, 2.2], 7), // semidiurno
    makeDays([0.1, 2.8, 0.6, 1.0], 7), // misto
  ];

  for (const events of cases) {
    const result = classifyTideRegime(events);
    assert.ok(
      result.amplitudeMax >= result.amplitudeMedia,
      `amplitudeMax(${result.amplitudeMax}) deve ser >= amplitudeMedia(${result.amplitudeMedia}) [regime: ${result.regime}]`
    );
  }
});

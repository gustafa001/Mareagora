import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyToday } from '../lib/tideQuality';

const DIA_COMUM = [
  { hora: '02:10', altura_m: 1.30, tipo: 'high' },
  { hora: '08:25', altura_m: 0.40, tipo: 'low' },
  { hora: '14:40', altura_m: 1.35, tipo: 'high' },
  { hora: '21:05', altura_m: 0.45, tipo: 'low' },
];

test('dia com baixa seca classifica piscinas naturais excelente', () => {
  const r = classifyToday([
    { hora: '06:00', altura_m: 1.20, tipo: 'high' },
    { hora: '12:15', altura_m: 0.20, tipo: 'low' },
    { hora: '18:30', altura_m: 1.25, tipo: 'high' },
    { hora: '23:50', altura_m: 0.55, tipo: 'low' },
  ], 600);
  assert.ok(r);
  assert.equal(r.tone, 'excelente');
  assert.match(r.label, /piscinas naturais/i);
});

test('amplitude generosa sem baixa seca -> surfe', () => {
  const r = classifyToday(DIA_COMUM, 600);
  assert.ok(r);
  assert.match(r.label, /surfe/i);
});

test('estadoAgora reflete maré subindo/baixando no detail', () => {
  const subindo = classifyToday(DIA_COMUM, 9 * 60 + 30); // entre low 08:25 e high 14:40
  const baixando = classifyToday(DIA_COMUM, 16 * 60); // entre high 14:40 e low 21:05
  assert.ok(subindo && baixando);
  assert.match(subindo.detail, /enchendo/);
  assert.match(baixando.detail, /secando/);
});

test('quadratura (amplitude pequena) -> dia calmo', () => {
  const r = classifyToday([
    { hora: '03:00', altura_m: 1.00, tipo: 'high' },
    { hora: '09:00', altura_m: 0.85, tipo: 'low' },
    { hora: '15:00', altura_m: 1.05, tipo: 'high' },
    { hora: '21:00', altura_m: 0.90, tipo: 'low' },
  ], 600);
  assert.ok(r);
  assert.equal(r.tone, 'calmo');
});

test('defensivo: lista vazia ou horários inválidos -> null', () => {
  assert.equal(classifyToday([], 600), null);
  assert.equal(classifyToday([{ hora: 'xx', altura_m: NaN }], 600), null);
  assert.equal(classifyToday(undefined, 600), null);
});

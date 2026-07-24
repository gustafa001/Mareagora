import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextHighAndLow, getMoonPhase, getMoonAge, getTideCoefficient, type TideEvent } from '../lib/tideUtils';

test('BUG 1: próxima alta/baixa às 00:11 com marés [00:38, 05:02, 11:25, 20:27]', () => {
  // Horário atual = 00:11 -> 11 minutos após meia-noite
  const currentMinute = 11;

  const todayTides: TideEvent[] = [
    { hora: '00:38', altura_m: 0.75, tipo: 'high' },
    { hora: '05:02', altura_m: 0.30, tipo: 'low' },
    { hora: '11:25', altura_m: 1.40, tipo: 'high' },
    { hora: '20:27', altura_m: 0.20, tipo: 'low' },
  ];

  const { nextHigh, nextLow } = getNextHighAndLow(todayTides, currentMinute);

  assert.ok(nextHigh, 'nextHigh deve existir');
  assert.equal(nextHigh.hora, '00:38', 'Próxima alta deve ser 00:38 (não 11:25)');
  assert.equal(nextHigh.altura_m, 0.75);

  assert.ok(nextLow, 'nextLow deve existir');
  assert.equal(nextLow.hora, '05:02', 'Próxima baixa deve ser 05:02');
  assert.equal(nextLow.altura_m, 0.30);
});

test('BUG 2: consistência da fase lunar para 24/07/2026', () => {
  const targetDate = new Date('2026-07-24T12:00:00Z');
  const moonInfo = getMoonPhase(targetDate);
  assert.equal(moonInfo.name, 'Gibosa Crescente');
});

test('BUG 3: consistência do coeficiente de maré entre tabela e card ao vivo', () => {
  const targetDate = new Date('2026-07-24T12:00:00Z');
  const todayTides: TideEvent[] = [
    { hora: '00:38', altura_m: 1.0, tipo: 'high' },
    { hora: '05:02', altura_m: 0.4, tipo: 'low' },
    { hora: '11:25', altura_m: 1.0, tipo: 'high' },
    { hora: '20:27', altura_m: 0.4, tipo: 'low' },
  ];

  const moonAge = getMoonAge(targetDate);
  const coefWithTides = getTideCoefficient(moonAge, todayTides);

  // Range = 1.0 - 0.4 = 0.6. Math.round(0.6 * 55) = 33
  assert.equal(coefWithTides.value, 33, 'Coeficiente calculado com eventos do dia deve ser 33');
});

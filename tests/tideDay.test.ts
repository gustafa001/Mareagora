import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { PORTS } from '../lib/ports';
import { getEventosDia } from '../lib/mare';
import {
  DAY_PAGE_INDEXABLE_SLUGS,
  DAY_PAGE_WINDOW_DAYS,
  buildDiaFaq,
  buildDiaMetaDescription,
  buildDiaResumo,
  forcaDaMare,
  getCurvaDia,
  getDiaMare,
  isDayInWindow,
  isValidISODate,
} from '../lib/tideDay';

// lib/mare.ts carrega data/mare/*.json com `require()` (provido pelo Next/webpack,
// não pelo ESM puro do tsx) — mesmo shim dos outros testes.
(globalThis as { require?: NodeRequire }).require = createRequire(
  new URL('../lib/mare.ts', import.meta.url),
);

const santos = PORTS.find((p) => p.slug === 'porto-de-santos');
assert.ok(santos, 'porto-de-santos precisa existir em lib/ports.ts');

// "hoje" fixo para o teste não depender do relógio.
const HOJE = '2026-11-13';

test('isValidISODate: aceita datas reais e rejeita lixo', () => {
  assert.equal(isValidISODate('2026-11-14'), true);
  assert.equal(isValidISODate('2026-02-31'), false);
  assert.equal(isValidISODate('14-11-2026'), false);
  assert.equal(isValidISODate('amanha'), false);
  assert.equal(isValidISODate(''), false);
});

test('isDayInWindow: hoje até hoje+30, nada fora disso', () => {
  assert.equal(isDayInWindow('2026-11-13', HOJE), true); // hoje
  assert.equal(isDayInWindow('2026-12-13', HOJE), true); // hoje + 30
  assert.equal(DAY_PAGE_WINDOW_DAYS, 30);
  assert.equal(isDayInWindow('2026-12-14', HOJE), false); // hoje + 31
  assert.equal(isDayInWindow('2026-11-12', HOJE), false); // ontem
  assert.equal(isDayInWindow('2026-02-31', HOJE), false); // inválida
});

test('getDiaMare: Santos em 14/11/2026 bate com a tábua mensal do site', () => {
  const dia = getDiaMare(santos!, '2026-11-14', HOJE);
  assert.ok(dia);
  assert.deepEqual(
    dia.mares.map((m) => [m.hora, m.altura_m, m.alta]),
    [
      ['04:57', 1.19, true],
      ['10:27', 0.59, false],
      ['15:02', 1.01, true],
    ],
  );
  assert.equal(dia.dataBR, '14/11/2026');
  assert.equal(dia.diaSemana, 'sábado');
  assert.equal(dia.anterior, '2026-11-13');
  assert.equal(dia.proximo, '2026-11-15');
  assert.ok(dia.coef !== null);
});

test('getDiaMare: bate com getEventosDia (mesma fonte da página do porto)', () => {
  const dia = getDiaMare(santos!, '2026-11-20', HOJE);
  assert.ok(dia);
  const eventos = getEventosDia(santos!, '2026-11-20');
  for (const m of dia.mares) {
    assert.ok(
      eventos.some((e) => e.hora === m.hora && e.altura_m === m.altura_m),
      `maré ${m.hora} não existe em getEventosDia`,
    );
  }
});

test('getDiaMare: null fora da janela ou para data inválida (rota vira 404)', () => {
  assert.equal(getDiaMare(santos!, '2026-11-12', HOJE), null);
  assert.equal(getDiaMare(santos!, '2026-12-14', HOJE), null);
  assert.equal(getDiaMare(santos!, '2026-02-31', HOJE), null);
  assert.equal(getDiaMare(santos!, 'lixo', HOJE), null);
});

test('getDiaMare: sem link ← em hoje e sem → no último dia da janela', () => {
  const hoje = getDiaMare(santos!, HOJE, HOJE);
  assert.ok(hoje);
  assert.equal(hoje.anterior, null);
  assert.equal(hoje.proximo, '2026-11-14');

  const ultimo = getDiaMare(santos!, '2026-12-13', HOJE);
  assert.ok(ultimo);
  assert.equal(ultimo.proximo, null);
  assert.equal(ultimo.anterior, '2026-12-12');
});

test('textos: resumo, meta description e FAQ trazem os horários do dia', () => {
  const dia = getDiaMare(santos!, '2026-11-14', HOJE)!;

  const resumo = buildDiaResumo('Santos', 'SP', dia, 'lua crescente');
  assert.match(resumo, /Sábado, 14\/11\/2026/);
  assert.match(resumo, /04:57/);
  assert.match(resumo, /10:27/);

  const meta = buildDiaMetaDescription('Santos', 'SP', dia);
  assert.ok(meta.length <= 200);
  assert.match(meta, /14\/11\/2026/);
  assert.match(meta, /04:57/);

  const faq = buildDiaFaq('Santos', dia);
  assert.ok(faq.length >= 2);
  assert.ok(faq.every((f) => f.question.length > 0 && f.answer.length > 0));
});

test('forcaDaMare: mesmas faixas do content-generator', () => {
  assert.equal(forcaDaMare(30), 'morta');
  assert.equal(forcaDaMare(45), 'intermediária');
  assert.equal(forcaDaMare(70), 'intermediária');
  assert.equal(forcaDaMare(71), 'viva');
});

test('segurança: nenhum porto é indexável por padrão (Passo 2/3 = noindex)', () => {
  assert.equal(DAY_PAGE_INDEXABLE_SLUGS.size, 0);
});

test('getCurvaDia: cobre 00:00-24:00 e passa pelos extremos oficiais', () => {
  const dia = getDiaMare(santos!, '2026-11-14', HOJE)!;
  const curva = getCurvaDia(dia.mares);
  assert.equal(curva[0].min, 0);
  assert.equal(curva[curva.length - 1].min, 1440);

  for (const m of dia.mares) {
    const [h, mm] = m.hora.split(':').map(Number);
    const alvo = h * 60 + mm;
    const ponto = curva.reduce((a, b) => (Math.abs(b.min - alvo) < Math.abs(a.min - alvo) ? b : a));
    // passo de 15 min: a curva fica a menos de ~0,05 m do extremo oficial
    assert.ok(Math.abs(ponto.altura - m.altura_m) < 0.05, `curva diverge em ${m.hora}`);
  }
  const todas = curva.map(p => p.altura);
  const oficiais = dia.mares.map(m => m.altura_m);
  assert.ok(Math.max(...todas) <= Math.max(...oficiais) + 1e-9);
  assert.ok(Math.min(...todas) >= Math.min(...oficiais) - 1e-9);
});

test('getCurvaDia: vazio com menos de 2 extremos', () => {
  assert.deepEqual(getCurvaDia([]), []);
});

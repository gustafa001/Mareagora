import test from 'node:test';
import assert from 'node:assert/strict';
import { PORTS, getReferencePort, isEstimatedLocation, type Port } from '../lib/ports';

const derivados = PORTS.filter(p => p.referencePortSlug);
const estacoes = PORTS.filter(p => !p.referencePortSlug);

test('todo local com referencePortSlug tem offsetMinutes definido, e vice-versa', () => {
  for (const p of PORTS) {
    assert.equal(
      p.offsetMinutes !== undefined,
      Boolean(p.referencePortSlug),
      `${p.slug}: offsetMinutes e referencePortSlug devem andar juntos`
    );
  }
});

test('o porto de referência existe e é uma estação (não outro local derivado)', () => {
  for (const p of derivados) {
    const ref = getReferencePort(p);
    assert.ok(ref, `${p.slug}: referencePortSlug "${p.referencePortSlug}" não existe`);
    assert.equal(ref.referencePortSlug, undefined, `${p.slug}: a referência não pode ser derivada`);
    assert.equal(ref.dhnId, p.dhnId, `${p.slug}: dhnId deve ser o da estação de referência`);
  }
});

test('estações próprias nunca são marcadas como estimadas', () => {
  assert.ok(estacoes.length > 0);
  for (const p of estacoes) assert.equal(isEstimatedLocation(p), false, p.slug);
});

test('locais derivados sem offsetSource são estimados; com offsetSource deixam de ser', () => {
  const base = derivados[0];
  assert.ok(base);
  assert.equal(isEstimatedLocation(base), true);
  const comFonte: Port = { ...base, offsetSource: 'Tábua DHN/CHM, ponto X, edição 2026' };
  assert.equal(isEstimatedLocation(comFonte), false);
});


/**
 * scripts/check-content-similarity.ts
 *
 * Analisa a similaridade de Jaccard entre os textos gerados para todas as
 * localidades de um país. Identifica pares com alta similaridade (conteúdo raso)
 * e mostra um relatório antes de aprovar o lote.
 *
 * Algoritmo: Jaccard sobre bag-of-words (unigrams), sem stop-words triviais.
 * Score 0 = totalmente diferente, 1 = idênticos.
 * Threshold de alerta: > 0.75 (muito parecidos).
 *
 * Uso: npx tsx scripts/check-content-similarity.ts --country=us
 */

import fs from 'fs';
import path from 'path';
import { GLOBAL_PLACES } from '../lib/globalPlaces';
import { generateTideDescription } from '../lib/tideDescription';

// ── CLI ───────────────────────────────────────────────────────────────────────
const countryArg = process.argv.find((a) => a.startsWith('--country='));
const countryCode = countryArg?.split('=')[1]?.toLowerCase();

if (!countryCode) {
  console.error('Uso: npx tsx scripts/check-content-similarity.ts --country=<código-iso2>');
  process.exit(1);
}

const places = GLOBAL_PLACES.filter((p) => p.countryCode.toLowerCase() === countryCode);
if (places.length === 0) {
  console.error(`Nenhuma localidade encontrada para countryCode="${countryCode}"`);
  process.exit(1);
}

// ── Similaridade de Jaccard ───────────────────────────────────────────────────

// Stop-words comuns PT+EN que não contribuem para distinguir conteúdo
const STOP_WORDS = new Set([
  'a', 'o', 'e', 'de', 'do', 'da', 'no', 'na', 'em', 'para', 'com', 'por',
  'que', 'se', 'um', 'uma', 'os', 'as', 'dos', 'das', 'nos', 'nas', 'ao',
  'à', 'é', 'são', 'foi', 'ser', 'este', 'esta', 'cada',
  'the', 'a', 'an', 'in', 'of', 'for', 'to', 'and', 'is', 'are', 'at',
  'this', 'be', 'by', 'on', 'or', 'as', 'can', 'its', 'it',
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-záàãâéêíóôõúçüñ\s]/gi, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersectionCount = 0;
  a.forEach((x) => {
    if (b.has(x)) intersectionCount++;
  });
  const unionSize = a.size + b.size - intersectionCount;
  return unionSize === 0 ? 1 : intersectionCount / unionSize;
}

// ── Geração de conteúdo ───────────────────────────────────────────────────────

console.log(`\n🔍 Analisando similaridade de conteúdo para "${countryCode.toUpperCase()}"...`);
console.log(`   Localidades: ${places.length}`);

interface PlaceContent {
  slug: string;
  name: string;
  text: string;
  tokens: Set<string>;
}

const contents: PlaceContent[] = places.map((place) => {
  // Usa PT pois é o texto principal para o Google
  const text = generateTideDescription(
    place.name, place.countryName, place.countryCode, place.lat, place.lon, 'pt', place.slug
  );
  return { slug: place.slug, name: place.name, text, tokens: tokenize(text) };
});

// ── Cálculo de pares ──────────────────────────────────────────────────────────

const HIGH_THRESHOLD = 0.75;
const WARN_THRESHOLD = 0.60;

interface SimilarPair {
  a: string;
  b: string;
  score: number;
}

const allScores: number[] = [];
const highPairs: SimilarPair[] = [];
const warnPairs: SimilarPair[] = [];

for (let i = 0; i < contents.length; i++) {
  for (let j = i + 1; j < contents.length; j++) {
    const score = jaccardSimilarity(contents[i].tokens, contents[j].tokens);
    allScores.push(score);
    if (score >= HIGH_THRESHOLD) {
      highPairs.push({ a: contents[i].slug, b: contents[j].slug, score });
    } else if (score >= WARN_THRESHOLD) {
      warnPairs.push({ a: contents[i].slug, b: contents[j].slug, score });
    }
  }
}

// ── Estatísticas ──────────────────────────────────────────────────────────────

const avgScore = allScores.reduce((s, v) => s + v, 0) / (allScores.length || 1);
const maxScore = Math.max(...allScores);
const minScore = Math.min(...allScores);

// Percentis
const sorted = [...allScores].sort((a, b) => a - b);
const p50 = sorted[Math.floor(sorted.length * 0.50)] ?? 0;
const p75 = sorted[Math.floor(sorted.length * 0.75)] ?? 0;
const p90 = sorted[Math.floor(sorted.length * 0.90)] ?? 0;
const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0;

// ── Relatório ─────────────────────────────────────────────────────────────────

console.log(`\n${'═'.repeat(65)}`);
console.log(` RELATÓRIO DE SIMILARIDADE — ${countryCode.toUpperCase()} (${places.length} localidades)`);
console.log(`${'═'.repeat(65)}`);
console.log(`\n📊 Estatísticas (Jaccard sobre bag-of-words PT):`);
console.log(`   Pares analisados:   ${allScores.length}`);
console.log(`   Média:              ${(avgScore * 100).toFixed(1)}%`);
console.log(`   Mínimo:             ${(minScore * 100).toFixed(1)}%`);
console.log(`   Máximo:             ${(maxScore * 100).toFixed(1)}%`);
console.log(`   Mediana (p50):      ${(p50 * 100).toFixed(1)}%`);
console.log(`   p75:                ${(p75 * 100).toFixed(1)}%`);
console.log(`   p90:                ${(p90 * 100).toFixed(1)}%`);
console.log(`   p95:                ${(p95 * 100).toFixed(1)}%`);
console.log(`\n🚨 Pares com similaridade ≥ ${HIGH_THRESHOLD * 100}% (CRÍTICO): ${highPairs.length}`);

if (highPairs.length > 0) {
  highPairs.slice(0, 10).forEach(({ a, b, score }) => {
    console.log(`   [${(score * 100).toFixed(1)}%] ${a}  ↔  ${b}`);
  });
  if (highPairs.length > 10) console.log(`   ... e mais ${highPairs.length - 10} pares`);
}

console.log(`\n⚠️  Pares com similaridade ≥ ${WARN_THRESHOLD * 100}% (ATENÇÃO):  ${warnPairs.length}`);
if (warnPairs.length > 0 && warnPairs.length <= 15) {
  warnPairs.forEach(({ a, b, score }) => {
    console.log(`   [${(score * 100).toFixed(1)}%] ${a}  ↔  ${b}`);
  });
} else if (warnPairs.length > 15) {
  warnPairs.slice(0, 15).forEach(({ a, b, score }) => {
    console.log(`   [${(score * 100).toFixed(1)}%] ${a}  ↔  ${b}`);
  });
  console.log(`   ... e mais ${warnPairs.length - 15} pares`);
}

// Exemplo de texto gerado para o primeiro lugar
console.log(`\n📄 Exemplo de texto gerado (${contents[0]?.slug}):`);
console.log(`   "${contents[0]?.text.slice(0, 200)}..."`);

// Veredicto
console.log(`\n${'─'.repeat(65)}`);
const isApproved = highPairs.length === 0 && avgScore < 0.55;
if (isApproved) {
  console.log(` ✅ APROVADO para indexação — similaridade média abaixo de 55% e sem pares críticos`);
  console.log(`    Próximo passo: npx tsx scripts/approve-batch.ts --country=${countryCode}`);
} else {
  console.log(` ❌ NÃO aprovado — ${highPairs.length} pares críticos e similaridade média ${(avgScore * 100).toFixed(1)}%`);
  console.log(`    Revise o conteúdo antes de aprovar.`);
}
console.log(`${'═'.repeat(65)}\n`);

// Salva relatório JSON
const reportDir = path.join(process.cwd(), 'data', 'similarity-reports');
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, `${countryCode}.json`);
fs.writeFileSync(reportPath, JSON.stringify({
  countryCode,
  analyzedAt: new Date().toISOString(),
  placeCount: places.length,
  pairCount: allScores.length,
  stats: {
    avg: parseFloat((avgScore * 100).toFixed(2)),
    min: parseFloat((minScore * 100).toFixed(2)),
    max: parseFloat((maxScore * 100).toFixed(2)),
    p50: parseFloat((p50 * 100).toFixed(2)),
    p75: parseFloat((p75 * 100).toFixed(2)),
    p90: parseFloat((p90 * 100).toFixed(2)),
    p95: parseFloat((p95 * 100).toFixed(2)),
  },
  highPairs: highPairs.slice(0, 50),
  warnPairs: warnPairs.slice(0, 50),
  approved: isApproved,
}, null, 2), 'utf-8');
console.log(`📁 Relatório salvo em: ${reportPath}`);

/**
 * scripts/generate-batch-content.ts
 *
 * Gera o conteúdo de texto editorial para todas as localidades de um país.
 * Salva em data/batch-content/<countryCode>.json para revisão e análise
 * de similaridade antes de aprovar.
 *
 * Uso: npx tsx scripts/generate-batch-content.ts --country=us
 */

import fs from 'fs';
import path from 'path';
import { GLOBAL_PLACES } from '../lib/globalPlaces';
import { generateTideDescription } from '../lib/tideDescription';

const countryArg = process.argv.find((a) => a.startsWith('--country='));
const countryCode = countryArg?.split('=')[1]?.toLowerCase();

if (!countryCode) {
  console.error('Uso: npx tsx scripts/generate-batch-content.ts --country=<código-iso2>');
  process.exit(1);
}

const places = GLOBAL_PLACES.filter((p) => p.countryCode.toLowerCase() === countryCode);

if (places.length === 0) {
  console.error(`Nenhuma localidade encontrada para countryCode="${countryCode}"`);
  process.exit(1);
}

console.log(`\n📝 Gerando conteúdo para ${places.length} localidades de "${countryCode}"...`);

const results: Record<string, { slug: string; name: string; pt: string; en: string }> = {};

for (const place of places) {
  const pt = generateTideDescription(place.name, place.countryName, place.countryCode, place.lat, place.lon, 'pt', place.slug);
  const en = generateTideDescription(place.name, place.countryName, place.countryCode, place.lat, place.lon, 'en', place.slug);
  results[place.slug] = { slug: place.slug, name: place.name, pt, en };
}

const outDir = path.join(process.cwd(), 'data', 'batch-content');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${countryCode}.json`);
fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');

console.log(`✅ Conteúdo gerado: ${Object.keys(results).length} textos`);
console.log(`   Salvo em: ${outPath}`);
console.log(`\nPróximo passo: npx tsx scripts/check-content-similarity.ts --country=${countryCode}`);

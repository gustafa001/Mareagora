/**
 * scripts/approve-batch.ts
 *
 * Marca todas as localidades de um país como aprovadas em
 * data/content-rollout-status.json, SOMENTE se o relatório de similaridade
 * existir e tiver sido aprovado (approved: true no relatório).
 *
 * Uso: npx tsx scripts/approve-batch.ts --country=us
 *      npx tsx scripts/approve-batch.ts --country=us --force  (ignora similaridade)
 */

import fs from 'fs';
import path from 'path';
import { GLOBAL_PLACES } from '../lib/globalPlaces';

const countryArg = process.argv.find((a) => a.startsWith('--country='));
const countryCode = countryArg?.split('=')[1]?.toLowerCase();
const force = process.argv.includes('--force');

if (!countryCode) {
  console.error('Uso: npx tsx scripts/approve-batch.ts --country=<código-iso2> [--force]');
  process.exit(1);
}

const places = GLOBAL_PLACES.filter((p) => p.countryCode.toLowerCase() === countryCode);
if (places.length === 0) {
  console.error(`Nenhuma localidade encontrada para countryCode="${countryCode}"`);
  process.exit(1);
}

// Verifica se o relatório de similaridade existe e está aprovado
const reportPath = path.join(process.cwd(), 'data', 'similarity-reports', `${countryCode}.json`);

if (!force) {
  if (!fs.existsSync(reportPath)) {
    console.error(`\n❌ Relatório de similaridade não encontrado para "${countryCode}".`);
    console.error(`   Execute primeiro: npx tsx scripts/check-content-similarity.ts --country=${countryCode}`);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  if (!report.approved) {
    console.error(`\n❌ Relatório de similaridade para "${countryCode}" NÃO aprovou o lote.`);
    console.error(`   Similaridade média: ${report.stats?.avg}%`);
    console.error(`   Pares críticos (≥75%): ${report.highPairs?.length ?? 'N/A'}`);
    console.error(`\n   Melhore o conteúdo antes de aprovar, ou use --force para ignorar.`);
    process.exit(1);
  }

  console.log(`\n✅ Relatório de similaridade verificado e aprovado para "${countryCode}"`);
  console.log(`   Similaridade média: ${report.stats?.avg}%  |  Pares críticos: ${report.highPairs?.length ?? 0}`);
} else {
  console.log(`\n⚠️  Modo --force: aprovando sem verificar relatório de similaridade`);
}

// Carrega e atualiza o rollout status
const rolloutPath = path.join(process.cwd(), 'data', 'content-rollout-status.json');
const rollout: Record<string, { approved: boolean; countryCode: string; approvedAt?: string; approvedBy?: string }> =
  JSON.parse(fs.readFileSync(rolloutPath, 'utf-8'));

const today = new Date().toISOString().slice(0, 10);
let updatedCount = 0;

for (const place of places) {
  if (rollout[place.slug]) {
    rollout[place.slug].approved = true;
    rollout[place.slug].approvedAt = today;
    rollout[place.slug].approvedBy = force ? 'manual' : 'similarity-check';
    updatedCount++;
  }
}

fs.writeFileSync(rolloutPath, JSON.stringify(rollout, null, 2), 'utf-8');

const totalApproved = Object.values(rollout).filter((v) => v.approved).length;
const totalPending = Object.values(rollout).filter((v) => !v.approved).length;

console.log(`\n📋 Rollout atualizado:`);
console.log(`   Aprovadas neste lote:  ${updatedCount}`);
console.log(`   Total aprovadas:       ${totalApproved}`);
console.log(`   Total pendentes:       ${totalPending}`);
console.log(`\n🚀 Localidades de "${countryCode}" agora têm robots: { index: true, follow: true }`);
console.log(`   Faça deploy e submeta ao Google Search Console para indexação.`);

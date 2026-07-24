/**
 * scripts/prioritize-global-content.ts
 *
 * Gera um plano de priorização das localidades ainda pendentes de aprovação,
 * ordenando por país com mais localidades (maior volume de páginas noindex).
 *
 * Uso: npm run content:prioritize
 */

import fs from 'fs';
import path from 'path';
import { GLOBAL_PLACES } from '../lib/globalPlaces';
import type { RolloutEntry } from './generate-rollout-status';

const rolloutPath = path.join(process.cwd(), 'data', 'content-rollout-status.json');
const rollout: Record<string, RolloutEntry> = JSON.parse(
  fs.readFileSync(rolloutPath, 'utf-8')
);

// Agrupa localidades pendentes por país
const pendingByCountry: Record<string, { countryCode: string; countryName: string; places: string[] }> = {};

for (const place of GLOBAL_PLACES) {
  const entry = rollout[place.slug];
  if (!entry || entry.approved) continue;

  const key = place.countryCode;
  if (!pendingByCountry[key]) {
    pendingByCountry[key] = {
      countryCode: place.countryCode,
      countryName: place.countryName,
      places: [],
    };
  }
  pendingByCountry[key].places.push(place.slug);
}

// Ordena por volume (maior primeiro)
const sorted = Object.values(pendingByCountry).sort(
  (a, b) => b.places.length - a.places.length
);

const totalPending = Object.values(rollout).filter((v) => !v.approved).length;
const totalApproved = Object.values(rollout).filter((v) => v.approved).length;

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log(' PLANO DE PRIORIZAÇÃO — CONTEÚDO GLOBAL MAREAGORA');
console.log('═══════════════════════════════════════════════════════════');
console.log(` Total de localidades:    ${GLOBAL_PLACES.length}`);
console.log(` Já aprovadas (index):    ${totalApproved}`);
console.log(` Pendentes (noindex):     ${totalPending}`);
console.log('───────────────────────────────────────────────────────────');
console.log(' RANK | PAÍS                         | LOCALIDADES | SLUG DO 1º LOTE');
console.log('───────────────────────────────────────────────────────────');

sorted.forEach((entry, i) => {
  const rank = String(i + 1).padStart(4, ' ');
  const country = entry.countryName.padEnd(30, ' ');
  const count = String(entry.places.length).padStart(11, ' ');
  const firstSlug = entry.places[0] ?? '-';
  console.log(` ${rank} | ${country} | ${count} | ${firstSlug}`);
});

console.log('───────────────────────────────────────────────────────────');
console.log('');
console.log(' PRÓXIMOS PASSOS:');
console.log(` 1. Processar o 1º lote: ${sorted[0]?.countryName ?? '-'} (${sorted[0]?.places.length ?? 0} localidades)`);
console.log('    - Rodar Fases 2-4 para esse lote');
console.log('    - Verificar relatório de similaridade');
console.log('    - Marcar como approved em data/content-rollout-status.json');
console.log('');
console.log(' Após aprovação, atualize o rollout com:');
console.log('   npm run content:approve -- --country=<código>');
console.log('');

// Salva o plano como JSON também para consulta programática
const planPath = path.join(process.cwd(), 'data', 'content-prioritization-plan.json');
fs.writeFileSync(planPath, JSON.stringify(sorted, null, 2), 'utf-8');
console.log(` ✅ Plano salvo em: ${planPath}`);

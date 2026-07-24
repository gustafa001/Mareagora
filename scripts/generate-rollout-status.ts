/**
 * scripts/generate-rollout-status.ts
 *
 * Gera data/content-rollout-status.json com o status de aprovação de cada
 * localidade global para indexação pelo Google.
 *
 * Regras:
 *  - Localidades de países já cobertos por TIDE_CHARACTERISTICS (22 países) são
 *    pré-aprovadas — elas já tinham texto único antes da Fase 0.
 *  - Todas as demais começam como não aprovadas (noindex).
 *
 * Re-execute após adicionar novas localidades em lib/globalPlaces.ts ou após
 * completar as Fases 2-4 para um novo lote.
 */

import fs from 'fs';
import path from 'path';
import { GLOBAL_PLACES } from '../lib/globalPlaces';

// Países pré-aprovados — já tinham texto específico por país em TIDE_CHARACTERISTICS
const PRE_APPROVED_COUNTRIES = new Set([
  'gb', 'fr', 'pt', 'es', 'us', 'ca', 'ie', 'no',
  'ar', 'mx', 'co', 'cl',
  'jp', 'au', 'nz', 'id', 'ph', 'cn', 'in',
  'za', 'ma', 'sn',
]);

export interface RolloutEntry {
  approved: boolean;
  approvedAt?: string;         // data de aprovação no formato YYYY-MM-DD
  approvedBy?: 'pre-approved' | 'manual' | 'similarity-check';
  countryCode: string;
}

function buildRolloutStatus(): Record<string, RolloutEntry> {
  const today = new Date().toISOString().slice(0, 10);
  const status: Record<string, RolloutEntry> = {};

  for (const place of GLOBAL_PLACES) {
    const cc = place.countryCode.toLowerCase();
    const isPreApproved = PRE_APPROVED_COUNTRIES.has(cc);
    status[place.slug] = {
      approved: isPreApproved,
      countryCode: cc,
      ...(isPreApproved ? { approvedAt: today, approvedBy: 'pre-approved' } : {}),
    };
  }

  return status;
}

const rollout = buildRolloutStatus();
const outputPath = path.join(process.cwd(), 'data', 'content-rollout-status.json');
fs.writeFileSync(outputPath, JSON.stringify(rollout, null, 2), 'utf-8');

const approved = Object.values(rollout).filter((v) => v.approved).length;
const pending = Object.values(rollout).filter((v) => !v.approved).length;

console.log(`✅ content-rollout-status.json gerado:`);
console.log(`   Aprovadas (index=true):  ${approved}`);
console.log(`   Pendentes (noindex):      ${pending}`);
console.log(`   Total:                    ${Object.keys(rollout).length}`);
console.log(`   Salvo em: ${outputPath}`);

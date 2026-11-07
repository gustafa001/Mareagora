import fs from 'fs';

import path from 'path';

const baseDir = 'C:/Users/gusta/.gemini/antigravity/scratch/Mareagora-git';
const origLines = fs.readFileSync(path.join(baseDir, 'scripts/original-titles.txt'), 'utf16le').split('\r\n');
const newLines = fs.readFileSync(path.join(baseDir, 'scripts/new-titles.txt'), 'utf16le').split('\r\n');

const origMap: Record<string, { len: string; title: string }> = {};
for (const line of origLines) {
  const parts = line.trim().split('\t');
  if (parts.length === 3) origMap[parts[0]] = { len: parts[1], title: parts[2] };
}

const newMap: Record<string, { len: string; title: string }> = {};
for (const line of newLines) {
  const parts = line.trim().split('\t');
  if (parts.length === 3) newMap[parts[0]] = { len: parts[1], title: parts[2] };
}

console.log('--- COMPARAÇÃO ANTES / DEPOIS DE TODOS OS ALTERADOS ---');
let diffCount = 0;
for (const slug of Object.keys(origMap)) {
  const o = origMap[slug];
  const n = newMap[slug];
  if (!n) continue;
  if (o.title !== n.title) {
    diffCount++;
    console.log(`[${slug}]`);
    console.log(`  ANTES  (${o.len}c): "${o.title}"`);
    console.log(`  DEPOIS (${n.len}c): "${n.title}"`);
  }
}
console.log(`\nTotal de títulos alterados: ${diffCount} de ${Object.keys(origMap).length}`);

console.log('\n--- VERIFICAÇÃO DAS PÁGINAS PROTEGIDAS / EXIGIDAS ---');
const auditSlugs = [
  'praia-do-forte',
  'maracaipe',
  'sao-luis',
  'porto-de-maceio',
  'porto-de-santos',
  'terminal-de-barra-do-riacho',
  'guaruja'
];

for (const slug of auditSlugs) {
  const o = origMap[slug];
  const n = newMap[slug];
  const status = o?.title === n?.title ? 'MANTIDO IGUAL' : 'ALTERADO CONFORME ESPERADO';
  console.log(`[${slug}] -> ${status}`);
  console.log(`  ANTES  (${o?.len}c): "${o?.title}"`);
  console.log(`  DEPOIS (${n?.len}c): "${n?.title}"`);
}

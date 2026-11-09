#!/usr/bin/env node
/**
 * Remove câmeras (por videoId) de lib/ports.ts e lib/globalPlaces.ts e as
 * descrições correspondentes de lib/live-cameras.ts e lib/cameras-data.ts.
 *
 * Uso: node scripts/remove-dead-cameras.mjs <videoId> [<videoId> ...]
 * Usado pelo workflow check-cameras para abrir um PR de limpeza.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ids = process.argv.slice(2).filter((a) => /^[\w-]{11}$/.test(a));
if (ids.length === 0) {
  console.error('Informe ao menos um videoId (11 caracteres).');
  process.exit(1);
}
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const write = (f, s) => writeFileSync(new URL(`../${f}`, import.meta.url), s);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let removed = 0;

for (const file of ['lib/ports.ts', 'lib/globalPlaces.ts']) {
  let s = read(file);
  for (const id of ids) {
    // 1) apaga a linha da câmera
    const line = new RegExp(`^[ \\t]*\\{[^\\n]*videoId: '${esc(id)}'[^\\n]*\\},?[ \\t]*\\n`, 'm');
    if (!line.test(s)) continue;
    s = s.replace(line, '');
    removed++;
  }
  // 2) se a câmera removida era a última, a anterior ficou com vírgula sobrando
  s = s.replace(/(\{ title:[^\n]*\}),[ \t]*\n([ \t]*\])/g, '$1\n$2');
  // 3) array vazio -> remove a propriedade cameras inteira (e a vírgula antes dela)
  s = s.replace(/,[ \t]*\n[ \t]*cameras: \[\s*\]/g, '');
  write(file, s);
}

for (const file of ['lib/live-cameras.ts', 'lib/cameras-data.ts']) {
  let s = read(file);
  for (const id of ids) {
    const desc = new RegExp(`^  ['"]?${esc(id)}['"]?:\\n    [^\\n]*\\n`, 'm');
    s = s.replace(desc, '');
  }
  write(file, s);
}

console.log(`${removed} câmera(s) removida(s).`);
process.exit(removed > 0 ? 0 : 3);

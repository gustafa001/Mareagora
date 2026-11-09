#!/usr/bin/env node
/**
 * Verifica se os vídeos do YouTube cadastrados em lib/ports.ts e
 * lib/globalPlaces.ts ainda existem e são públicos (via oEmbed).
 *
 * Uso: npm run check:cameras
 * Sai com código 1 se alguma câmera estiver fora do ar.
 *
 * Limite: o oEmbed detecta vídeos REMOVIDOS ou PRIVADOS. Uma live que apenas
 * terminou (gravação indisponível) ainda pode responder 200 — nesse caso
 * confira visualmente em /cameras.
 */
import { readFileSync } from 'node:fs';

const FILES = ['lib/ports.ts', 'lib/globalPlaces.ts'];
const ID_RE = /videoId:\s*['"]([\w-]{11})['"]/g;

const cams = new Map(); // videoId -> arquivos
for (const file of FILES) {
  const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  for (const m of src.matchAll(ID_RE)) {
    if (!cams.has(m[1])) cams.set(m[1], new Set());
    cams.get(m[1]).add(file);
  }
}

async function check(id) {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${id}`,
  )}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (res.ok) return { id, ok: true, title: (await res.json()).title };
    const reason =
      res.status === 404 ? 'removido/inexistente' : res.status === 401 || res.status === 403 ? 'privado/restrito' : `HTTP ${res.status}`;
    return { id, ok: false, reason };
  } catch (e) {
    return { id, ok: null, reason: `erro de rede (${e.message})` };
  }
}

const results = await Promise.all([...cams.keys()].map(check));
let dead = 0;
for (const r of results) {
  const where = [...cams.get(r.id)].join(', ');
  if (r.ok === true) console.log(`OK    ${r.id}  ${r.title}`);
  else if (r.ok === false) { dead++; console.log(`FALHA ${r.id}  ${r.reason}  (${where})  https://youtu.be/${r.id}`); }
  else console.log(`?     ${r.id}  ${r.reason}`);
}
console.log(`\n${results.length} vídeos verificados, ${dead} fora do ar.`);
const unknown = results.filter((r) => r.ok === null).length;
if (unknown) console.log(`${unknown} não puderam ser verificados (rede).`);
process.exit(dead > 0 ? 1 : unknown > 0 ? 2 : 0);

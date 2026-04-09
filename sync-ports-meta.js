#!/usr/bin/env node
/**
 * sync-ports-meta.js
 * 
 * Lê todos os JSONs de /data/mare/, extrai station_id e station_name,
 * e atualiza o ports-meta.json com os IDs corretos + nivel_medio_m + coordenadas reais.
 * 
 * Uso: node sync-ports-meta.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data', 'mare');
const META_FILE = path.join(__dirname, 'data', 'ports-meta.json');

// Utilitário: parse de número brasileiro ("1,75" → 1.75)
function parseBR(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value.replace(',', '.'));
  return null;
}

// 1. Lê todos os JSONs da pasta data/mare
const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

const stationMap = {}; // station_name (upper) → metadados do JSON

for (const file of jsonFiles) {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  
  // Fix: substitui vírgulas decimais por pontos para JSON.parse funcionar
  const fixed = raw.replace(/:\s*(-?\d+),(\d+)/g, ': $1.$2');
  
  let data;
  try {
    data = JSON.parse(fixed);
  } catch (e) {
    console.warn(`⚠️  Erro ao parsear ${file}: ${e.message}`);
    continue;
  }

  const meta = data?.metadata;
  if (!meta?.station_name) {
    console.warn(`⚠️  ${file} sem station_name`);
    continue;
  }

  const key = meta.station_name.trim().toUpperCase();
  stationMap[key] = {
    station_id: meta.station_id || path.basename(file, '.json'),
    station_name: meta.station_name,
    latitude: parseBR(meta.latitude),
    longitude: parseBR(meta.longitude),
    nivel_medio_m: parseBR(meta.nivel_medio_m),
    tz_offset: meta.tz_offset ?? -3,
    total_eventos: data.events?.length ?? 0,
  };
}

console.log(`\n✅ ${Object.keys(stationMap).length} estações encontradas nos JSONs\n`);

// 2. Lê o ports-meta.json atual
const portsMeta = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));

// 3. Atualiza cada porto com os dados reais dos JSONs
let matched = 0;
let unmatched = [];

for (const porto of portsMeta) {
  const key = porto.station_name?.trim().toUpperCase();
  const found = stationMap[key];

  if (found) {
    porto.station_id = found.station_id;
    porto.latitude = found.latitude ?? porto.latitude;
    porto.longitude = found.longitude ?? porto.longitude;
    porto.nivel_medio_m = found.nivel_medio_m;
    porto.tz_offset = found.tz_offset;
    matched++;
    console.log(`✅ ${porto.slug} → ${found.station_id} (${found.station_name})`);
  } else {
    unmatched.push(porto.slug);
    console.warn(`❌ Sem match para: "${porto.station_name}" (${porto.slug})`);
  }
}

// 4. Identifica JSONs que não foram mapeados para nenhum porto
const usedIds = new Set(portsMeta.map(p => p.station_id));
const orphans = Object.values(stationMap).filter(s => !usedIds.has(s.station_id));

// 5. Salva o ports-meta.json atualizado
fs.writeFileSync(META_FILE, JSON.stringify(portsMeta, null, 2), 'utf-8');

console.log(`\n--- Resumo ---`);
console.log(`✅ Matched:   ${matched}/${portsMeta.length}`);
console.log(`❌ Unmatched: ${unmatched.length}`);
if (unmatched.length) console.log(`   → ${unmatched.join(', ')}`);
if (orphans.length) {
  console.log(`\n⚠️  JSONs sem porto correspondente no meta (${orphans.length}):`);
  orphans.forEach(o => console.log(`   ${o.station_id} — ${o.station_name}`));
}
console.log(`\n💾 ports-meta.json atualizado em ${META_FILE}\n`);

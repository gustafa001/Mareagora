const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data', 'mare');
const META_FILE = path.join(__dirname, 'data', 'ports-meta.json');

function parseBR(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value.replace(',', '.'));
  return null;
}

function normalize(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
}

const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
const stationMap = {};

// Mapeamentos manuais para casos onde o nome no JSON é muito diferente do meta
const manualMatches = {
  "PORTO DE MUCURIPE": ["porto-de-mucuripe-fortaleza"],
  "CAIS CODESA": ["porto-de-vitoria"],
  "PORTO DE AÇU -T-OIL": ["porto-do-acu"],
  "CAPITANIA DOS PORTOS DE SÃO PAULO": ["porto-de-santos", "guaruja", "sao-vicente", "praia-grande", "bertioga", "riviera-de-sao-lourenco", "mongagua", "itanhaem", "peruibe"],
  "BARRA DE PARANAGUÁ-CANAL DA GALHETA": ["barra-de-paranagua-galheta"],
  "PORTO DE PARANAGUÁ - CAIS OESTE": ["porto-de-paranagua"],
  "PRATICAGEM R. GRANDE": ["porto-do-rio-grande"],
  "CLUBE NÁUTICO CRUZEIRO DO SUL": ["porto-de-sao-francisco-do-sul"]
};

for (const file of jsonFiles) {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  const fixed = raw.replace(/:\s*(-?\d+),(\d+)/g, ': $1.$2');
  
  let data;
  try {
    data = JSON.parse(fixed);
  } catch (e) {
    continue;
  }

  const meta = data?.metadata || data?.metadados;
  if (!meta?.station_name) continue;

  const station_id = meta.station_id || path.basename(file, '.json');
  const station_name = meta.station_name;
  
  const info = {
    station_id,
    station_name,
    latitude: parseBR(meta.latitude),
    longitude: parseBR(meta.longitude),
    nivel_medio_m: parseBR(meta.nivel_medio_m),
    tz_offset: meta.tz_offset ?? -3,
    total_eventos: (data.events || data.eventos)?.length ?? 0,
  };

  stationMap[normalize(station_name)] = info;
}

const portsMeta = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
let matched = 0;
let unmatched = [];

for (const porto of portsMeta) {
  // Tenta match manual primeiro
  let found = null;
  for (const [stationName, slugs] of Object.entries(manualMatches)) {
    if (slugs.includes(porto.slug)) {
      found = stationMap[normalize(stationName)];
      break;
    }
  }

  // Se não encontrar manual, tenta match por station_name exato (normalizado)
  if (!found) found = stationMap[normalize(porto.station_name)];
  
  // Se não encontrar, tenta match pelo nome do porto
  if (!found) found = stationMap[normalize(porto.nome)];
  
  // Se ainda não encontrar, tenta ver se o station_name do JSON contém o nome curto ou vice-versa
  if (!found && porto.nome_curto) {
    const normShort = normalize(porto.nome_curto);
    for (const key in stationMap) {
      if (key.includes(normShort) || normShort.includes(key)) {
        found = stationMap[key];
        break;
      }
    }
  }

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
    console.warn(`❌ Sem match para: "${porto.nome}" / "${porto.station_name}" (${porto.slug})`);
  }
}

fs.writeFileSync(META_FILE, JSON.stringify(portsMeta, null, 2), 'utf-8');

console.log(`\n--- Resumo ---`);
console.log(`✅ Matched:   ${matched}/${portsMeta.length}`);
console.log(`❌ Unmatched: ${unmatched.length}`);
if (unmatched.length) console.log(`   → ${unmatched.join(', ')}`);

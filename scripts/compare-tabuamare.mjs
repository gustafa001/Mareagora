#!/usr/bin/env node
/**
 * scripts/compare-tabuamare.mjs
 *
 * Compara a tábua de maré da DHN que o MaréAgora já usa (data/mare/<id>.json)
 * com a API https://tabuamare.api.br (V2) e gera um relatório em Markdown + JSON.
 *
 * O que o script faz:
 *  1. Lista os portos da API (/harbor_names/{uf} + /harbors/{id}) e guarda as coordenadas.
 *  2. Casa cada estação DHN local com o porto da API mais próximo (distância máx. --max-km).
 *  3. Baixa um mês de tábua (/tabua-mare/{id}/{mês}/[1-31]) e compara cada evento
 *     (preamar/baixa-mar) da DHN com o evento mais próximo da API (até 120 min):
 *     diferença de horário (min) e de altura (m).
 *  4. Lista estações DHN sem par na API e portos da API sem par na DHN
 *     (candidatos a cobertura nova — conferir a origem dos dados antes de usar).
 *
 * Uso:
 *   node scripts/compare-tabuamare.mjs --probe            # salva respostas cruas p/ conferir o formato
 *   node scripts/compare-tabuamare.mjs                    # compara todas as estações (mês atual)
 *   node scripts/compare-tabuamare.mjs --uf sp,rj --month 11
 *   node scripts/compare-tabuamare.mjs --limit 5          # só as 5 primeiras estações (teste rápido)
 *
 * Opções:
 *   --uf sp,rj       limita estados (padrão: todos os 17 que a API lista)
 *   --month N        mês 1-12 (padrão: mês atual em America/Sao_Paulo)
 *   --limit N        máximo de estações DHN a comparar
 *   --max-km N       distância máxima para casar estação e porto (padrão 5)
 *   --delay MS       pausa entre chamadas (padrão: 4300 sem chave, 2700 com chave)
 *   --out ARQUIVO    relatório .md (padrão: ./tabuamare-compare.md; o JSON sai ao lado)
 *   --cache DIR      cache das respostas (padrão: <tmp>/tabuamare-cache) — permite retomar
 *   --no-cache       ignora o cache
 *   --probe          só busca amostras e salva em <cache>/probe-*.json
 *
 * Variáveis de ambiente:
 *   TABUAMARE_API_KEY  chave grátis (24 req/min, 32 mil/mês). Sem chave: 16 req/min por IP.
 *   TABUAMARE_BASE     base da API (padrão https://tabuamare.api.br/api/v2)
 *
 * Sem dependências externas (Node 18+).
 */

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const MARE_DIR = path.join(ROOT, 'data', 'mare');

const BASE = (process.env.TABUAMARE_BASE || 'https://tabuamare.api.br/api/v2').replace(/\/$/, '');
const API_KEY = process.env.TABUAMARE_API_KEY || '';

const ALL_UFS = ['al', 'ap', 'ba', 'ce', 'es', 'ma', 'pa', 'pb', 'pe', 'pi', 'pr', 'rj', 'rn', 'rs', 'sc', 'se', 'sp'];
const MATCH_WINDOW_MIN = 120; // janela para casar um evento DHN com um evento da API

// Limiares do veredito (média das diferenças absolutas por estação)
const OK_TIME_MIN = 10;
const OK_HEIGHT_M = 0.1;
const BAD_TIME_MIN = 30;
const BAD_HEIGHT_M = 0.3;

// ---------- args ----------
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else { args[key] = next; i++; }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const UFS = args.uf ? String(args.uf).toLowerCase().split(',').map(s => s.trim()).filter(Boolean) : ALL_UFS;
const MAX_KM = Number(args['max-km'] ?? 5);
const DELAY = Number(args.delay ?? (API_KEY ? 2700 : 4300));
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const OUT_MD = path.resolve(String(args.out || 'tabuamare-compare.md'));
const OUT_JSON = OUT_MD.replace(/\.md$/i, '') + '.json';
const CACHE_DIR = path.resolve(String(args.cache || path.join(os.tmpdir(), 'tabuamare-cache')));
const USE_CACHE = !args['no-cache'];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function currentMonthSP() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit' }).format(new Date());
  return Number(parts.split('-')[1]);
}
const MONTH = args.month ? Number(args.month) : currentMonthSP();
if (!(MONTH >= 1 && MONTH <= 12)) { console.error('--month deve estar entre 1 e 12'); process.exit(1); }

// ---------- HTTP com cache, limite de taxa e retry ----------
let lastCall = 0;
let calls = 0;

async function apiGet(pathname) {
  const url = BASE + pathname;
  const key = crypto.createHash('sha1').update(url).digest('hex').slice(0, 16);
  const cacheFile = path.join(CACHE_DIR, `${key}.json`);

  if (USE_CACHE) {
    try { return JSON.parse(await fs.readFile(cacheFile, 'utf8')); } catch { /* sem cache */ }
  }

  const headers = { Accept: 'application/json' };
  if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`;

  for (let attempt = 1; attempt <= 4; attempt++) {
    const wait = DELAY - (Date.now() - lastCall);
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();
    calls++;
    let res;
    try {
      res = await fetch(url, { headers });
    } catch (e) {
      if (attempt === 4) throw new Error(`Falha de rede em ${pathname}: ${e.message}`);
      await sleep(2000 * attempt);
      continue;
    }
    if (res.status === 429) {
      const ra = Number(res.headers.get('retry-after')) || 30;
      console.warn(`  429 em ${pathname}; aguardando ${ra}s (tentativa ${attempt}/4)`);
      await sleep(ra * 1000);
      continue;
    }
    if (res.status === 404) return { data: [], total: 0, notFound: true };
    if (!res.ok) {
      if (attempt === 4 || res.status < 500) {
        throw new Error(`HTTP ${res.status} em ${pathname}: ${(await res.text()).slice(0, 200)}`);
      }
      await sleep(2000 * attempt);
      continue;
    }
    const json = await res.json();
    if (USE_CACHE) {
      await fs.mkdir(CACHE_DIR, { recursive: true });
      await fs.writeFile(cacheFile, JSON.stringify(json));
    }
    return json;
  }
  throw new Error(`Esgotou tentativas em ${pathname}`);
}

// ---------- utilidades ----------
function norm(s) {
  return String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function haversineKm(a, b) {
  const R = 6371;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** Aceita "-9.68", "-9,68" ou "09° 41' S" (com direção opcional). */
function parseCoord(value, direction) {
  if (value === undefined || value === null || value === '') return NaN;
  const s = String(value).trim();
  const plain = Number(s.replace(',', '.'));
  if (Number.isFinite(plain) && /^-?\d+([.,]\d+)?$/.test(s)) return plain;
  const m = s.match(/(\d+)[°º\s]+(\d+)?['′\s]*([\d.,]+)?["″]?\s*([NSEWOLnsewol])?/);
  if (!m) return NaN;
  let v = Number(m[1]) + (Number(m[2] || 0) / 60) + (Number((m[3] || '0').replace(',', '.')) / 3600);
  const dir = (m[4] || direction || '').toUpperCase();
  if (dir === 'S' || dir === 'W' || dir === 'O') v = -v;
  return v;
}

const STOP = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'porto', 'terminal', 'api']);
function nameTokens(s) { return new Set(norm(s).split(' ').filter(t => t.length > 1 && !STOP.has(t))); }
/** Coeficiente de sobreposição de palavras (0–1) entre dois nomes. */
function nameSimilarity(a, b) {
  const A = nameTokens(a), B = nameTokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / Math.min(A.size, B.size);
}
/** Casamento confiável = bem perto (≤ 0,8 km) ou nomes parecidos. Senão pode ser outra estação da mesma baía. */
function matchConfidence(km, sim) {
  return km <= 0.8 || sim >= 0.5 ? 'alta' : 'baixa';
}

function median(arr) {
  if (!arr.length) return NaN;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
const mean = arr => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN);
const pct = (arr, p) => {
  if (!arr.length) return NaN;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)];
};
const fmt = (n, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : '–');

/** minutos desde epoch tratando "YYYY-MM-DD" + "HH:MM" como horário local ingênuo (sem fuso). */
function toMinutes(y, mo, d, h, mi) {
  return Date.UTC(y, mo - 1, d, h, mi) / 60000;
}

// ---------- DHN local ----------
async function loadDhnStations() {
  const files = (await fs.readdir(MARE_DIR)).filter(f => /^\d+\.json$/.test(f));
  let meta = [];
  try { meta = JSON.parse(await fs.readFile(path.join(ROOT, 'data', 'ports-meta.json'), 'utf8')); } catch { /* opcional */ }
  const ufById = new Map(meta.map(m => [String(m.station_id), String(m.estado || '').toLowerCase()]));

  const stations = [];
  for (const f of files) {
    const raw = JSON.parse(await fs.readFile(path.join(MARE_DIR, f), 'utf8'));
    const m = raw.metadata || {};
    if (!Array.isArray(raw.events) || !Number.isFinite(m.latitude) || !Number.isFinite(m.longitude)) continue;
    stations.push({
      id: String(m.station_id ?? f.replace('.json', '')),
      name: m.station_name ?? f,
      lat: m.latitude,
      lon: m.longitude,
      meanLevelM: m.nivel_medio_m,
      tz: m.tz_offset,
      uf: ufById.get(String(m.station_id)) || '',
      events: raw.events,
    });
  }
  return stations;
}

// ---------- API: descoberta de portos ----------
async function discoverHarbors() {
  const harbors = [];
  for (const uf of UFS) {
    const names = await apiGet(`/harbor_names/${uf}`);
    const list = Array.isArray(names.data) ? names.data : [];
    console.log(`[${uf.toUpperCase()}] ${list.length} portos na API`);
    for (const h of list) {
      let lat = NaN, lon = NaN, tz = '';
      try {
        const det = await apiGet(`/harbors/${encodeURIComponent(h.id)}`);
        const d = Array.isArray(det.data) ? det.data[0] : det.data;
        const g = Array.isArray(d?.geo_location) ? d.geo_location[0] : d?.geo_location;
        lat = parseCoord(g?.lat, g?.lat_direction);
        lon = parseCoord(g?.lng, g?.lng_direction);
        if (!Number.isFinite(lat)) lat = parseCoord(g?.decimal_lat, g?.lat_direction);
        if (!Number.isFinite(lon)) lon = parseCoord(g?.decimal_lng, g?.lng_direction);
        tz = d?.timezone ?? '';
      } catch (e) {
        console.warn(`  sem detalhe de ${h.id} (${h.harbor_name}): ${e.message}`);
      }
      harbors.push({ id: h.id, uf, name: h.harbor_name, institution: h.data_collection_institution, lat, lon, tz });
    }
  }
  return harbors;
}

// ---------- API: tábua do mês ----------
async function fetchApiMonth(harborId) {
  const res = await apiGet(`/tabua-mare/${encodeURIComponent(harborId)}/${MONTH}/[1-31]`);
  const item = Array.isArray(res.data) ? res.data[0] : res.data;
  if (!item) return null;
  const events = [];
  let levels = [];
  for (const mo of item.months || []) {
    if (Number(mo.month) !== MONTH) continue;
    for (const day of mo.days || []) {
      for (const h of day.hours || []) {
        const [hh, mm] = String(h.hour).split(':').map(Number);
        if (!Number.isFinite(hh) || !Number.isFinite(mm)) continue;
        const level = Number(h.level);
        if (!Number.isFinite(level)) continue;
        levels.push(level);
        events.push({ y: item.year, mo: Number(mo.month), d: Number(day.day), hh, mm, level });
      }
    }
  }
  // Se os níveis parecem estar em cm (> 15), converte para metros.
  const unit = levels.length && Math.max(...levels) > 15 ? 'cm' : 'm';
  const scale = unit === 'cm' ? 0.01 : 1;
  return {
    year: item.year,
    timezone: item.timezone,
    institution: item.data_collection_institution,
    meanLevel: item.mean_level,
    unit,
    events: events.map(e => ({ t: toMinutes(e.y, e.mo, e.d, e.hh, e.mm), h: e.level * scale })),
  };
}

// ---------- comparação ----------
function compareEvents(dhnEvents, apiEvents) {
  const used = new Set();
  const dts = [];
  const dhs = [];
  let missing = 0;

  for (const d of dhnEvents) {
    let best = -1, bestAbs = Infinity;
    for (let i = 0; i < apiEvents.length; i++) {
      if (used.has(i)) continue;
      const diff = Math.abs(apiEvents[i].t - d.t);
      if (diff < bestAbs) { bestAbs = diff; best = i; }
    }
    if (best >= 0 && bestAbs <= MATCH_WINDOW_MIN) {
      used.add(best);
      dts.push(apiEvents[best].t - d.t);       // + = API depois da DHN
      dhs.push(apiEvents[best].h - d.h);       // + = API mais alta
    } else {
      missing++;
    }
  }
  const absT = dts.map(Math.abs);
  const absH = dhs.map(Math.abs);
  return {
    nDhn: dhnEvents.length,
    nApi: apiEvents.length,
    matched: dts.length,
    missing,
    extra: apiEvents.length - used.size,
    meanAbsMin: mean(absT),
    p95AbsMin: pct(absT, 95),
    maxAbsMin: absT.length ? Math.max(...absT) : NaN,
    medianSignedMin: median(dts),
    meanAbsM: mean(absH),
    maxAbsM: absH.length ? Math.max(...absH) : NaN,
    medianSignedM: median(dhs),
  };
}

function verdict(c) {
  if (!c.matched) return 'SEM DADOS';
  const cover = c.matched / c.nDhn;
  if (cover < 0.8 || c.meanAbsMin > BAD_TIME_MIN || c.meanAbsM > BAD_HEIGHT_M) return 'DIVERGENTE';
  if (cover < 0.95 || c.meanAbsMin > OK_TIME_MIN || c.meanAbsM > OK_HEIGHT_M) return 'ATENÇÃO';
  return 'OK';
}

// ---------- probe ----------
async function runProbe() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const uf = UFS[0];
  const out = {};
  out.states = await apiGet('/states');
  out.harbor_names = await apiGet(`/harbor_names/${uf}`);
  const first = out.harbor_names.data?.[0];
  if (first) {
    out.harbors = await apiGet(`/harbors/${encodeURIComponent(first.id)}`);
    out.tabua_mare = await apiGet(`/tabua-mare/${encodeURIComponent(first.id)}/${MONTH}/[1-3]`);
    const g = out.harbors?.data?.[0]?.geo_location?.[0];
    const lat = parseCoord(g?.lat, g?.lat_direction), lon = parseCoord(g?.lng, g?.lng_direction);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      try { out.nearested_harbor = await apiGet(`/nearested-harbor/${uf}/[${lat},${lon}]`); } catch (e) { out.nearested_harbor = { error: e.message }; }
    }
  }
  try { out.usage = await apiGet('/usage'); } catch (e) { out.usage = { error: e.message }; }
  const file = path.join(CACHE_DIR, `probe-${uf}.json`);
  await fs.writeFile(file, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2).slice(0, 4000));
  console.log(`\nAmostras completas em ${file}`);
}

// ---------- main ----------
async function main() {
  if (args.probe) return runProbe();

  console.log(`API: ${BASE} | mês: ${MONTH} | estados: ${UFS.join(',')} | pausa: ${DELAY} ms | chave: ${API_KEY ? 'sim' : 'não'}`);
  let stations = await loadDhnStations();
  stations = stations.filter(s => !args.uf || !s.uf || UFS.includes(s.uf)).slice(0, LIMIT);
  console.log(`${stations.length} estações DHN em data/mare/`);

  const harbors = (await discoverHarbors()).filter(h => Number.isFinite(h.lat) && Number.isFinite(h.lon));
  console.log(`${harbors.length} portos da API com coordenadas\n`);
  if (!harbors.length) throw new Error('Nenhum porto da API com coordenadas válidas — rode com --probe e confira o formato.');

  const results = [];
  const unmatchedDhn = [];
  const usedHarbors = new Set();

  for (const st of stations) {
    let best = null, bestKm = Infinity;
    for (const h of harbors) {
      const km = haversineKm({ lat: st.lat, lon: st.lon }, { lat: h.lat, lon: h.lon });
      if (km < bestKm) { bestKm = km; best = h; }
    }
    if (!best || bestKm > MAX_KM) {
      unmatchedDhn.push({ id: st.id, name: st.name, nearestKm: Number.isFinite(bestKm) ? bestKm : null, nearest: best?.name ?? null });
      continue;
    }
    usedHarbors.add(`${best.uf}:${best.id}`);
    const sim = nameSimilarity(st.name, best.name);
    const conf = matchConfidence(bestKm, sim);

    console.log(`[${st.id}] ${st.name}  ↔  ${best.name} (${best.uf.toUpperCase()}/${best.id}, ${fmt(bestKm, 2)} km${conf === 'baixa' ? ', CASAMENTO DUVIDOSO' : ''})`);
    let api;
    try { api = await fetchApiMonth(best.id); } catch (e) {
      console.warn(`  erro: ${e.message}`);
      results.push({ station: st.id, name: st.name, harbor: best.name, harborId: best.id, km: bestKm, confidence: conf, error: e.message });
      continue;
    }
    if (!api || !api.events.length) {
      results.push({ station: st.id, name: st.name, harbor: best.name, harborId: best.id, km: bestKm, confidence: conf, error: 'API sem eventos no mês' });
      continue;
    }
    const dhn = st.events
      .filter(e => {
        const [y, mo] = e.dt.slice(0, 7).split('-').map(Number);
        return y === api.year && mo === MONTH;
      })
      .map(e => ({ t: toMinutes(+e.dt.slice(0, 4), +e.dt.slice(5, 7), +e.dt.slice(8, 10), +e.dt.slice(11, 13), +e.dt.slice(14, 16)), h: e.height_m }));
    if (!dhn.length) {
      results.push({ station: st.id, name: st.name, harbor: best.name, harborId: best.id, km: bestKm, confidence: conf, error: `DHN local sem eventos em ${MONTH}/${api.year}` });
      continue;
    }
    const cmp = compareEvents(dhn, api.events);
    results.push({
      station: st.id, name: st.name, harbor: best.name, harborId: best.id, uf: best.uf, km: bestKm, nameSim: sim, confidence: conf,
      year: api.year, institution: api.institution, apiTimezone: api.timezone, dhnTz: st.tz, unit: api.unit,
      meanLevelDhn: st.meanLevelM, meanLevelApi: api.meanLevel,
      ...cmp, verdict: verdict(cmp),
    });
  }

  const apiOnly = harbors.filter(h => !usedHarbors.has(`${h.uf}:${h.id}`));

  // ----- relatório -----
  const ok = results.filter(r => r.verdict === 'OK').length;
  const warn = results.filter(r => r.verdict === 'ATENÇÃO').length;
  const bad = results.filter(r => r.verdict === 'DIVERGENTE').length;
  const err = results.filter(r => r.error).length;
  const dubious = results.filter(r => r.confidence === 'baixa').length;

  const lines = [];
  lines.push(`# Comparação DHN local × tabuamare.api.br`);
  lines.push('');
  lines.push(`- Gerado em: ${new Date().toISOString()}`);
  lines.push(`- Mês comparado: ${MONTH} | janela de casamento: ±${MATCH_WINDOW_MIN} min | chamadas à API: ${calls}`);
  lines.push(`- Estações DHN: ${stations.length} | casadas com a API (≤ ${MAX_KM} km): ${results.length} | sem par: ${unmatchedDhn.length}`);
  lines.push(`- Veredito: **${ok} OK**, **${warn} ATENÇÃO**, **${bad} DIVERGENTE**, ${err} com erro/sem dados`);
  if (dubious) lines.push(`- ⚠️ ${dubious} casamento(s) de baixa confiança (> 0,8 km e nomes diferentes): podem ser OUTRA estação da mesma baía; não conclua divergência sem conferir.`);
  lines.push(`- Critérios (média por estação): OK ≤ ${OK_TIME_MIN} min e ≤ ${OK_HEIGHT_M} m; DIVERGENTE > ${BAD_TIME_MIN} min ou > ${BAD_HEIGHT_M} m ou < 80% dos eventos casados.`);
  lines.push(`- "Δt mediano" > 0 significa API depois da DHN; valores constantes e múltiplos de 60 sugerem diferença de fuso.`);
  lines.push('');
  lines.push('## Por estação');
  lines.push('');
  lines.push('| Estação DHN | Porto API | km | Eventos DHN/API | Casados | Δt médio (min) | Δt p95 | Δt máx | Δt mediano | Δh médio (m) | Δh máx | Casamento | Veredito |');
  lines.push('|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|');
  for (const r of results.filter(x => !x.error).sort((a, b) => (b.meanAbsMin || 0) - (a.meanAbsMin || 0))) {
    lines.push(`| ${r.station} ${r.name} | ${r.harbor} (${r.uf.toUpperCase()}/${r.harborId}) | ${fmt(r.km, 1)} | ${r.nDhn}/${r.nApi} | ${r.matched} | ${fmt(r.meanAbsMin)} | ${fmt(r.p95AbsMin, 0)} | ${fmt(r.maxAbsMin, 0)} | ${fmt(r.medianSignedMin, 0)} | ${fmt(r.meanAbsM, 2)} | ${fmt(r.maxAbsM, 2)} | ${r.confidence} | ${r.verdict} |`);
  }
  if (err) {
    lines.push('');
    lines.push('## Casadas mas sem comparação');
    lines.push('');
    for (const r of results.filter(x => x.error)) lines.push(`- ${r.station} ${r.name} ↔ ${r.harbor} (${r.harborId}): ${r.error}`);
  }
  lines.push('');
  lines.push(`## Estações DHN sem porto na API (≤ ${MAX_KM} km)`);
  lines.push('');
  if (!unmatchedDhn.length) lines.push('Nenhuma.');
  for (const u of unmatchedDhn) lines.push(`- ${u.id} ${u.name} — mais próximo: ${u.nearest ?? '–'} (${fmt(u.nearestKm, 1)} km)`);
  lines.push('');
  lines.push(`## Portos da API sem estação DHN local (${apiOnly.length})`);
  lines.push('');
  lines.push('Candidatos a cobertura nova. Antes de usar, confirme a origem dos dados (campo `data_collection_institution`) e a permissão de uso comercial.');
  lines.push('');
  lines.push('| UF | ID | Porto | Instituição |');
  lines.push('|---|---|---|---|');
  for (const h of apiOnly) lines.push(`| ${h.uf.toUpperCase()} | ${h.id} | ${h.name} | ${h.institution ?? '–'} |`);
  lines.push('');

  await fs.writeFile(OUT_MD, lines.join('\n'));
  await fs.writeFile(OUT_JSON, JSON.stringify({ month: MONTH, results, unmatchedDhn, apiOnly }, null, 2));
  console.log(`\nVeredito: ${ok} OK, ${warn} ATENÇÃO, ${bad} DIVERGENTE, ${err} erro/sem dados`);
  console.log(`Relatório: ${OUT_MD}\nDetalhes:  ${OUT_JSON}`);
}

main().catch(e => { console.error('\nErro:', e.message); process.exit(1); });

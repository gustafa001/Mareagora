import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DHN_BASE = 'https://pam.dhn.mar.mil.br/tabuamares/out_json';
const OUTPUT = path.join(__dirname, '..', 'data', 'mare');
const ANO = new Date().getFullYear();
const delay = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  await fs.mkdir(OUTPUT, { recursive: true });
  console.log(`🌊 Baixando dados DHN ${ANO}...\n`);

  const stations = await fetch(`${DHN_BASE}/${ANO}/stations.json`).then(r => r.json());
  await fs.writeFile(path.join(OUTPUT, 'stations.json'), JSON.stringify(stations, null, 2));
  console.log(`📋 ${stations.length} estações encontradas\n`);

  let ok = 0, erros = 0;
  for (const s of stations) {
    try {
      const data = await fetch(`${DHN_BASE}/${ANO}/${s.id}.json`).then(r => r.json());
      await fs.writeFile(path.join(OUTPUT, `${s.id}.json`), JSON.stringify(data, null, 2));
      console.log(`✅ [${s.id}] ${s.name}`);
      ok++;
    } catch (e) {
      console.error(`❌ [${s.id}] ${s.name}: ${e.message}`);
      erros++;
    }
    await delay(300);
  }

  console.log(`\n✅ ${ok} portos OK, ${erros} erros`);
  console.log(`📁 Dados em data/mare/`);
}

main().catch(console.error);

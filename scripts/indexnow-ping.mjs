const SITEMAPS = [
  "https://mareagora.com.br/sitemap/index.xml",
  "https://mareagora.com.br/sitemap/praias.xml",
  "https://mareagora.com.br/sitemap/guia-praias.xml",
  "https://mareagora.com.br/sitemap/portos.xml",
  "https://mareagora.com.br/sitemap/estados.xml",
  "https://mareagora.com.br/sitemap/blog.xml",
  "https://mareagora.com.br/sitemap/mundo.xml",
  "https://mareagora.com.br/sitemap/tide-en.xml",
];

const KEY = process.argv[2] ?? process.env.INDEXNOW_KEY;
const DOMAIN = "mareagora.com.br";

if (!KEY) {
  console.error("Chave IndexNow nao informada. Use: node scripts/indexnow-ping.mjs <key> [sitemap1 ...]");
  process.exit(1);
}

const sitemaps = process.argv.slice(3).length > 0 ? process.argv.slice(3) : SITEMAPS;

async function baixarSitemap(url) {
  const res = await fetch(url, { headers: { "user-agent": "indexnow-ping" } });
  if (!res.ok) {
    console.error(`  aviso: falha ao baixar ${url} (${res.status})`);
    return [];
  }
  const xml = await res.text();
  if (xml.includes("<sitemapindex")) {
    const filhos = [...xml.matchAll(/<sitemap>\s*<loc>(.*?)<\/loc>/gs)].map((m) => m[1]);
    let urls = [];
    for (const filho of filhos) {
      urls = urls.concat(await baixarSitemap(filho));
    }
    return urls;
  }
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

const todos = [];
for (const s of sitemaps) {
  process.stdout.write(`Lendo ${s}... `);
  const urls = await baixarSitemap(s);
  todos.push(...urls);
  console.log(`${urls.length} URLs.`);
}

const urlList = [...new Set(todos)].filter((u) => u.startsWith(`https://${DOMAIN}`));
if (urlList.length === 0) {
  console.error("Nenhuma URL encontrada.");
  process.exit(1);
}
console.log(`\n${urlList.length} URLs unicas do dominio.`);

const tamanhoLote = 10000;
let ok = true;
for (let i = 0; i < urlList.length; i += tamanhoLote) {
  const lote = urlList.slice(i, i + tamanhoLote);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: DOMAIN, key: KEY, urlList: lote }),
  });
  console.log(`Lote ${i / tamanhoLote + 1} (${lote.length} URLs) -> ${res.status} ${res.statusText}`);
  if (!res.ok) {
    ok = false;
    console.error((await res.text()).slice(0, 500));
  }
}
if (!ok) process.exit(1);
console.log("Ping enviado com sucesso.");

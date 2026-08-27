/**
 * scripts/gsc-top-queries.ts
 *
 * Exporta as top queries do Google Search Console para um site.
 *
 * Uso:
 *   tsx scripts/gsc-top-queries.ts --site sc-domain:mareagora.com.br --days 90 --limit 50
 *
 * Requer:
 *   SERVICE_ACCOUNT_JSON — JSON da service account Google Cloud com acesso ao GSC
 *
 * Saída:
 *   reports/gsc-top-queries.csv
 *   reports/gsc-top-queries.md
 */

import { google } from 'googleapis';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

interface Args {
  site: string;
  days: number;
  limit: number;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = {
    site: 'sc-domain:mareagora.com.br',
    days: 90,
    limit: 50,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--site' && args[i + 1]) parsed.site = args[++i];
    if (args[i] === '--days' && args[i + 1]) parsed.days = Number(args[++i]);
    if (args[i] === '--limit' && args[i + 1]) parsed.limit = Number(args[++i]);
  }

  return parsed;
}

function getAuth() {
  const raw = process.env.SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.error('❌ SERVICE_ACCOUNT_JSON não definido.');
    console.error('   Crie uma service account no Google Cloud, conceda acesso no GSC,');
    console.error('   e defina a variável de ambiente com o JSON completo.');
    process.exit(1);
  }

  try {
    const credentials = JSON.parse(raw);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
  } catch (e) {
    console.error('❌ SERVICE_ACCOUNT_JSON inválido:', e);
    process.exit(1);
  }
}

function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

interface QueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

async function fetchQueries(auth: ReturnType<typeof getAuth>, site: string, startDate: string, endDate: string, limit: number): Promise<QueryRow[]> {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: site,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: limit,
      dataState: 'final',
    },
  });

  const rows = res.data.rows ?? [];
  return rows.map(row => ({
    query: (row.keys?.[0] as string) ?? '',
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  }));
}

function toCsv(rows: QueryRow[]): string {
  const header = 'query;cliques;impressoes;ctr;posicao';
  const lines = rows.map(r =>
    `"${r.query}";${r.clicks};${r.impressions};${(r.ctr * 100).toFixed(2)}%;${r.position.toFixed(1)}`
  );
  return [header, ...lines].join('\n');
}

function toMarkdown(rows: QueryRow[], site: string, days: number): string {
  const lines = [
    `# Top Queries — ${site}`,
    '',
    `Período: ${formatDate(days)} a ${formatDate(0)} (${days} dias)`,
    '',
    '| # | Query | Cliques | Impressões | CTR | Posição |',
    '|---|-------|---------|------------|-----|---------|',
  ];

  rows.forEach((r, i) => {
    lines.push(`| ${i + 1} | ${r.query} | ${r.clicks.toLocaleString('pt-BR')} | ${r.impressions.toLocaleString('pt-BR')} | ${(r.ctr * 100).toFixed(1)}% | ${r.position.toFixed(1)} |`);
  });

  lines.push('', `Gerado em ${new Date().toISOString()}`);
  return lines.join('\n');
}

async function main() {
  const args = parseArgs();
  console.log(`📊 GSC Top Queries`);
  console.log(`   Site: ${args.site}`);
  console.log(`   Período: ${args.days} dias`);
  console.log(`   Limite: ${args.limit} queries`);
  console.log();

  const auth = getAuth();
  const startDate = formatDate(args.days);
  const endDate = formatDate(1); // ontem

  console.log(`   Buscando dados de ${startDate} a ${endDate}...`);
  const rows = await fetchQueries(auth, args.site, startDate, endDate, args.limit);

  if (rows.length === 0) {
    console.log('   ⚠️ Nenhuma query encontrada. Verifique se a service account tem acesso ao site no GSC.');
    return;
  }

  console.log(`   ✅ ${rows.length} queries encontradas`);

  const reportsDir = resolve('./reports');
  mkdirSync(reportsDir, { recursive: true });

  const csvPath = resolve(reportsDir, 'gsc-top-queries.csv');
  const mdPath = resolve(reportsDir, 'gsc-top-queries.md');

  writeFileSync(csvPath, toCsv(rows), 'utf-8');
  writeFileSync(mdPath, toMarkdown(rows, args.site, args.days), 'utf-8');

  console.log(`   📄 CSV: ${csvPath}`);
  console.log(`   📄 MD:  ${mdPath}`);
}

main().catch(e => {
  console.error('❌ Erro:', e.message);
  process.exit(1);
});

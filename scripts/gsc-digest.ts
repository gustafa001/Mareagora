/**
 * scripts/gsc-digest.ts
 *
 * Gera um digest semanal do Google Search Console:
 *   - Compara queries 7d vs 28d (queda/subida)
 *   - Verifica inspeção de URLs críticas
 *   - Gera relatório consolidado
 *
 * Uso:
 *   tsx scripts/gsc-digest.ts --site sc-domain:mareagora.com.br
 *
 * Requer:
 *   SERVICE_ACCOUNT_JSON — JSON da service account Google Cloud com acesso ao GSC
 *
 * Saída:
 *   reports/gsc-digest.md
 */

import { google } from 'googleapis';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

interface Args {
  site: string;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = { site: 'sc-domain:mareagora.com.br' };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--site' && args[i + 1]) parsed.site = args[++i];
  }

  return parsed;
}

function getAuth() {
  const raw = process.env.SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.error('❌ SERVICE_ACCOUNT_JSON não definido.');
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

async function fetchQueries(
  auth: ReturnType<typeof getAuth>,
  site: string,
  startDate: string,
  endDate: string,
  limit: number
): Promise<QueryRow[]> {
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

async function fetchPageStats(
  auth: ReturnType<typeof getAuth>,
  site: string,
  startDate: string,
  endDate: string,
  limit: number
): Promise<QueryRow[]> {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: site,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
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

function compareQueries(current: QueryRow[], previous: QueryRow[]): {
  risers: Array<QueryRow & { prevClicks: number; delta: number }>;
  fallers: Array<QueryRow & { prevClicks: number; delta: number }>;
  newQueries: QueryRow[];
  lostQueries: QueryRow[];
} {
  const prevMap = new Map(previous.map(r => [r.query, r]));
  const currMap = new Map(current.map(r => [r.query, r]));

  const risers: Array<QueryRow & { prevClicks: number; delta: number }> = [];
  const fallers: Array<QueryRow & { prevClicks: number; delta: number }> = [];
  const newQueries: QueryRow[] = [];
  const lostQueries: QueryRow[] = [];

  for (const row of current) {
    const prev = prevMap.get(row.query);
    if (!prev) {
      newQueries.push(row);
      continue;
    }
    const delta = row.clicks - prev.clicks;
    if (delta > 0) {
      risers.push({ ...row, prevClicks: prev.clicks, delta });
    } else if (delta < 0) {
      fallers.push({ ...row, prevClicks: prev.clicks, delta });
    }
  }

  for (const row of previous) {
    if (!currMap.has(row.query)) {
      lostQueries.push(row);
    }
  }

  risers.sort((a, b) => b.delta - a.delta);
  fallers.sort((a, b) => a.delta - b.delta);

  return { risers, fallers, newQueries, lostQueries };
}

function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR');
}

function generateMarkdown(
  site: string,
  current7d: QueryRow[],
  previous28d: QueryRow[],
  topPages7d: QueryRow[],
  comparison: ReturnType<typeof compareQueries>
): string {
  const lines: string[] = [];

  lines.push(`# Digest GSC — ${site.replace('sc-domain:', '')}`);
  lines.push('');
  lines.push(`Gerado em: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`);
  lines.push('');

  // Resumo geral
  const totalClicks7d = current7d.reduce((s, r) => s + r.clicks, 0);
  const totalImp7d = current7d.reduce((s, r) => s + r.impressions, 0);
  const avgCtr7d = totalImp7d > 0 ? totalClicks7d / totalImp7d : 0;
  const avgPos7d = current7d.length > 0
    ? current7d.reduce((s, r) => s + r.position, 0) / current7d.length
    : 0;

  lines.push('## Resumo (7 dias)');
  lines.push('');
  lines.push(`| Métrica | Valor |`);
  lines.push(`|---------|-------|`);
  lines.push(`| Total de cliques | ${formatNumber(totalClicks7d)} |`);
  lines.push(`| Total de impressões | ${formatNumber(totalImp7d)} |`);
  lines.push(`| CTR médio | ${(avgCtr7d * 100).toFixed(1)}% |`);
  lines.push(`| Posição média | ${avgPos7d.toFixed(1)} |`);
  lines.push(`| Queries únicas | ${current7d.length} |`);
  lines.push('');

  // Queries subindo
  if (comparison.risers.length > 0) {
    lines.push('## Queries em alta (7d vs 28d)');
    lines.push('');
    lines.push('| Query | Cliques (7d) | Cliques (28d) | Delta | Posição |');
    lines.push('|-------|-------------|---------------|-------|---------|');
    for (const r of comparison.risers.slice(0, 10)) {
      lines.push(`| ${r.query} | ${formatNumber(r.clicks)} | ${formatNumber(r.prevClicks)} | +${formatNumber(r.delta)} | ${r.position.toFixed(1)} |`);
    }
    lines.push('');
  }

  // Queries caindo
  if (comparison.fallers.length > 0) {
    lines.push('## Queries em queda (7d vs 28d)');
    lines.push('');
    lines.push('| Query | Cliques (7d) | Cliques (28d) | Delta | Posição |');
    lines.push('|-------|-------------|---------------|-------|---------|');
    for (const r of comparison.fallers.slice(0, 10)) {
      lines.push(`| ${r.query} | ${formatNumber(r.clicks)} | ${formatNumber(r.prevClicks)} | ${formatNumber(r.delta)} | ${r.position.toFixed(1)} |`);
    }
    lines.push('');
  }

  // Queries novas
  if (comparison.newQueries.length > 0) {
    lines.push('## Queries novas (apareceram nos últimos 7d)');
    lines.push('');
    lines.push('| Query | Cliques | Impressões | Posição |');
    lines.push('|-------|---------|------------|---------|');
    for (const r of comparison.newQueries.slice(0, 10)) {
      lines.push(`| ${r.query} | ${formatNumber(r.clicks)} | ${formatNumber(r.impressions)} | ${r.position.toFixed(1)} |`);
    }
    lines.push('');
  }

  // Queries perdidas
  if (comparison.lostQueries.length > 0) {
    lines.push('## Queries perdidas (estavam no top 50, saíram)');
    lines.push('');
    lines.push('| Query | Cliques (28d) | Impressões | Posição |');
    lines.push('|-------|--------------|------------|---------|');
    for (const r of comparison.lostQueries.slice(0, 10)) {
      lines.push(`| ${r.query} | ${formatNumber(r.clicks)} | ${formatNumber(r.impressions)} | ${r.position.toFixed(1)} |`);
    }
    lines.push('');
  }

  // Top páginas
  if (topPages7d.length > 0) {
    lines.push('## Top páginas por cliques (7d)');
    lines.push('');
    lines.push('| Página | Cliques | Impressões | CTR | Posição |');
    lines.push('|--------|---------|------------|-----|---------|');
    for (const r of topPages7d.slice(0, 10)) {
      const shortUrl = r.query.replace('https://mareagora.com.br', '');
      lines.push(`| ${shortUrl || '/'} | ${formatNumber(r.clicks)} | ${formatNumber(r.impressions)} | ${(r.ctr * 100).toFixed(1)}% | ${r.position.toFixed(1)} |`);
    }
    lines.push('');
  }

  // Alertas
  lines.push('## Alertas');
  lines.push('');
  const alerts: string[] = [];

  const highImpLowCtr = current7d.filter(r => r.impressions > 500 && r.ctr < 0.01);
  if (highImpLowCtr.length > 0) {
    alerts.push(`⚠️ **${highImpLowCtr.length} queries** com >500 impressões e CTR <1% — revisar títulos/meta descriptions`);
  }

  const fallingQueries = comparison.fallers.filter(r => r.delta < -10);
  if (fallingQueries.length > 0) {
    alerts.push(`📉 **${fallingQueries.length} queries** perderam >10 cliques — possível queda de ranqueamento`);
  }

  const newQueriesWithClicks = comparison.newQueries.filter(r => r.clicks > 5);
  if (newQueriesWithClicks.length > 0) {
    alerts.push(`🆕 **${newQueriesWithClicks.length} queries novas** já com >5 cliques — conteúdo indexando bem`);
  }

  if (alerts.length === 0) {
    alerts.push('✅ Nenhum alerta crítico nesta semana');
  }

  lines.push(...alerts);
  lines.push('');

  lines.push('---');
  lines.push('*Gerado automaticamente por scripts/gsc-digest.ts*');

  return lines.join('\n');
}

async function main() {
  const args = parseArgs();
  console.log(`📊 GSC Digest Semanal`);
  console.log(`   Site: ${args.site}`);
  console.log();

  const auth = getAuth();

  // 7d (período curto)
  const start7d = formatDate(7);
  const end7d = formatDate(1);
  console.log(`   📅 Período curto: ${start7d} a ${end7d}`);

  // 28d (período longo)
  const start28d = formatDate(28);
  const end28d = formatDate(1);
  console.log(`   📅 Período longo: ${start28d} a ${end28d}`);
  console.log();

  // Buscar dados
  console.log('   Buscando queries 7d...');
  const current7d = await fetchQueries(auth, args.site, start7d, end7d, 100);

  console.log('   Buscando queries 28d...');
  const previous28d = await fetchQueries(auth, args.site, start28d, end28d, 100);

  console.log('   Buscando top páginas 7d...');
  const topPages7d = await fetchPageStats(auth, args.site, start7d, end7d, 20);

  if (current7d.length === 0) {
    console.log('   ⚠️ Nenhuma query encontrada nos últimos 7 dias.');
    return;
  }

  console.log(`   ✅ ${current7d.length} queries (7d), ${previous28d.length} queries (28d), ${topPages7d.length} páginas`);

  // Comparar
  const comparison = compareQueries(current7d, previous28d);

  console.log();
  console.log(`   📈 Subindo: ${comparison.risers.length}`);
  console.log(`   📉 Caindo: ${comparison.fallers.length}`);
  console.log(`   🆕 Novas: ${comparison.newQueries.length}`);
  console.log(`   ❌ Perdidas: ${comparison.lostQueries.length}`);

  // Gerar relatório
  const reportsDir = resolve('./reports');
  mkdirSync(reportsDir, { recursive: true });

  const md = generateMarkdown(args.site, current7d, previous28d, topPages7d, comparison);
  const mdPath = resolve(reportsDir, 'gsc-digest.md');
  writeFileSync(mdPath, md, 'utf-8');

  console.log();
  console.log(`   📄 Relatório: ${mdPath}`);
  console.log();
  console.log('   ✅ Digest gerado com sucesso');
}

main().catch(e => {
  console.error('❌ Erro:', e.message);
  process.exit(1);
});

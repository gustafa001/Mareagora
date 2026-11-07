import { PORTS } from '../lib/ports';
import { portosConfig } from '../data/porto-seo-config';

const ano = new Date().getFullYear();
const defaultSuffix = 'Maré Alta e Baixa Hoje';
const SEP = ' — ';
const forbiddenEndings = ['e', 'de', 'do', 'da', 'em', 'para', '—'];

const errors: string[] = [];
const titles: { slug: string; title: string; length: number }[] = [];

for (const port of PORTS) {
  const config = portosConfig[port.slug];
  const isCommercial =
    !port.referencePortSlug &&
    (port.name.toLowerCase().includes('porto') ||
      port.name.toLowerCase().includes('terminal') ||
      config?.category === 'industrial');
  const seoName = config?.seoName ?? (isCommercial ? port.name : port.cityName);
  const suffix = (config?.titleSuffix ?? defaultSuffix)
    .replace(/\s+Oficiais$/i, '')
    .replace(/\s{1,2}\d{4}$/i, '')
    .trim();

  const base = `Tábua de Maré ${seoName} ${ano}`;

  // Nova lógica exata
  let title = base;
  if (base.length > 60) {
    title = base.slice(0, 60).trimEnd();
  } else {
    const candidates = Array.from(new Set(
      [suffix, suffix.split(SEP)[0].trim(), 'Horários de Hoje', 'Maré Hoje'].filter(Boolean)
    ));
    const fit = candidates.find(s => `${base}${SEP}${s}`.length <= 60);
    if (fit) title = `${base}${SEP}${fit}`;
  }

  titles.push({ slug: port.slug, title, length: title.length });

  if (title.length > 60) {
    errors.push(`[${port.slug}] Title exceeds 60 chars (${title.length}): "${title}"`);
  }

  const lastWord = title.trim().split(/\s+/).pop()?.toLowerCase() || '';
  if (forbiddenEndings.includes(lastWord) || title.endsWith('—')) {
    errors.push(`[${port.slug}] Title ends with forbidden word/char "${lastWord}": "${title}"`);
  }
}

console.log(`=== NEW TITLES DUMP (${titles.length} ports) ===`);
for (const item of titles) {
  console.log(`${item.slug}\t${item.length}\t${item.title}`);
}

console.log(`\nNew Errors count: ${errors.length}`);
if (errors.length > 0) {
  for (const err of errors) {
    console.error(`ERR: ${err}`);
  }
  process.exit(1);
} else {
  console.log(`ALL TITLES VALID!`);
}

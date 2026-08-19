import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_KEY = '16a9786571fdeec8d29ddd0ce264ec38';
const BASE_URL = 'https://mareagora.com.br';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const SITEMAPS = [
  `${BASE_URL}/sitemap/praias.xml`,
  `${BASE_URL}/sitemap/guia-praias.xml`,
  `${BASE_URL}/sitemap/portos.xml`,
  `${BASE_URL}/sitemap/estados.xml`,
  `${BASE_URL}/sitemap/blog.xml`,
  `${BASE_URL}/sitemap/mundo.xml`,
  `${BASE_URL}/sitemap/tide-en.xml`,
];

async function fetchUrlsFromSitemap(sitemapUrl: string): Promise<string[]> {
  try {
    const res = await fetch(sitemapUrl, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const matches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
    return matches.map((m) => m.replace(/<\/?loc>/g, '').trim());
  } catch {
    console.error(`Erro ao buscar sitemap: ${sitemapUrl}`);
    return [];
  }
}

async function submitToIndexNow(urls: string[]): Promise<{ submitted: number; batches: number }> {
  const BATCH_SIZE = 10_000;
  let submitted = 0;
  let batches = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const payload = {
      host: 'mareagora.com.br',
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: batch,
    };

    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 202) {
      submitted += batch.length;
      batches++;
    } else {
      console.error(`IndexNow batch falhou: ${res.status} - ${await res.text()}`);
    }
  }

  return { submitted, batches };
}

export async function POST(request: NextRequest) {
  // ProteÃ§Ã£o por token secreto
  const authHeader = request.headers.get('authorization');
  const secret = process.env.INDEXNOW_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Coleta todas as URLs de todos os sitemaps
    const allUrls: string[] = [];
    for (const sitemapUrl of SITEMAPS) {
      const urls = await fetchUrlsFromSitemap(sitemapUrl);
      allUrls.push(...urls);
    }

    // Remove duplicatas
    const uniqueUrls = [...new Set(allUrls)];

    // Envia para IndexNow
    const result = await submitToIndexNow(uniqueUrls);

    return NextResponse.json({
      success: true,
      totalUrls: uniqueUrls.length,
      submitted: result.submitted,
      batches: result.batches,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// GET retorna status da chave
export async function GET() {
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    sitemaps: SITEMAPS,
  });
}

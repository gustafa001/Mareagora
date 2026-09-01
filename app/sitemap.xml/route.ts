// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';

const BASE_URL = 'https://mareagora.com.br';

const SUB_SITEMAPS = [
  'praias',
  'portos',
  'estados',
  'blog',
  'mundo',
  'tide-en',
];

export async function GET() {
  const now = new Date().toISOString();

  const entries = SUB_SITEMAPS.map(
    (name) => `  <sitemap>
    <loc>${BASE_URL}/sitemap/${name}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

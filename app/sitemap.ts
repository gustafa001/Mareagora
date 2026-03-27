import { MetadataRoute } from 'next';
import { PORTS } from '@/lib/ports';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mareagora.com.br';

  const portPages = PORTS.map(p => ({
    url: `${base}/mare/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...portPages,
  ];
}

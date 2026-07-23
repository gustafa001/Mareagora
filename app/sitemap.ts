import { MetadataRoute } from 'next';
import { PORTS } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';
import { getPosts } from '@/lib/blog';

const base = 'https://mareagora.com.br';

export async function generateSitemaps() {
  return [
    { id: 'index' },
    { id: 'praias' },
    { id: 'portos' },
    { id: 'estados' },
    { id: 'blog' },
  ];
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  if (id === 'praias') {
    return PORTS.filter(p => !p.name.toLowerCase().includes('porto') && !p.name.toLowerCase().includes('terminal')).map(p => ({
      url: `${base}/mare/${getStateSlug(p.state)}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  }

  if (id === 'portos') {
    return PORTS.filter(p => p.name.toLowerCase().includes('porto') || p.name.toLowerCase().includes('terminal')).map(p => ({
      url: `${base}/operacoes-portuarias/${getStateSlug(p.state)}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  }

  if (id === 'estados') {
    const states = Array.from(new Set(PORTS.map(p => getStateSlug(p.state))));
    return states.map(state => ({
      url: `${base}/mare/${state}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  }

  if (id === 'blog') {
    return getPosts().map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  }

  // id === 'index' (Base generic routes)
  const genericRoutes = [
    '',
    '/mare',
    '/portos',
    '/guia-praias',
    '/cameras',
    '/sobre',
    '/contato',
    '/termos',
    '/privacidade',
    '/mare-hoje',
    '/mare-amanha',
    '/mare-semana',
    '/mare-viva',
    '/mare-morta',
    '/lua',
    '/ondas',
    '/coeficiente',
    '/pesca'
  ];

  return genericRoutes.map(route => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}

import { MetadataRoute } from 'next';
import { PORTS } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';
import { getPosts } from '@/lib/blog';
import rolloutStatus from '@/data/content-rollout-status.json';

const base = 'https://mareagora.com.br';
const _rollout = rolloutStatus as Record<string, { approved: boolean }>;
const isApproved = (slug: string) => _rollout[slug]?.approved === true;

const tideDataDate = () => {
  const now = new Date();
  // Dados de maré são anuais (PDFs da Marinha publicados 1x/ano).
  // lastModified honesto = início do ano vigente, não "hoje".
  return new Date(now.getFullYear(), 0, 1).toISOString();
};

export async function generateSitemaps() {
  return [
    { id: 'index' },
    { id: 'praias' },
    { id: 'guia-praias' },
    { id: 'portos' },
    { id: 'estados' },
    { id: 'blog' },
    { id: 'mundo' },
    { id: 'tide-en' },
  ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  if (id === 'praias') {
    return PORTS.filter(p => p.referencePortSlug || (!p.name.toLowerCase().includes('porto') && !p.name.toLowerCase().includes('terminal'))).map(p => ({
      url: `${base}/mare/${getStateSlug(p.state)}/${p.slug}`,
      lastModified: tideDataDate(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  }

  if (id === 'guia-praias') {
    const { PRAIAS } = await import('./guia-praias/page');
    const { CONTEUDO } = await import('@/lib/guia-praias/conteudoPraias');
    return PRAIAS.filter(p => !!CONTEUDO[p.slug]).map(p => ({
      url: `${base}/guia-praias/${p.slug}`,
      lastModified: tideDataDate(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  }

  if (id === 'portos') {
    return PORTS.filter(p => !p.referencePortSlug && (p.name.toLowerCase().includes('porto') || p.name.toLowerCase().includes('terminal'))).map(p => ({
      url: `${base}/operacoes-portuarias/${getStateSlug(p.state)}/${p.slug}`,
      lastModified: tideDataDate(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  }

  if (id === 'estados') {
    const states = Array.from(new Set(PORTS.map(p => getStateSlug(p.state))));
    return [
      { url: `${base}/estados`, lastModified: tideDataDate(), changeFrequency: 'weekly' as const, priority: 0.7 },
      ...states.map(state => ({
        url: `${base}/estados/${state}`,
        lastModified: tideDataDate(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      })),
    ];
  }

  if (id === 'blog') {
    return getPosts().filter(p => !p.noindex).map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  }

  if (id === 'mundo') {
    const { GLOBAL_PLACES, AUTO_SLUGS_TO_REMOVE } = await import('@/lib/globalPlaces');
    const countries = Array.from(new Set(GLOBAL_PLACES.map(p => p.countryCode)));
    return [
      { url: `${base}/mare-mundo`, lastModified: tideDataDate(), changeFrequency: 'weekly' as const, priority: 0.6 },
      ...countries.map(cc => ({
        url: `${base}/mare-mundo/${cc}`,
        lastModified: tideDataDate(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      ...GLOBAL_PLACES.filter(p => isApproved(p.slug) && !AUTO_SLUGS_TO_REMOVE.has(p.slug)).map(p => ({
        url: `${base}/mare-mundo/${p.countryCode}/${p.slug}`,
        lastModified: tideDataDate(),
        changeFrequency: 'daily' as const,
        priority: 0.5,
      }))
    ];
  }

  if (id === 'tide-en') {
    const { GLOBAL_PLACES, AUTO_SLUGS_TO_REMOVE } = await import('@/lib/globalPlaces');
    const countries = Array.from(new Set(GLOBAL_PLACES.map(p => p.countryCode)));
    return [
      { url: `${base}/tide`, lastModified: tideDataDate(), changeFrequency: 'weekly' as const, priority: 0.6 },
      ...countries.map(cc => ({
        url: `${base}/tide/${cc}`,
        lastModified: tideDataDate(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      ...GLOBAL_PLACES.filter(p => isApproved(p.slug) && !AUTO_SLUGS_TO_REMOVE.has(p.slug)).map(p => ({
        url: `${base}/tide/${p.countryCode}/${p.slug}`,
        lastModified: tideDataDate(),
        changeFrequency: 'daily' as const,
        priority: 0.5,
      }))
    ];
  }

  // id === 'index' (Base generic routes)
  const today = new Date().toISOString();
  const staticRoutes = ['', '/portos', '/guia-praias', '/cameras', '/sobre', '/contato', '/termos', '/privacidade'];
  const dailyRoutes = ['/mare-hoje', '/mare-amanha', '/mare-semana', '/mare-viva', '/mare-morta', '/lua', '/ondas', '/coeficiente', '/pesca', '/lugares-de-pesca'];

  return [
    ...staticRoutes.map(route => ({
      url: `${base}${route}`,
      lastModified: tideDataDate(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1.0 : 0.8,
    })),
    ...dailyRoutes.map(route => ({
      url: `${base}${route}`,
      lastModified: today,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];
}

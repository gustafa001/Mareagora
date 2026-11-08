import { MetadataRoute } from 'next';
import { PORTS } from '@/lib/ports';
import { getStateSlug } from '@/lib/states';
import { getPosts } from '@/lib/blog';

const base = 'https://mareagora.com.br';

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
  ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  if (id === 'praias') {
    return PORTS.filter(p => p.referencePortSlug || (!p.name.toLowerCase().includes('porto') && !p.name.toLowerCase().includes('terminal'))).map(p => ({
      url: `${base}/mare/${getStateSlug(p.state)}/${p.slug}`,
      lastModified: tideDataDate(),
    }));
  }

  if (id === 'guia-praias') {
    const { PRAIAS } = await import('./guia-praias/page');
    const { CONTEUDO } = await import('@/lib/guia-praias/conteudoPraias');
    return PRAIAS.filter(p => !!CONTEUDO[p.slug]).map(p => ({
      url: `${base}/guia-praias/${p.slug}`,
      lastModified: tideDataDate(),
    }));
  }

  if (id === 'portos') {
    return PORTS.filter(p => !p.referencePortSlug && (p.name.toLowerCase().includes('porto') || p.name.toLowerCase().includes('terminal'))).map(p => ({
      url: `${base}/operacoes-portuarias/${getStateSlug(p.state)}/${p.slug}`,
      lastModified: tideDataDate(),
    }));
  }

  if (id === 'estados') {
    const states = Array.from(new Set(PORTS.map(p => getStateSlug(p.state))));
    return [
      { url: `${base}/estados`, lastModified: tideDataDate() },
      ...states.map(state => ({
        url: `${base}/estados/${state}`,
        lastModified: tideDataDate(),
      })),
    ];
  }

  if (id === 'blog') {
    return getPosts().filter(p => !p.noindex).map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
    }));
  }

  // id === 'index' (Rotas base genéricas)
  // Rotas editoriais, institucionais e páginas sem datação granular:
  // Omitimos lastModified para não emitir datas arbitrárias de deploy (today)
  // que o Google ignora ou penaliza.
  const staticRoutes = [
    '',
    '/portos',
    '/operacoes-portuarias',
    '/guia-praias',
    '/blog',
    '/detectoristas',
    '/detectoristas/melhores-praias',
    '/cameras',
    '/sobre',
    '/contato',
    '/termos',
    '/privacidade',
    '/cookies',
    '/glossario-de-mare',
    '/embed',
    '/mare-hoje',
    '/mare-amanha',
    '/mare-semana',
    '/mare-viva',
    '/mare-morta',
    '/lua',
    '/ondas',
    '/coeficiente',
    '/pesca',
    '/lugares-de-pesca',
  ];

  return [
    ...staticRoutes.map(route => ({
      url: `${base}${route}`,
    })),
    {
      url: `${base}/tide/fishing-guide`,
      lastModified: new Date('2026-08-26'),
    },
  ];
}

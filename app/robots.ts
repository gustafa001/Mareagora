import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: [
      'https://mareagora.com.br/sitemap/index.xml',
      'https://mareagora.com.br/sitemap/praias.xml',
      'https://mareagora.com.br/sitemap/guia-praias.xml',
      'https://mareagora.com.br/sitemap/portos.xml',
      'https://mareagora.com.br/sitemap/estados.xml',
      'https://mareagora.com.br/sitemap/blog.xml',
      'https://mareagora.com.br/sitemap/mundo.xml',
      'https://mareagora.com.br/sitemap/tide-en.xml',
    ],
  };
}

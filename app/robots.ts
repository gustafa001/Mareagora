import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: [
      'https://www.mareagora.com.br/sitemap/index.xml',
      'https://www.mareagora.com.br/sitemap/praias.xml',
      'https://www.mareagora.com.br/sitemap/portos.xml',
      'https://www.mareagora.com.br/sitemap/estados.xml',
      'https://www.mareagora.com.br/sitemap/blog.xml',
      'https://www.mareagora.com.br/sitemap/mundo.xml',
      'https://www.mareagora.com.br/sitemap/tide-en.xml',
    ],
  };
}

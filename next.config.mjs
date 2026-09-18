import { readFileSync } from 'fs';
import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Garante que as pastas data/ e content/blog/ sejam incluídas no bundle das serverless functions do Vercel
  experimental: {
    outputFileTracingIncludes: {
      '/api/tide/[portId]': ['./data/**/*.json'],
      '/mare/[slug]/[cidade]': ['./data/**/*.json'],
      '/widget/porto/[porto]': ['./data/**/*.json'],
      '/blog': ['./content/blog/**/*.md'],
      '/blog/[slug]': ['./content/blog/**/*.md'],
    },
  },
  async redirects() {
    // Canonicaliza o domínio: qualquer request em www.mareagora.com.br
    // deve virar 301 permanente para mareagora.com.br, preservando
    // path e query string. Isso precisa vir ANTES dos redirects
    // dinâmicos de redirects.json para ser aplicado primeiro.
    const wwwToApex = [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.mareagora.com.br' }],
        destination: 'https://mareagora.com.br/:path*',
        permanent: true,
      },
    ];

    try {
      const redirectsData = readFileSync(resolve('./redirects.json'), 'utf8');
      return [...wwwToApex, ...JSON.parse(redirectsData)];
    } catch (e) {
      console.warn('Could not load redirects.json, skipping dynamic redirects');
      return wwwToApex;
    }
  },
  async headers() {
    return [
      {
        source: '/((?!widget).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none';" },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' }
        ]
      },
      {
        source: '/widget/:path*',
        headers: [
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "frame-ancestors *;" }
        ]
      }
    ];
  },
};

export default nextConfig;

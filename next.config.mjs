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
      '/mare/[slug]': ['./data/**/*.json'],
      '/blog': ['./content/blog/**/*.md'],
      '/blog/[slug]': ['./content/blog/**/*.md'],
      '/sitemap.xml': ['./content/blog/**/*.md'],
    },
  },
  async redirects() {
    try {
      const redirectsData = readFileSync(resolve('./redirects.json'), 'utf8');
      return JSON.parse(redirectsData);
    } catch (e) {
      console.warn('Could not load redirects.json, skipping dynamic redirects');
      return [];
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
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
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

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
};

export default nextConfig;

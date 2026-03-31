/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Garante que a pasta data/ seja incluída no bundle das serverless functions do Vercel
  // Sem isso, fs.readFile falha em produção e causa "Application error: server-side exception"
  outputFileTracingIncludes: {
    '/api/tide/[portId]': ['./data/**/*.json'],
    '/mare/[slug]': ['./data/**/*.json'],
  },
};

export default nextConfig;

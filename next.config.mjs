/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Garante que a pasta data/ seja incluída no bundle das serverless functions do Vercel
  experimental: {
    outputFileTracingIncludes: {
      '/api/tide/[portId]': ['./data/**/*.json'],
      '/mare/[slug]': ['./data/**/*.json'],
    },
  },
};

export default nextConfig;

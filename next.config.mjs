import withPWAInit from 'next-pwa';

const pwaConfig = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/www\.mareagora\.com\.br\/api\/.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'api-cache', expiration: { maxEntries: 50, maxAgeSeconds: 3600 } },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: 'CacheFirst',
      options: { cacheName: 'image-cache', expiration: { maxEntries: 60, maxAgeSeconds: 2592000 } },
    },
    {
      urlPattern: /^https:\/\/www\.mareagora\.com\.br\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'page-cache', expiration: { maxEntries: 100, maxAgeSeconds: 86400 } },
    },
  ],
});

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

export default pwaConfig(nextConfig);

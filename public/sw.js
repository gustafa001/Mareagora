// ═══════════════════════════════════════════════
// MaréAgora — Service Worker (PWA)
// ═══════════════════════════════════════════════

const CACHE = 'mareagora-v3'; // bump de versão força limpeza do cache antigo
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Instala e faz cache dos assets estáticos que realmente existem
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.error('[SW] precache falhou:', err))
  );
});

// Limpa caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // não intercepta POST (ex: /api/push/*)

  const url = new URL(req.url);

  // Payloads RSC / flight do App Router (Next.js) — DEPENDEM DO BUILD. O
  // prefetch do router usa fetch() com header "RSC: 1" (mode ≠ navigate),
  // então esses requests caíam no cacheFirst abaixo e eram cacheados com a
  // URL da página como chave — URL que NÃO muda entre deploys. Após um
  // redeploy, o SW entregava o flight payload do build antigo pro router
  // atual, que tentava executar ids de módulo webpack que não existem mais
  // -> "Cannot read properties of undefined (reading 'call')" no
  // __webpack_require__, só em páginas pré-buscadas. Nunca cachear esses
  // payloads: sempre busca a versão atual do build.
  const isRscData = req.headers.get('RSC') === '1' ||
    !!req.headers.get('Next-Router-State-Tree') ||
    !!req.headers.get('Next-Router-Prefetch') ||
    (req.headers.get('accept') || '').includes('text/x-component');
  if (isRscData) {
    e.respondWith(fetch(req));
    return;
  }

  // APIs externas de maré/clima — sempre tenta rede primeiro, cai pro cache se offline
  if (url.hostname.includes('open-meteo') || url.hostname.includes('marinha')) {
    e.respondWith(networkFirst(req));
    return;
  }

  // Navegação (páginas do site, incluindo /mare/[slug], /mare-mundo/... etc)
  // e chamadas internas de dados (Server Actions / RSC) — Network First,
  // pra sempre mostrar a maré mais atual quando online, e cair pro cache
  // (última versão vista) quando offline.
  if (req.mode === 'navigate' || url.pathname.startsWith('/api/tide') || url.pathname.startsWith('/api/global-tide')) {
    e.respondWith(networkFirst(req, '/offline.html'));
    return;
  }

  // Assets estáticos do Next.js (_next/static, imagens, fontes) — são
  // imutáveis (hash no nome do arquivo), então Cache First é seguro e rápido.
  e.respondWith(cacheFirst(req));
});

async function networkFirst(request, offlineFallback) {
  try {
    const res = await fetch(request);
    const clone = res.clone();
    caches.open(CACHE).then((c) => c.put(request, clone));
    return res;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (offlineFallback) return caches.match(offlineFallback);
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    const clone = res.clone();
    caches.open(CACHE).then((c) => c.put(request, clone));
    return res;
  } catch {
    return caches.match('/offline.html');
  }
}

// ═══════════════════════════════════════════════
// Notificações Push
// ═══════════════════════════════════════════════

self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {
    title: 'MaréAgora',
    body: 'Confira a tábua de marés de hoje!',
    icon: '/icons/icon-192x192.png',
  };

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
  };

  e.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});

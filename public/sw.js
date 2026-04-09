// ═══════════════════════════════════════════════
// MaréAgora — Service Worker (PWA)
// Salve este arquivo como /sw.js na raiz do site
// ═══════════════════════════════════════════════

const CACHE = 'mareagora-v1';
const ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
];

// Instala e faz cache dos assets estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Limpa caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Estratégia: Network First (dados de maré precisam ser frescos)
// Fallback para cache se offline
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API calls — sempre tenta rede primeiro
  if (url.hostname.includes('open-meteo') || url.hostname.includes('marinha')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          // Salva no cache para uso offline
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Assets estáticos — Cache First
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match('/offline.html'));
    })
  );
});

// ═══════════════════════════════════════════════
// Notificações Push
// ═══════════════════════════════════════════════

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {
    title: 'MaréAgora',
    body: 'Confira a tábua de marés de hoje!',
    icon: '/icons/icon-192x192.png'
  };

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data.url)
  );
});

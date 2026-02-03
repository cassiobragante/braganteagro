const CACHE_NAME = 'bragante-v1';

// Arquivos que precisam ser cacheados para a instalação ser liberada
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './logo.png'
      ]);
    })
  );
});

// Responde as requisições mesmo sem internet
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
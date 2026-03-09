const CACHE_NAME = 'bragante-v3'; // Versão atualizada
const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './BackupSistemaDefinitivo.html',
  './FormularioRacaoDefinitivo.html',
  // Bibliotecas externas essenciais para o funcionamento offline
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-database-compat.js',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Inter:wght@400;600;700;900&display=swap'
];

// Instala e salva os arquivos no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  );
  self.skipWaiting();
});

// Ativa e remove caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
});

// Estratégia: Tenta o Cache primeiro (mais rápido para Offline). Se não tiver, busca na Internet.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// --- LÓGICA DE NOTIFICAÇÃO ---[cite: 2]

self.addEventListener('notificationclick', (event) => {
  event.notification.close();[cite: 2]

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();[cite: 2]
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');[cite: 2]
      }
    })
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'Bragante Agro', body: 'Nova atualização disponível!' };[cite: 2]
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,[cite: 2]
    icon: './logo.png',[cite: 2]
    badge: './logo.png',[cite: 2]
    vibrate: [200, 100, 200],[cite: 2]
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)[cite: 2]
  );
});
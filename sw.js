const CACHE_NAME = 'bragante-v10'; // Atualizado para v10 para forçar a nova lógica de persistência
const assets = [
  './',
  './index.html',
  './precos.html',
  './manifest.json',
  './logo.png',
  './BackupSistemaDefinitivo.html',
  './FormularioRacaoDefinitivo.html',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Inter:wght@400;600;700;900&display=swap',
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-database-compat.js'
];

// Instala e salva os arquivos no cache imediatamente
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando ecossistema Bragante...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); // Força a ativação imediata
});

// Ativa e assume o controle das páginas instantaneamente
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  return self.clients.claim(); // Reivindica o controle total sobre o app
});

// ESTRATÉGIA: Prioridade de Navegação Offline (Resolve o erro após encerrar o app)
self.addEventListener('fetch', (e) => {
  // Lógica especial para carregamento inicial (Navigation)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then((response) => {
        // Se o index está no cache, entrega ele primeiro para abrir o app rápido
        // Enquanto isso, tenta atualizar em segundo plano se houver rede
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse.clone()));
          return networkResponse;
        }).catch(() => response); // Se falhar (offline), usa o cache sem erro

        return response || fetchPromise;
      })
    );
    return;
  }

  // Lógica para demais recursos (imagens, scripts, outros iframes)
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) return response;

      return fetch(e.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (e.request.url.includes(location.origin) && e.request.method === 'GET') {
            cache.put(e.request, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      // Fallback genérico para navegação se tudo falhar
      if (e.request.mode === 'navigate') return caches.match('./index.html');
    })
  );
});

// --- LÓGICA DE NOTIFICAÇÃO (Mantida) ---
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'Bragante Agro', body: 'Nova atualização disponível!' };
  if (event.data) {
    try { data = event.data.json(); } catch (e) { data.body = event.data.text(); }
  }
  const options = {
    body: data.body,
    icon: './logo.png',
    badge: './logo.png',
    vibrate: [200, 100, 200],
    data: { dateOfArrival: Date.now(), primaryKey: 1 }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
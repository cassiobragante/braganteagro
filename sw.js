const CACHE_NAME = 'bragante-v9'; // Atualizado para v9 para aplicar a nova lógica de inicialização
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
  self.skipWaiting();
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
  return self.clients.claim(); // Força o SW a controlar a página no primeiro carregamento
});

// ESTRATÉGIA: Cache-First com Fallback de Navegação
// Resolve o problema de não carregar após encerrar o app offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Se estiver no cache, entrega imediatamente (mesmo sem processo ativo)
      if (response) {
        return response;
      }

      // Se não estiver no cache, tenta buscar na rede
      return fetch(e.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Salva dinamicamente novos recursos do próprio domínio
          if (e.request.url.includes(location.origin) && e.request.method === 'GET') {
            cache.put(e.request, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      // Caso a rede falhe e não haja cache, se for uma navegação, entrega a home
      if (e.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});

// --- LÓGICA DE NOTIFICAÇÃO (Mantida conforme original) ---
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'Bragante Agro', body: 'Nova atualização disponível!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
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
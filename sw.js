const CACHE_NAME = 'bragante-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './BackupSistemaDefinitivo.html',
  './FormularioRacaoDefinitivo.html'
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

// Estratégia: Tenta internet primeiro. Se falhar, usa o cache (Offline)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// --- LÓGICA DE NOTIFICAÇÃO ---

// Gerencia o clique na notificação (faz abrir o app ao clicar)
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Fecha a notificação ao clicar

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se o app já estiver aberto, foca nele
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não estiver aberto, abre o app
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

// Opcional: Ouvir eventos de Push do Servidor (caso use Firebase Cloud Messaging no futuro)
self.addEventListener('push', (event) => {
  let data = { title: 'Bragante Agro', body: 'Nova atualização disponível!' };
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: './logo.png',
    badge: './logo.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
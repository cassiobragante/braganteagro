const CACHE_NAME = 'bragante-v8'; //
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
];[cite: 10, 11]

// Instala e salva os arquivos no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando arquivos do ecossistema Bragante...');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});[cite: 10]

// Ativa e remove caches antigos para evitar conflitos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  return self.clients.claim();
});[cite: 10]

// ESTRATÉGIA: Cache First (Prioridade Total ao Cache)
// Essencial para que os iframes abram offline sem tentar a rede primeiro
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Retorna o cache se existir; se não, busca na rede e tenta salvar no cache
      return response || fetch(e.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Apenas salva no cache requisições válidas do próprio domínio
          if (e.request.url.includes(location.origin)) {
            cache.put(e.request, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    })
  );
});[cite: 10]

// --- LÓGICA DE NOTIFICAÇÃO ---
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
});[cite: 10]

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
});[cite: 10]
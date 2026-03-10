const CACHE_NAME = 'bragante-v13'; // Atualizado para v13 para forçar atualização nos celulares
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

// Instalação
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de versões antigas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  return self.clients.claim();
});

// ESTRATÉGIA DE REDE COM EXCEÇÃO PARA FIREBASE
self.addEventListener('fetch', (e) => {
  // --- INICIO DA ALTERAÇÃO ---
  // Se a requisição for para o Firebase (banco de dados), o Service Worker NÃO interfere.
  // Isso permite que o 'setPersistenceEnabled(true)' do Firebase funcione corretamente.
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('googleapis')) {
    return; 
  }
  // --- FIM DA ALTERAÇÃO ---

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Se a rede funcionar, salva/atualiza o arquivo no cache (HTML, CSS, Imagens)
        if (response && response.status === 200 && e.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Se estiver OFFLINE, busca o arquivo no cache
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // Se for navegação e não tiver no cache, redireciona para o index
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// LÓGICA DE NOTIFICAÇÃO
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
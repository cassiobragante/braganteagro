const CACHE_NAME = 'bragante-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './BackupSistemaDefinitivo.html',
  './FormularioRacaoDefinitivo.html'
];

// Instala e salva os arquivos no cache do celular
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
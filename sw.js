// Nom de version du cache – incrémente à chaque mise à jour
const CACHE = 'nellycoin-v15';

// Fichiers essentiels à mettre en cache (offline)
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/nelly/logo.webp',
  '/assets/nelly/banniere.webp'
];

// INSTALLATION — met en cache les fichiers de base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATION — supprime les anciens caches automatiquement
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// FETCH — sert les fichiers du cache si disponibles
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // ignore POST, etc.

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return (
        cachedResponse ||
        fetch(event.request).then(response => {
          // met une copie en cache
          const responseClone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, responseClone));
          return response;
        }).catch(() => caches.match('/'))
      );
    })
  );
});

// Nom de version du cache — incrémente à chaque mise à jour
const CACHE = 'nellycoin-v2';

// Fichiers essentiels à mettre en cache (offline)
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/nelly/logo.png',
  '/assets/nelly/banniere.jpg'
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
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH — répond à la requête avec le cache d’abord, sinon va en ligne
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // ignore POST, etc.

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Met à jour le cache en arrière-plan
          caches.open(CACHE).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => cachedResponse || caches.match('/'));
      return cachedResponse || fetchPromise;
    })
  );
});


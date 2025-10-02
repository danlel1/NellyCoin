self.addEventListener('install', e => {
  e.waitUntil(caches.open('nellycoin-v1').then(c => c.addAll([
    '/', '/index.html',
    '/assets/nelly/logo.png',
    '/assets/nelly/banniere.jpg'
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

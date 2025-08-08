const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  'js.main-app.js',
  '/globals.css',
  '/manifest.json',
  '/',
  '/todos',
  '/bills',
  '/api/bills',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

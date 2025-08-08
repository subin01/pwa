const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/_next/static/js/main-app.js',
  '/_next/static/js/app/layout.js',
  '/_next/static/js/app/todos/page.js',
  '/_next/static/js/app/bills/page.js',
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

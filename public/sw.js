const CACHE_NAME = 'pwa-cache-v1';
const API_CACHE_NAME = 'api-cache-v1';
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
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  const reqUrl = new URL(event.request.url);

  // Handle API requests with stale-while-revalidate
  if (reqUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);
        // Return cached response immediately if available, else wait for network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Non-API requests: default cache-first
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

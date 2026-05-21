const CACHE_NAME = 'loadmaster-cache-v3';

// These are the files we want to lock into the tablet's memory
const urlsToCache = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// 1. Install the Service Worker and Cache the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('LoadMaster: Files cached successfully');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Intercept network requests and serve from Cache if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the file is in the cache, serve it immediately!
        if (response) {
          return response;
        }
        // Otherwise, try to fetch it from the internet
        return fetch(event.request);
      })
  );
});

// 3. Clean up old caches when you update the app
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

const RUNTIME = 'runtime';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  console.log('activating');
  
  const currentCaches = [RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => {
      console.log('claiming');
      self.clients.claim()
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.indexOf('tile.osm.org') >= 0) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            if (response.ok) {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            } else {
              return response;
            }
          });
        });
      })
    );
  }
});

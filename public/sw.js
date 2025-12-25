const CACHE_NAME = 'love-is-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

const MAX_CACHE_SIZE = 100;

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker');
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('[SW] Precaching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin === location.origin) {
    if (request.url.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)) {
      event.respondWith(
        caches.match(request).then(response => {
          return response || fetch(request).then(fetchRes => {
            return caches.open(IMAGE_CACHE).then(cache => {
              cache.put(request, fetchRes.clone());
              limitCacheSize(IMAGE_CACHE, MAX_CACHE_SIZE);
              return fetchRes;
            });
          });
        }).catch(() => {
          return new Response('Offline - изображение недоступно', { 
            status: 503, 
            statusText: 'Service Unavailable' 
          });
        })
      );
      return;
    }

    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchRes => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, fetchRes.clone());
            limitCacheSize(DYNAMIC_CACHE, MAX_CACHE_SIZE);
            return fetchRes;
          });
        });
      }).catch(() => {
        if (request.url.indexOf('.html') > -1 || request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      })
    );
    return;
  }

  if (url.hostname === 'images.unsplash.com' || url.hostname.includes('unsplash')) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(fetchRes => {
          return caches.open(IMAGE_CACHE).then(cache => {
            cache.put(request, fetchRes.clone());
            limitCacheSize(IMAGE_CACHE, MAX_CACHE_SIZE);
            return fetchRes;
          });
        }).catch(() => {
          return new Response('', { status: 503 });
        });
      })
    );
    return;
  }

  if (url.hostname === 'functions.poehali.dev' || url.hostname === 'api.telegram.org') {
    event.respondWith(
      fetch(request, { 
        timeout: 10000 
      }).then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
            limitCacheSize(DYNAMIC_CACHE, 50);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request).then(response => {
          if (response) {
            return response;
          }
          return new Response(JSON.stringify({ 
            error: 'Offline', 
            message: 'Нет подключения к интернету. Некоторые функции могут быть недоступны.' 
          }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  event.respondWith(fetch(request));
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

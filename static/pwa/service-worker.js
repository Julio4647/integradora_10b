const CACHE_NAME = 'pwa-cache-v8';
// const urlsToCache = [

//     '/index.html',
//     '/app.js',
//     '/manifest.json',
//     '/service-worker.js',
//     '/pouchdb.js',
  
//     'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
//     'https://cdnjs.cloudflare.com/ajax/libs/pouchdb/7.0.0/pouchdb.min.js',
// ];
const urlsToCache = [
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/service-worker.js',
  '/pouchdb.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/pouchdb/7.0.0/pouchdb.min.js',
];


// Instalar el service worker y agregar archivos al cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Archivos en caché', urlsToCache);
      return cache.addAll(urlsToCache);
    })
  );
});


// Activar el service worker y limpiar caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.filter(cacheName => {
        return cacheName !== CACHE_NAME
      }).map(cacheName => caches.delete(cacheName))
    ))
  );
});

// Fetch event: Intentar servir los archivos desde la caché
self.addEventListener('fetch', (event) => {
  console.log(event.request);
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si el recurso está en caché, devolverlo
        if (cachedResponse) {
          console.log('Cache hit:', cachedResponse);
          return cachedResponse;
        }

        // Si no está en caché, hacer la solicitud de red
        return fetch(event.request)
          .catch(() => {
            // Si ocurre un error con la red (cuando no hay conexión)
            if (event.request.mode === 'navigate') {
              // Devolver un recurso predeterminado (página principal)
              return caches.match(`${self.location.origin}/pwa/index.html`);
            } else {
              // Intentar devolver una página offline personalizada (si existe)
              return caches.match('/offline.html');
            }
          });
      })
  );
});

self.addEventListener('push', (event) => {
  const options = {
      body: event.data.text(),
      icon: '/images/image.png',  // Cambia esto según tu icono de notificación
      badge: '/images/image.png' // Cambia esto según tu ícono de badge
  };
  event.waitUntil(
      self.registration.showNotification('Notificación Push', options)
  );
});

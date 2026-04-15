const CACHE_NAME = 'mathengine-supersolver-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.js'
];

// Instal·lació: Guardem els fitxers a la memòria cau
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache obert correctament');
        return cache.addAll(ASSETS);
      })
      .catch(err => console.error('Error en el cache inicial:', err))
  );
});

// Activació: Esborrem versions antigues de la cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Netejant cache antiga:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch: Estratègia "Cache First"
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // Si el tenim a la cache, el servim. Si no, anem a buscar-lo a la xarxa.
      return res || fetch(e.request);
    })
  );
});

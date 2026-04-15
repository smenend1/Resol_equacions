const CACHE_NAME = 'mathengine-supersolver-v1';

// Aquesta és la llista "d'anar a comprar" que el navegador descarregarà i guardarà
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.svg',  // ARA EL LOGO ÉS AQUÍ, SEMPRE DISPONIBLE OFFLINE
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.js'
];

// 1. INSTAL·LACIÓ: Ocorre el primer cop que algú entra a la web
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('MathEngine: Guardant fitxers per a ús offline...');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. ACTIVACIÓ: Neteja de memòria si canvies el CACHE_NAME en el futur
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. FETCH: L'estratègia de càrrega
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // Si el fitxer (com logo.svg) està a la memòria cau, el torna a l'instant.
      // Si no, el va a buscar a la xarxa.
      return res || fetch(e.request);
    })
  );
});

const CACHE_NAME = 'chemical-inventory-v1';
const urlsToCache = [
    '/',
    'assets/css/bootstrap.min.css',
    'assets/css/fontawesome.min.css',
    'assets/css/styles.css',
    'assets/js/jquery-3.7.1.min.js',
    'assets/js/bootstrap.bundle.min.js',
    'assets/js/script.js',
      // Add other files you want to cache
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch data from cache or network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

// Activate Service Worker
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

const CACHE_NAME = 'scholarjee-v1';

// All the files the app needs to run offline
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/curriculum.html',
    '/vault.html',
    '/debrief.html',
    '/telemetry.html',
    '/manifest.json'
];

// 1. Install Phase: Cache all files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching App Shell...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate Phase: Clean up old caches if you update the app
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing old cache...');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. Fetch Phase: Serve from Cache first, fallback to Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return the cached file if found, otherwise go to the network
            return cachedResponse || fetch(event.request);
        }).catch(() => {
            // Optional: If both fail, you could return a fallback offline page here
            console.log('Offline and resource not found in cache.');
        })
    );
});


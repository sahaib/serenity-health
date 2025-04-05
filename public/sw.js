// Service Worker for Serenity Health AI PWA
const CACHE_NAME = 'serenity-health-ai-v2';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/manifest.json',
  // Add CSS and JS essential files
  // These will be generated at different paths in production
  // but we'll cache them dynamically too
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
      })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
    .then(() => {
      console.log('[ServiceWorker] Claiming clients');
      // Claim clients immediately 
      return self.clients.claim();
    })
  );
});

// Helper function to determine if a request is an API call
const isApiRequest = (request) => {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
};

// Helper to determine if a request is for a static asset
const isStaticAsset = (request) => {
  const url = new URL(request.url);
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/.test(url.pathname);
};

// Fetch event - network-first for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip certain requests that shouldn't be cached
  if (event.request.method !== 'GET') {
    return;
  }

  // For API requests: Network-first strategy
  if (isApiRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // For static assets: Cache-first strategy
  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then((response) => {
              // Don't cache non-successful responses
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Clone the response
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch(() => {
              // No match in cache and network failed
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For HTML navigations: Network-first with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version of the page
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              // Return cached page if available
              if (cachedResponse) {
                return cachedResponse;
              }
              // Otherwise return the offline page
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Default strategy for other requests
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // If request is for an image, return a default offline image
            if (event.request.destination === 'image') {
              return new Response(
                'SVG+XML image placeholder would go here', 
                { 
                  headers: {'Content-Type': 'image/svg+xml'} 
                }
              );
            }
            
            // Otherwise return a simple offline response
            return new Response('You are offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-mood-entries') {
    event.waitUntil(syncMoodEntries());
  }
});

// Function to sync mood entries when online
const syncMoodEntries = async () => {
  try {
    // Get cached entries from IndexedDB or other storage
    // This is a placeholder - implement actual sync logic
    console.log('[ServiceWorker] Syncing mood entries');
    // Example: const entries = await getOfflineEntries();
    // Example: await sendToServer(entries);
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
};

// Periodically update cache for key resources
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateCache());
  }
});

// Function to update content cache
const updateCache = async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    // Refresh the home page
    await cache.add('/');
    console.log('[ServiceWorker] Updated cached content');
  } catch (error) {
    console.error('[ServiceWorker] Cache update failed:', error);
  }
}; 
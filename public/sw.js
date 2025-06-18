// Service Worker for Nexus-OS Performance Optimization
const CACHE_NAME = 'nexus-os-cache-v1';
const STATIC_CACHE_NAME = 'nexus-os-static-v1';
const DYNAMIC_CACHE_NAME = 'nexus-os-dynamic-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-icon.png',
  '/site.webmanifest',
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/static/',
];

// Dynamic routes to cache with network-first strategy
const DYNAMIC_ROUTES = [
  '/api/',
  '/home/',
  '/agents/',
  '/loom-studio/',
  '/billing/',
  '/files/',
];

// Cache expiration times (in milliseconds)
const CACHE_TIMES = {
  static: 30 * 24 * 60 * 60 * 1000, // 30 days for static assets
  dynamic: 24 * 60 * 60 * 1000, // 1 day for dynamic content
  api: 5 * 60 * 1000, // 5 minutes for API responses
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS.filter(url => !url.endsWith('/')));
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extensions and external domains
  if (url.protocol === 'chrome-extension:' || url.hostname !== location.hostname) {
    return;
  }

  // Determine caching strategy based on request type
  if (isStaticAsset(request.url)) {
    // Cache-first strategy for static assets
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
  } else if (isAPIRequest(request.url)) {
    // Network-first strategy with short cache for API requests
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME, CACHE_TIMES.api));
  } else if (isDynamicRoute(request.url)) {
    // Stale-while-revalidate for dynamic routes
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE_NAME));
  } else {
    // Network-first strategy for everything else
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME, CACHE_TIMES.dynamic));
  }
});

// Cache-first strategy: Check cache first, fallback to network
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is still valid
      const cacheTime = new Date(cachedResponse.headers.get('cache-time') || 0);
      const now = new Date();
      
      if (now.getTime() - cacheTime.getTime() < CACHE_TIMES.static) {
        return cachedResponse;
      }
    }
    
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      const responseWithTimestamp = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...responseClone.headers,
          'cache-time': new Date().toISOString(),
        },
      });
      cache.put(request, responseWithTimestamp);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    return new Response('Network Error', { status: 408 });
  }
}

// Network-first strategy: Try network first, fallback to cache
async function networkFirstStrategy(request, cacheName, maxAge = CACHE_TIMES.dynamic) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      const responseClone = networkResponse.clone();
      const responseWithTimestamp = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...responseClone.headers,
          'cache-time': new Date().toISOString(),
        },
      });
      cache.put(request, responseWithTimestamp);
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.warn('Network request failed, trying cache:', error);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      const cacheTime = new Date(cachedResponse.headers.get('cache-time') || 0);
      const now = new Date();
      
      // Return cached response even if expired when network fails
      if (now.getTime() - cacheTime.getTime() < maxAge * 2) {
        return cachedResponse;
      }
    }
    
    return new Response('Content not available offline', { status: 503 });
  }
}

// Stale-while-revalidate: Return cache immediately, update in background
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      const responseWithTimestamp = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...responseClone.headers,
          'cache-time': new Date().toISOString(),
        },
      });
      cache.put(request, responseWithTimestamp);
    }
    return networkResponse;
  }).catch(console.error);
  
  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Helper functions to determine request type
function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('/static/') ||
         url.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/);
}

function isAPIRequest(url) {
  return url.includes('/api/') || url.includes('/genkit/');
}

function isDynamicRoute(url) {
  return DYNAMIC_ROUTES.some(route => url.includes(route));
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Service Worker: Performing background sync');
  // Implementation for syncing offline data when back online
}

// Push notifications support
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'nexus-notification',
      requireInteraction: true,
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'NexOS Notification', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_STATS') {
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => cache.keys()),
      caches.open(DYNAMIC_CACHE_NAME).then(cache => cache.keys()),
    ]).then(([staticKeys, dynamicKeys]) => {
      event.ports[0].postMessage({
        staticCacheSize: staticKeys.length,
        dynamicCacheSize: dynamicKeys.length,
        totalCacheSize: staticKeys.length + dynamicKeys.length,
      });
    });
  }
});

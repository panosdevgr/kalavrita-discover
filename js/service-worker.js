const CACHE_NAME = 'kalavrita-guide-v1.0.0';
const STATIC_CACHE = 'kalavrita-static-v1.0.0';
const DYNAMIC_CACHE = 'kalavrita-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/styles/main.css',
    '/styles/components.css',
    '/styles/responsive.css',
    '/js/app.js',
    '/js/data.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://images.unsplash.com/photo-1555993539-1732b0258259?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (url.pathname === '/' || url.pathname.endsWith('.html')) {
        // HTML files - cache first, then network
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
        // Static assets - cache first, then network
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (url.pathname.startsWith('/api/')) {
        // API calls - network first, then cache
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        // Other requests - network first
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Service Worker: Serving from cache', request.url);
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            console.log('Service Worker: Cached new resource', request.url);
        }
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Error in cacheFirst', error);
        return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network first strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
            console.log('Service Worker: Cached network response', request.url);
        }
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

// Sync contact form submissions
async function syncContactForm() {
    try {
        const formData = await getStoredFormData();
        if (formData) {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                console.log('Service Worker: Contact form synced successfully');
                await clearStoredFormData();
            }
        }
    } catch (error) {
        console.error('Service Worker: Error syncing contact form', error);
    }
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Service Worker: Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/icons/icon-72x72.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/icon-72x72.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Kalavrita Guide', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper functions for offline storage
async function getStoredFormData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match('/offline-form-data');
        return response ? await response.json() : null;
    } catch (error) {
        console.error('Error getting stored form data:', error);
        return null;
    }
}

async function clearStoredFormData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.delete('/offline-form-data');
    } catch (error) {
        console.error('Error clearing stored form data:', error);
    }
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_FORM_DATA') {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(c => c.put('/offline-form-data', new Response(JSON.stringify(event.data.formData))));
    }
});

console.log('Service Worker: Script loaded');

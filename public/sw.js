

// const CACHE_NAME = 'nextjs-pwa-cache-v1';
// const PRECACHE_URLS = [
//   '/',                      // Home page
//   '/manifest.json',         // PWA manifest
//   '/favicon.ico',           // Favicon
// ];



// // Activate event: Cleanup old caches
// self.addEventListener('activate', (event) => {
//   console.log('[Service Worker] Activating...');
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
//   self.clients.claim(); // Take control of all clients
// });

// // Fetch event: Intercept requests
// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);

//   // Handle Firebase Magic Link (adjust path or domain as needed)
//   if (url.pathname === '/finishSignIn' || url.hostname === 'yourcustom.page.link') {
//     event.respondWith(
//       (async () => {
//         try {
//           console.log('[Service Worker] Handling magic link request');
//           // Redirect magic links to the app's main entry point
//           return await caches.match('/') || fetch('/');
//         } catch (error) {
//           console.error('[Service Worker] Error handling magic link:', error);
//           return fetch(event.request);
//         }
//       })()
//     );
//     return;
//   }

//   // Serve cached assets for known requests
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       return (
//         cachedResponse ||
//         fetch(event.request).then((response) => {
//           // Optionally cache new GET requests
//           if (event.request.method === 'GET') {
//             const clonedResponse = response.clone();
//             caches.open(CACHE_NAME).then((cache) => {
//               cache.put(event.request, clonedResponse);
//             });
//           }
//           return response;
//         })
//       );
//     })
//   );
// });

// 在 Service Worker 中打开 IndexedDB 数据库
const index_name = "bird_sight"
const cache_name = "sight_cache_v1"
const urlsToCache = [
    '/',
    '/stylesheets/style.css',
    '/sightDetails/'
];

self.addEventListener("install", event => {
    console.log("ServiceWorker Install")
    caches.open(cache_name).then((cache) => {
        // 设置缓存列表
        return cache.addAll(urlsToCache)
    })
})

//  Network first
self.addEventListener("activate", event => {
    // Remove old caches
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if (cache !== cache_name) {
                    console.log('Service Worker: Removing old cache: ' + cache);
                    return await caches.delete(cache);
                }
            })
        })()
    )
})

// save the request result
self.addEventListener("fetch", function (event) {
    console.log('Service Worker: Fetch', event.request.url);
    // 如果请求方案不是 HTTP 或 HTTPS，则直接返回
    if (!event.request.url.startsWith('http') && !event.request.url.startsWith('https')) {
        return;
    }

    // Network first
    event.respondWith(
        fetch(event.request)
            // Get the result from the server
            .then((response) => {
                console.log('Service Worker: Fetch - From Server', event.request.url);
                const responseClone = response.clone();
                // Update caches
                caches.open(cache_name).then((cache) => {
                    cache.put(event.request, responseClone).then(r => {
                    });
                });
                return response;
            })
            // Can not get the response from server
            .catch(() => {
                // Get data from caches
                console.log('Service Worker: Fetch - From Cache');
                return caches.match(event.request);
            })
    );
});

// self.addEventListener('sync', (event) => {
//     console.log("ServiceWorker - sync")
//     if (event.tag === 'SomeTage') {
//
//     }
//     console.log("Serviceworker Sync Listener");
//     console.info('Event: Sync', event);
// });
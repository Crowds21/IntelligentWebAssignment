// 在 Service Worker 中打开 IndexedDB 数据库
const user_store = "user"
const sight_store = "bird"
const index_name = "bird_sight"
const cache_name = "sight_cache"

// save the request result
self.addEventListener("fetch", function(event) {
   console.log("ServiceWorker - fetch")
});

self.addEventListener('sync',(event) => {
    console.log("ServiceWorker - sync")
    if (event.tag == 'SomeTage'){

    }
    console.log("Serviceworker Sync Listener");
    console.info('Event: Sync', event);
});
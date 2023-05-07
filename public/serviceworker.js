const user_store = "user"
const location_store = "location"
const sight_store = "bird"
const chat_store = "chat"
const index_name = "bird_sight"
const index_version = 5
const indexDB = indexedDB.open(index_name, index_version)


// 在 Service Worker 中打开 IndexedDB 数据库
// const index_name = "bird_sight"
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
    // Network first
    // event.respondWith(
    //     fetch(event.request)
    //         // Get the result from the server
    //         .then((response) => {
    //             console.log('Service Worker: Fetch - From Server', event.request.url);
    //             const responseClone = response.clone();
    //             // Update caches
    //             caches.open(cache_name).then((cache) => {
    //                 cache.put(event.request, responseClone).then(r => {
    //                 });
    //             });
    //             return response;
    //         })
    //         // Can not get the response from server
    //         .catch(() => {
    //             // Get data from caches
    //             console.log('Service Worker: Fetch - From Cache');
    //             return caches.match(event.request);
    //         })
    // );
});

self.addEventListener('sync', (event) => {
    console.log("ServiceWorker - sync")
    if (event.tag === 'saveChat') {
        uploadChatData().then(r => {
            console.log("SaveChat: UploadData Successfully")
        })
    }
    console.log("Serviceworker Sync Listener");
    console.info('Event: Sync', event);
});

async function uploadChatData() {
    let dataList = await getAllData(chat_store);
    let newData = []

    for (let index in dataList) {
        newData.push({
            user: dataList[index].user,
            sight_id: dataList[index].sight_id,
            content: dataList[index].content
        })
    }

    fetch('/saveChatList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    }).then(() => {
        console.log("Upload Chat Successfully")
    })

    await deleteAllData(chat_store)
}

async function getStore(storeName, mode) {
    let db = await indexDB.result
    const transaction = db.transaction([storeName], mode)
    return transaction.objectStore(storeName)
}

async function getAllData(storeName) {
    let dbStore = await getStore(storeName, "readonly")
    const getRequest = dbStore.getAll();
    return new Promise((resolve, reject) => {
        getRequest.onsuccess = (event) => {
            const result = event.target.result;
            resolve(result);
        };
        getRequest.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

async function deleteAllData(storeName) {
    const db = await indexDB.result
    const transaction = db.transaction([storeName], "readwrite")
    let dbStore = transaction.objectStore(storeName)
    const addRequest = dbStore.add(jsonObject)
    const request = dbStore.clear();
    request.onsuccess(e => {
        console.log("DeleteSuccessfully")
    })
    transaction.commit()
}

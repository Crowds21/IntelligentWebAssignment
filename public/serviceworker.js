const user_store = "user"
const location_store = "location"
const sight_store = "bird"
const chat_store = "chat"
const index_name = "bird_sight"
const update_store="identification"
const index_version = 6
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

// Network first
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

    //Network first
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

async function syncData() {
    try {
        const data = await getDataFromIndexedDB();
        await sendDataToServer(data);
    } catch (err) {
        console.error(err);
    }
}

function getDataFromIndexedDB() {
    return new Promise((resolve, reject) => {
        // 连接到 IndexDB 数据库
        const request = self.indexedDB.open(index_name, index_version);
        request.onerror = (event) => {
            console.log('无法连接到 IndexDB 数据库：', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;

            // 从数据库中检索 bird 数据
            const transaction = db.transaction(["bird"], 'readonly');
            const store = transaction.objectStore("bird");
            const request = store.getAll();

            request.onsuccess = (event) => {
                const birds = event.target.result;
                console.log('检索到鸟类数据：', birds);
                resolve(birds);
            };

            request.onerror = (event) => {
                console.log('无法检索鸟类数据：', event.target.error);
                reject(event.target.error);
            };
        };
    });
}
async function sendDataToServer(data) {
    // 将数据发送到服务器进行同步
    await fetch('/insertToMongo', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

self.addEventListener('sync', (event) => {
    console.log("ServiceWorker - sync")
    if (event.tag === 'saveChat') {
        event.waitUntil(uploadChatData())
    }
    if (event.tag === 'updateIdentification'){
        event.waitUntil(uploadNewIdentification())
    }
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
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

async function uploadNewIdentification(){
    let dataList = await getAllData(update_store);
    let newData = []
    for (let index in dataList) {
        newData.push({
            sight_id: dataList[index].sight_id,
            identification: dataList[index].identification
        })
    }
    fetch('/updateSightIdentList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    }).then(r =>{
       console.log("Upload new identification")
    }).then(error =>{
        console.log("Upload new identification error")
    })
    await deleteAllData(update_store)
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
    const request = dbStore.clear();
    request.onsuccess = (e) => {
        console.log("DeleteSuccessfully")
    }
    transaction.commit()
}

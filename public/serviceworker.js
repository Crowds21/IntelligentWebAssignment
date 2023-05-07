// 在 Service Worker 中打开 IndexedDB 数据库
const index_name = "bird_sight"
const cache_name = "sight_cache_v1"
const urlsToCache = [
    '/',
    '/stylesheets/style.css',
    '/sightDetails/'
];
const index_version = 4


// navigator.connection.onchange = (e) => {
//     if (navigator.onLine) {
//         console.log('online');
//         syncData()
//     } else {
//         console.log('offline');
//     }
// }

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



self.addEventListener('sync', event => {
    console.log("SYNC!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
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



// // 转换base64字符串为Buffer对象
// function base64ToBuffer(base64) {
//     const base64Data = base64.replace(/^data:.+?;base64,/, '');
//     return Buffer.from(base64Data, 'base64');
// }
//
// // 上传文件
// function uploadFile(req, res, next) {
//     // 获取base64字符串
//     const base64String = req.body.base64;
//
//     // 转换为Buffer对象
//     const buffer = base64ToBuffer(base64String);
//
//     // 获取文件名和扩展名
//     const originalname = 'myfilename';
//     const extname = '.jpg';
//
//     // 设置文件存储路径和文件名
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, 'public/uploads/');
//         },
//         filename: function (req, file, cb) {
//             cb(null, originalname + '-' + Date.now() + extname);
//         }
//     });
//
//     // 创建Multer对象，上传文件
//     const upload = multer({ storage: storage }).single('file');
//     upload(req, res, function (err) {
//         if (err) {
//             // 处理错误
//             return next(err);
//         }
//
//         // 文件上传成功，将文件路径存入MongoDB
//         const filePath = req.file.path;
//         res.send('Upload success!');
//     });
// }



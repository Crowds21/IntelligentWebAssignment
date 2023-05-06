const user_store = "user"
const location_store = "location"
const sight_store = "bird"
const index_name = "bird_sight"
const index_version = 4


function openDB(dbName, version) {
    return new Promise((resolve, reject) => {
        //  兼容浏览器
        const indexedDB =
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB;
        let db;

        const request = indexedDB.open(dbName, version);

        request.onsuccess = function (event) {
            db = event.target.result; // 数据库对象
            console.log("Open DB Successfully");
            resolve(db);
        };
        request.onerror = function (event) {
            console.log("Open DB fail");
        };
        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            function createStore(storeName) {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, {keyPath: "id", autoIncrement: true})
                }
            }
            createStore(user_store)
            createStore(sight_store)
            createStore(location_store)
            // Create index
            // objectStore.createIndex("link", "link", {unique: false});
            // objectStore.createIndex("sequenceId", "sequenceId", {unique: false});
            // objectStore.createIndex("messageType", "messageType", {unique: false,});
            console.log("Upgrade indexedDB successfully")
        }
    })
}

// 向指定 store 插入数据
function addDataToStore(db, storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.add(data);

        request.onsuccess = function(event) {
            console.log("Data added to the " + storeName + " store", data);
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            console.log("Failed to add data to the " + storeName + " store", event.target.error);
            reject(event.target.error);
        };
    });
}

// 从指定 store 读取数据
function getDataFromStore(db, storeName, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.get(key);

        request.onsuccess = function(event) {
            console.log("Data retrieved from the " + storeName + " store", request.result);
            resolve(request.result);
        };

        request.onerror = function(event) {
            console.log("Failed to retrieve data from the " + storeName + " store", event.target.error);
            reject(event.target.error);
        };
    });
}

async function isDataExist(db, storeName) {
    let dbStore = await getStore(storeName, "readonly")
    const getRequest = dbStore.get(1);
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

async function getStore(storeName, mode) {
    const db = await openDB(index_name, index_version);
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
}

async function insertToStore(storeName, jsonObject) {
    const db = await indexDB.result
    const transaction = db.transaction([storeName], "readwrite")
    let dbStore = transaction.objectStore(storeName)
    const addRequest = dbStore.add(jsonObject)
    addRequest.onsuccess = (event) => {

        const record = jsonObject;
        const blob = convertBase64ToBlob(jsonObject.image, 'image/png');
        const imgUrl = URL.createObjectURL(blob);

        const newRow = document.getElementById('cardRow');
        const newCard = document.createElement('div');
        newCard.classList.add('col-md-4', 'home-page-sight-card');
        newCard.setAttribute('id', record._id);
        newCard.innerHTML = `
        <a href="/sightDetails/${record._id}" class="card-link home-page home-page-sight-card" id="${record._id}">
            <div class="card mb-3">
                <img src="${imgUrl}" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title">${record.identification}</h5>
                    <p class="card-id" style="display: none">${record._id}</p>
                    <p class="card-username">${record.user_name}</p>
                    <p class="card-date">${record.date}</p>
                </div>
            </div>
        </a>
    `;
        newRow.appendChild(newCard);
    }
    addRequest.onerror = (err) => {
        console.log(err)
    }
    transaction.commit()
    console.log("Insert Successfully")
}

/**
 * This asynchronous function checks if data exists in the given store name of the indexedDB common.
 * @param {string} storeName - The name of the store to check for data.
 * @returns {Promise<any>} - Return the first row in the db
 */


/**
 *
 * @param newData A JSON to insert or update
 * @param storeName
 * @param updateData The function to update data.<attribute> = newData.<attribute>
 * @returns {Promise<void>}
 */
async function updateSingleton(newData, storeName, updateData) {

    const data = await isDataExist(storeName)
    const db = indexDB.result
    const transaction = db.transaction(storeName, "readwrite")
    const dbStore = transaction.objectStore(storeName)
    if (data) {
        updateData(data, newData)
        const putRequest = await dbStore.put(data);
        putRequest.onsuccess = (event) => {
            console.log(event)
        }
    } else {
        const addRequest = await dbStore.add(newData);
        addRequest.onsuccess = (event) => {
            console.log(event)
        }
    }
    transaction.commit()
}

function convertBase64ToBlob(base64String) {
    const parts = base64String.split(',');
    const mimeType = parts[0].split(':')[1];
    const b64 = atob(parts[1]);
    let n = b64.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = b64.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mimeType});
}


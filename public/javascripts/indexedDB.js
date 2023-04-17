const user_store = "user"
const sight_store = "bird"
const index_name = "bird_sight"
const handleSuccess = () => {

}

const handleUpgrade = () => {

}


const indexDB = indexedDB.open(index_name)
indexDB.addEventListener("upgradeneeded", handleUpgrade)
indexDB.addEventListener("success", handleSuccess)
indexDB.addEventListener("error", (err) => {

})

function addStore(storeName, jsonObject) {
    const db = indexDB.result
    isStoreExist(storeName)
    const transaction = db.transaction([storeName], "readwrite")
    const dbStore = transaction.objectStore(storeName)
    const addRequest = dbStore.add(jsonObject)

    addRequest.onsuccess = (event) => {
        console.log(event)
    }
    addRequest.onerror = (err) => {
        console.log(err)
    }
    transaction.commit()
}

function getStore(storeName, key) {
    const db = indexDB.result
    isStoreExist(storeName)
    const transaction = db.transaction([storeName], "readonly")
    const dbStore = transaction.objectStore(storeName)
    const getRequest = dbStore.get(key)
    return new Promise((resolve, reject) => {
        getRequest.onsuccess = (event) => {
            const result = event.target.result
            if (result) {
                resolve(result.value)
            } else {
                resolve(null)
            }
        }
        getRequest.onerror = (event) => {
            reject(event.target.error)
        }
    })

}


/**
 * Check if a store exists in the database, create it if it doesn't exist.
 * @param db
 * @param storeName
 */
function isStoreExist(db, storeName) {
    if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {keyPath: "id", autoIncrement: true})
    }
}

function isFirstTime(username) {
    // Find user in indexedDB
    getStore(user_store, username).then(user => {
        return Promise.resolve(!user);
    }).catch(error => {
        console.error(error);
        return Promise.reject(error);
    })
}


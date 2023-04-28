const user_store = "user"
const sight_store = "bird"
const index_name = "bird_sight"
const index_version = 3
const handleSuccess = async (event) => {
    console.log("Open indexedDB successfully")
}


const handleUpgrade = (event) => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains(user_store)) {
        db.createObjectStore(user_store, {keyPath: "id", autoIncrement: true})
    }
    if (!db.objectStoreNames.contains(sight_store)) {
        db.createObjectStore(sight_store, {keyPath: "id", autoIncrement: true})
    }
    console.log("Upgrade indexedDB successfully")
}


const indexDB = indexedDB.open(index_name, index_version)
indexDB.addEventListener("upgradeneeded", event => {
    handleUpgrade(event)
})
indexDB.addEventListener("success", event => {
    handleSuccess(event)
})
indexDB.addEventListener("error", (err) => {

})

function getStore(storeName, mode) {
    let db = indexDB.result
    const transaction = db.transaction([storeName], mode)
    return transaction.objectStore(storeName)
}


async function insertToStore(storeName, jsonObject) {
    const db = indexDB.result
    const transaction = db.transaction([storeName], mode)
    let dbStore = transaction.objectStore(storeName)
    const addRequest = dbStore.add(jsonObject)
    addRequest.onsuccess = (event) => {
        console.log(event)
    }
    addRequest.onerror = (err) => {
        console.log(err)
    }
    transaction.commit()
    console.log("Insert Successfully")
}


async function isUserExist() {
    let dbStore = await getStore(user_store, "readonly")
    const getRequest = dbStore.get(1);
    return new Promise((resolve, reject) => {
        getRequest.onsuccess = (event) => {
            const username = event.target.result;
            resolve(username);
        };
        getRequest.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

async function updateUser(username) {
    // Get the user first.
    // Otherwise, it will close the transaction you created
    const user = await isUserExist()
    const db = indexDB.result
    const transaction = db.transaction(user_store, "readwrite")
    const dbStore = transaction.objectStore(user_store)
    if (user) {
        user.username = username;
        const putRequest = await dbStore.put(user);
        putRequest.onsuccess = (event) => {
            console.log(event)
        }
    } else {
        const addRequest = await dbStore.add({username: username});
        addRequest.onsuccess = (event) => {
            console.log(event)
        }
    }
    transaction.commit()
}
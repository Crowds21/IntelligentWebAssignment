const user_store = "user"
const location_store = "location"
const sight_store = "bird"
const index_name = "bird_sight"
const index_version = 3

const handleSuccess = async (event) => {
    console.log("Open indexedDB successfully")
}


const handleUpgrade = (event) => {
    let db = event.target.result;
    function createStore(storeName){
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, {keyPath: "id", autoIncrement: true})
        }
    }
    createStore(user_store)
    createStore(sight_store)
    createStore(location_store)
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

/**
 * This asynchronous function checks if data exists in the given store name of the indexedDB database.
 * @param {string} storeName - The name of the store to check for data.
 * @returns {Promise<any>} - Return the first row in the db
 */
async function isDataExist(storeName){
    let dbStore = await getStore(storeName, "readonly")
    const getRequest = dbStore.get(1);
    return new Promise((resolve, reject) => {
        getRequest.onsuccess = (event) => {
            const result= event.target.result;
            resolve(result);
        };
        getRequest.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

/**
 *
 * @param newData A JSON to insert or update
 * @param storeName
 * @param updateData The function to update data.<attribute> = newData.<attribute>
 * @returns {Promise<void>}
 */
async function updateSingleton(newData ,storeName,updateData){
    const data = await isDataExist(storeName)
    const db = indexDB.result
    const transaction = db.transaction(storeName, "readwrite")
    const dbStore = transaction.objectStore(storeName)
    if (data){
        updateData(data,newData)
        const putRequest = await dbStore.put(data);
        putRequest.onsuccess = (event) => {
            console.log(event)
        }
    }else {
        const addRequest = await dbStore.add(newData);
        addRequest.onsuccess = (event) => {
            console.log(event)
        }
    }
    transaction.commit()
}
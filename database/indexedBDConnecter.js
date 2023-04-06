const handleUpgrade = (ev) => {
    const db = ev.target.result
    db.createObjectStore("tasks", {keyPath: "id", autoIncrement: true})
}

const handleSuccess = () => {

}

const index_name = "bird_sight"
const user_store = "user"
const indexDB = indexedDB.open(index_name, 1)
indexDB.addEventListener("upgradeneeded", handleUpgrade)
indexDB.addEventListener("success", handleSuccess)
indexDB.addEventListener("error", (err) => {

})


function createStore(storeName, jsonObject) {

}

async function add(storeName, jsonObject, onSuccess) {
    const db = indexDB.result
    const transaction = db.transaction([index_name], "readwrite")
    const dbStore = transaction.objectStore(storeName)
    const addRequest = dbStore.add(jsonObject)
    addRequest.addEventListener("success", onSuccess)
}




// const handleUpgrade = (ev) => {
//     const db = ev.target.result
//     db.createObjectStore({keyPath: "id", autoIncrement: true})
// }

const handleSuccess = () => {

}

const handleUpgrade = () =>{

}

const index_name = "bird_sight"

const user_store = "user"

const sight_store = "bird"

const indexDB = indexedDB.open(index_name, 1)
indexDB.addEventListener("upgradeneeded", handleUpgrade)
indexDB.addEventListener("success", handleSuccess)
indexDB.addEventListener("error", (err) => {

})




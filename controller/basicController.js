module.exports = {
    async saveModel(model, req, res) {
        // The return type of save() is a Promise
        model.save().then(() => {
            res.status(200).send({code: 0, msg: 'Success'})
        }).catch(err => {
            res.status(500).send({code: 1, msg: err.message})
        })
    },

    async updateModel(model, req, res, filter, update) {
        model.updateOne(filter, update).then(() => {
            res.status(200).send({code: 0, msg: 'Success'})
        }).catch(err => {
            res.status(500).send({code: 1, msg: err.message})
        })
    },





    async addStore(storeName, jsonObject, onSuccess) {
        const db = indexDB.result
        this.isStoreExist(storeName)
        const transaction = db.transaction([index_name], "readwrite")
        const dbStore = transaction.objectStore(storeName)
        const addRequest = dbStore.add(jsonObject)
        addRequest.addEventListener("success", onSuccess)
        addRequest.addEventListener("error", (err) => {
            console.log(err)
        })
        transaction.commit()
    },

    async getStore(storeName, key, onSuccess) {
        const db = indexDB.result
        this.isStoreExist(storeName)
        const transaction = db.transaction([index_name], "readonly")
        const dbStore = transaction.objectStore(storeName)
        const getRequest = dbStore.get(key)

        getRequest.addEventListener("success", onSuccess)
        getRequest.addEventListener("error", (err) => {

        })
        transaction.commit()
    },

    /**
     * Check if a store exists in the database, create it if it doesn't exist.
     * @param db
     * @param storeName
     */

    isStoreExist(db, storeName) {
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, {keyPath: "id", autoIncrement: true})
        }
    }


};


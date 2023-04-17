
module.exports = {

    async saveModel(model, req, res) {
        // The return type of save() is a Promise
        model.save().then(() => {
            return {code: 0, msg: 'Success'}
        }).catch(err => {
            return {code: 1, msg: err.message}
        })
    },

    async updateModel(model, req, res, filter, update) {
        model.updateOne(filter, update).then(() => {
            return {code: 0, msg: 'Success'}
        }).catch(err => {
            return {code: 1, msg: err.message}
        })
    },
};


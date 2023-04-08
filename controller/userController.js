let UserModel = require('../model/userModel')
const basicController = require('./basicController');

async function createUserInMongo(req, res) {
    let userData = req.body

    // Operating the database (MongoDB / IndexedDB)
    let userId = generateUserId();
    let deviceId = generateDeviceId();
    let user = new UserModel({
        user_id: userId,
        user_name: userData.user_name,
        device_id: deviceId
    })
    await basicController.saveModel(user, req, res)
    // UPDATE UI

    //
}


async function updateUserInMongo(req, res) {
    let userData = req.body
    await basicController.updateModel(UserModel, req, res,
        {user_id: userData.user_id},
        {$set: {user_name: userData.user_name}}
    )
}


function generateUserId() {

}

function generateDeviceId() {

}

module.exports = {createUserInMongo, updateUserInMongo};
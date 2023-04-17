let UserModel = require('../model/userModel')
const basicController = require('./basicController');

async function createUserInMongo(req, res) {
    let userData = req.body
    // Mock Data
    userData = {
        user_name: 'crowds'
    }
    // Operating the database (MongoDB / IndexedDB)
    let userId = generateUserId();
    let deviceId = generateDeviceId();
    let user = new UserModel({
        user_id: userId,
        user_name: userData.user_name,
        device_id: deviceId
    })
    console.log(user)
    await basicController.saveModel(user, req, res)
}

async function createUserInLocal(username) {
    let data = {username: username}
    const user_store = basicController.user_store
    await basicController.addStore(user_store, data)
}

async function updateUserInMongo(req, res) {
    let userData = req.body
    await basicController.updateModel(UserModel, req, res,
        {user_id: userData.user_id},
        {$set: {user_name: userData.user_name}}
    )
}



function generateUserId() {
    const randomStr = generateRandomString()
    const userId = 'usr' + randomStr
    return userId
}

function generateDeviceId() {
    const randomStr = generateRandomString()
    const deviceId = 'dev' + randomStr
    return deviceId
}

function generateRandomString() {
    const now = new Date();
    const dateStr = now.getFullYear().toString().padStart(4, '0')
        + (now.getMonth() + 1).toString().padStart(2, '0')
        + now.getDate().toString().padStart(2, '0')
        + now.getHours().toString().padStart(2, '0')
        + now.getMinutes().toString().padStart(2, '0');
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomStr = '';
    for (let i = 0; i < 5; i++) {
        randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return '-' + dateStr + '-' + randomStr;
}

module.exports = {createUserInMongo, updateUserInMongo};
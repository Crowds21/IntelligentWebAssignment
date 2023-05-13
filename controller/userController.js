let UserModel = require('../model/userModel')

/**
 * Creates a new user in MongoDB.
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>}
 */
async function createUserInMongo(req, res) {
    let userData = req.body
    // Mock Data
    userData = {
        user_name: 'crowds'
    }
    // Operating the common (MongoDB / IndexedDB)
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

/**
 * Creates a new user in local storage.
 * @async
 * @function
 * @param {string} username - The username for the new user.
 * @returns {Promise<void>}
 */
async function createUserInLocal(username) {
    let data = {username: username}
    // TODO: Implement the logic for creating a new user in local storage.

}

/**
 * Updates an existing user in MongoDB.
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>}
 */
async function updateUserInMongo(req, res) {
    let userData = req.body
    // await basicController.updateModel(UserModel, req, res,
    //     {user_id: userData.user_id},
    //     {$set: {user_name: userData.user_name}}
    // )
}

/**
 * Generates a new user ID.
 * @function
 * @returns {string} - A randomly generated user ID.
 */
function generateUserId() {
    const randomStr = generateRandomString()
    const userId = 'usr' + randomStr
    return userId
}

/**
 * Generates a new device ID.
 * @function
 * @returns {string} - A randomly generated device ID.
 */
function generateDeviceId() {
    const randomStr = generateRandomString()
    const deviceId = 'dev' + randomStr
    return deviceId
}

/**
 * Generates a random string of characters.
 * @function
 * @returns {string} - A randomly generated string.
 */
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
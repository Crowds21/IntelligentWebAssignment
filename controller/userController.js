let UserModel = require('../model/userModel')
let UserController = require('../controller/userController')

class UserController extends BasicController {
    async createUserInMongo(req, res) {
        let userData = req.body

        // Operating the database (MongoDB / IndexedDB)
        let userId = generateUserId();
        let deviceId = generateDeviceId();
        let user = new UserModel({
            user_id: userId,
            user_name: userData.user_name,
            device_id: deviceId
        })
        await this.saveModel(user, req, res)
        // UPDATE UI

        //
    }

    async updateUserInMongo(req, res) {
        let userData = req.body
        await this.updateModel(UserModel, req, res,
            {user_id: userData.user_id},
            {$set: {user_name: userData.user_name}}
        )
    }
}


function generateUserId() {

}

function generateDeviceId() {

}

userController = new UserController()
module.exports = userController
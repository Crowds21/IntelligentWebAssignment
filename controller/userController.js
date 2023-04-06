let UserModel = require('../model/userModel')

exports.createUser = async function (req, res) {
    let userData = req.body
    let userId = generateUserId();
    let deviceId = generateDeviceId();
    let user = new UserModel({
        user_id: userId,
        user_name: userData.user_name,
        device_id: deviceId
    })
    await saveUser(user, req, res)
}

exports.updateUser = async function (req, res) {
    let userData = req.body
    try {
        const result = await UserModel.updateOne(
            {user_id: userData.user_id},
            {$set: {user_name: userData.user_name}}
        );
        res.status(200).send('Update Success')
    } catch (err) {
        res.status(500).send('Invalid data!')
        console.error(err);
    }
}


// TODO extend
async function saveUser(model, req, res) {
    try {
        await model.save()
        res.setHeader('Content-Type', 'application/json')
        res.json({user: user})
    } catch (err) {
        res.status(500).send('Invalid data!')
    }
}

function generateUserId() {

}

function generateDeviceId() {

}
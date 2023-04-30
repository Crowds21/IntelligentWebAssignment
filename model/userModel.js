let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let UserSchema = new Schema(
    {
        user_id: {type: String, require: true, max: 50},
        user_name: {type: String, require: true, max: 50},
        device_id: {type: String, require: true, max: 50},
    }
)

UserSchema.set('toObject', {getters: true});

module.exports = mongoose.model('user',UserSchema,"users")


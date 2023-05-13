let mongoose = require('mongoose')
let Schema = mongoose.Schema;

/**
 * Create a new mongoose model instance for the user collection.
 *
 * @function
 * @param {string} name - The name for the model.
 * @param {UserSchema} schema - The user schema object.
 * @param {string} collection - The name of the MongoDB collection to use for the model.
 * @returns {User} The mongoose model for user collection.
 */
let UserSchema = new Schema(
    {
        user_id: {type: String, require: true, max: 50},
        user_name: {type: String, require: true, max: 50},
        device_id: {type: String, require: true, max: 50},
    }
)

UserSchema.set('toObject', {getters: true});

module.exports = mongoose.model('user',UserSchema,"users")


let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let ChatSchema = new Schema(
    {
        sight_id: {type: String, require: true},
        sender_id: {type: String, require: true, max: 50},
        content: {type: String, require: true, max: 1000},
    }
)

ChatSchema.set('toObject', {getters: true});

module.exports = mongoose.model('chat', ChatSchema, "chats")
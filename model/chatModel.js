let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let ChatSchema= new Schema(
    {
        sender_id: {type: String, require: true, max: 50},
        content: {type: String, require: true, max: 1000},
        date: {type: String, required: true, max:50}
    }
)

ChatSchema.set('toObject', {getters: true, virtuals: true});

let ChatModel = mongoose.model('chat', ChatSchema)
module.exports = ChatModel
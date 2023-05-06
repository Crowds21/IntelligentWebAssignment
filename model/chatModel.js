let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let ChatSchema= new Schema(
    {
        sight:{type:String,requir: true},
        sender_id: {type: String, require: true, max: 50},
        content: {type: String, require: true, max: 1000},
        date: {type: String, required: true, max:50}
    }
)

ChatSchema.set('toObject', {getters: true, virtuals: true});

module.exports= mongoose.model('chat', ChatSchema,"chats")
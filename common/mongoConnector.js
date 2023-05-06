let mongoose = require('mongoose')
let mongo_url = 'mongodb://localhost:27017/bird_sight'

mongoose.Promise = global.Promise

try {
    mongoose.connect(mongo_url).then(r => {})
    console.log("connection to mongodb!");
} catch (err) {
    console.error('MongoDB connection error:', err)
}

let db = mongoose.connection

db.createCollection("sights").then(r => {
    console.log("Create collection: sights")
}).catch( err => {
    console.log("Already Created: sights")
})

db.createCollection("users").then(r => {
    console.log("Create collection: users")
}).catch( err => {
    console.log("Already Created: users")
})

db.createCollection("chats").then(r => {
    console.log("Create collection: chats")
}).catch( err => {
    console.log("Already Created: chats")
})
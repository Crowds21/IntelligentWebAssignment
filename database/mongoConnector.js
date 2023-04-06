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


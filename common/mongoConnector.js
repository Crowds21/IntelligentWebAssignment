// Require Mongoose and set the MongoDB connection URL
const mongoose = require('mongoose');
const mongo_url = 'mongodb://localhost:27017/bird_sight';

// Set the Mongoose promise to the global promise
mongoose.Promise = global.Promise;

// Connect to MongoDB using the Mongoose connection and log a message
mongoose.connect(mongo_url)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error('MongoDB connection error:', err));

// Create a reference to the Mongoose connection
const db = mongoose.connection;

// Define an array of collection names to create
const collectionNames = ["sights", "users", "chats"];

// Use a for...of loop to create each collection and log a message
for (const name of collectionNames) {
    db.createCollection(name)
        .then(() => console.log(`Created collection: ${name}`))
        .catch(() => console.log(`Already created collection: ${name}`));
}

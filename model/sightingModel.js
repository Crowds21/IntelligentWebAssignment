const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title:{type: String, required: true},
    description: { type: String, required: true },
    date: { type: String, required: true },
    userNickName: { type: String, required: true },
    location:{type: String, required: true},
    image: { type: String, required: true }


});

module.exports = mongoose.model("sighting", schema);

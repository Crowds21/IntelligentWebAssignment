const mongoose = require("mongoose");

const SightSchema= mongoose.Schema({
    identification:{type: String, required: true},
    description: { type: String, required: true },
    date: { type: String, required: true },
    user_name: { type: String, required: true },
    location:{type: String, required: true},
    image: { type: String, required: false }
});
SightSchema.set('toObject', {getters: true});
module.exports = mongoose.model("sight", SightSchema,"sights");

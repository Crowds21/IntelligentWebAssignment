const mongoose = require("mongoose");

/**
 * @property {string} identification - The identification of the sight.
 * @property {string} description - The description of the sight.
 * @property {string} date - The date of the sight.
 * @property {string} user_name - The username of the user who added the sight.
 * @property {string} location - The location of the sight.
 * @property {Object} loc - The location coordinates of the sight.
 * @property {string} loc.lat - The latitude of the location coordinates of the sight.
 * @property {string} loc.lng - The longitude of the location coordinates of the sight.
 * @property {string} image - The image of the sight.
 */

const SightSchema = mongoose.Schema({
    identification: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: String, required: true},
    user_name: {type: String, required: true},
    location: {type: String, required: false},
    loc: {
        lat: String,
        lng: String,
        required: false
    },
    image: {type: String, required: false}
});

SightSchema.set('toObject', {getters: true});
module.exports = mongoose.model("sight", SightSchema, "sights");

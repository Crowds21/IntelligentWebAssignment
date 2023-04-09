const SightModel = require("../model/sightModel");
const basicController = require("./basicController");

async function createSightInMongo(req, res) {
    let sightData= req.body
    let user = new SightModel({
        sight_id : sightData.sight_id,
        description: sightData.description,
        date : sightData.date,
        user_name : sightData.user_name,
        location :sightData.location,
        image : sightData.image
    })
    await basicController.saveModel(user, req, res)
}
async function getSightsByLocation(model, currentLocation) {
    const allSights = await model.find();
    const sightsWithDistance = allSights.map(sight => {
        const distance = calculateDistance(currentLocation, sight.location);
        return {sight, distance};
    });

    // Sort the sights by distance in ascending order
    sightsWithDistance.sort((a, b) => a.distance - b.distance);

    // Extract the sorted Sight records without the distance field
    const sortedSights = sightsWithDistance.map(sightWithDistance => sightWithDistance.sight);

    return sortedSights;
}
async function getSightsByDate(model) {
    const sights = await model.find().sort({date: 1});
    return sights
}


function calculateDistance(location1, location2) {
    // Implement the distance calculation between two locations
    // ...
}

module.exports = {createSightInMongo, getSightsByDate, getSightsByLocation}
const SightModel = require("../model/sightModel");

async function insertSight(sightData) {
    let sight = new SightModel({
        identification: sightData.identification,
        description: sightData.description,
        date: sightData.date,
        user_name: sightData.user_name,
        location: sightData.location,
        image: sightData.image
    })
    let result = await sight.save()
    console.log(result)
}

async function getSightList() {
    let data = SightModel.find({})
    return data
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

function initSightCollection(){
    let data = {
        identification: "unknown",
        description: "This is a description",
        date: "2023-02-03 ",
        user_name: "crowds",
        location: "Sheffield",
        image: "https://picsum.photos/100"
    }
    insertSight(data).then(it =>{

    })
}

module.exports = {
    getSightList,
    insertSight,
    getSightsByDate,
    getSightsByLocation
}
const SightModel = require("../model/sightModel");
const Multer = require('multer');
const ObjectId = require('mongodb').ObjectId;
const path = require('path');
const fetch = require('node-fetch')

/**
 * Inserts a new sight into the database.
 * @param {Object} req - The request object containing the sight data.
 * @returns {Promise<void>}
 */
async function insertSight(req) {
    var sightData = req.body;
    let sight = new SightModel({
        device_id: sightData.device_id,
        identification: sightData.identification,
        description: sightData.description,
        date: sightData.date,
        user_name: sightData.user_name,
        location: sightData.location,
        loc: JSON.parse(sightData.loc),
        image: path.basename(req.file.path)
    })
    let result = await sight.save()
    console.log(result)
}

/**
 * Inserts a sight object into the database from IndexDB.
 * @param {Object} sight - The sight object to be inserted.
 * @returns {Promise<void>}
 */
async function insertSightFromIndexDB(sight) {
    let result = await sight.save()
    console.log(result)
}

/**
 * Returns a list of all sights in the database.
 * @returns {Promise<Object[]>}
 */
async function getSightList() {
    let data = SightModel.find({})
    return data
}

/**
 * Returns a list of all sights in the database, sorted by date in descending order.
 * @returns {Promise<Object[]>}
 */
async function getSightListByDateDesc() {
    let data = SightModel.find().sort({date: -1})
    return data;
}

/**
 * Returns the sight with the specified ID.
 * @param {string} id - The ID of the sight to retrieve.
 * @returns {Promise<Object>}
 */
async function getSightById(id) {
    let data_id = new ObjectId(id)
    let data = SightModel.findById(data_id)
    return data
}

/**
 * Returns a list of all sights in the database, sorted by distance from a given location.
 * @param {Object} currentLocation - The location to sort by.
 * @returns {Promise<Object[]>}
 */
async function getSightsByLocation(currentLocation) {
    const allSights = await getSightList()
    const sightsWithDistance = allSights.map(sight => {
        const distance = calculateDistance(currentLocation, sight.loc);
        return {sight, distance};
    });
    sightsWithDistance.sort((a, b) => a.distance - b.distance);
    const sortedSights = sightsWithDistance.map(sightWithDistance => sightWithDistance.sight);
    return sortedSights;
}

/**
 * Returns a list of all sights in the database, sorted by date in ascending order.
 * @param {Object} model - The SightModel to use.
 * @returns {Promise<Object[]>}
 */
async function getSightsByDate(model) {
    const sights = await model.find().sort({date: 1});
    return sights
}

/**
 * Calculates the distance between two locations.
 * @param {Object} currentLocation - The first location.
 * @param {Object} sightLocation - The second location.
 * @returns {number} The distance between the two locations in kilometers.
 */
function calculateDistance(currentLocation, sightLocation) {
    let lat1 = currentLocation.lat
    let lon1 = currentLocation.lng
    let lat2 = sightLocation.lat
    let lon2 = sightLocation.lng
    if (lat1 === lat2 && lon1 === lon2) {
        return 0;
    } else {
        let radlat1 = Math.PI * lat1 / 180;
        let radlat2 = Math.PI * lat2 / 180;
        let theta = lon1 - lon2;
        let radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        // KM
        dist = dist * 1.609344
        return dist;
    }
}

async function updateSightIdentification(sight_id, identification) {
    try {
        const updatedSight = await SightModel.findByIdAndUpdate(
            sight_id,
            {identification: identification},
            {new: true}
        );
        return updatedSight;
    } catch (error) {
        console.error(error);
    }
}


/**
 * Initialize the common and insert data into it,
 * so that testing can be carried out during the development process.
 * @returns {Promise<void>}
 */
async function initSightCollection() {
    let data = [
        {
            identification: "unknown",
            description: "This is a description",
            date: "2023-02-03 ",
            user_name: "crowds",
            location: "Sheffield",
            loc: {
                lat: 53.38101,
                lng: -1.46831
            },
            image: "https://picsum.photos/100"
        },
        {
            identification: "unknown",
            description: "This is a description",
            date: "2023-02-03 ",
            user_name: "crowds",
            location: "Sheffield",
            loc: {
                lat: 53.38101,
                lng: -1.46831
            },
            image: "https://picsum.photos/100"
        }
    ]
    SightModel.find({}).countDocuments((err, count) => {
        if (err) {
            console.log(err);
        } else {
            if (count === 0) {
                SightModel.insertMany(data).then(() => {
                    console.log("Init Successfully")
                })
            }
        }
    })
}

// TODO
function parseImage() {
    let storage = Multer.diskStorage({
        // 指定上传文件的保存目录
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/');
        },
        // 指定上传文件的保存名称
        filename: function (req, file, cb) {
            // 获取上传文件的原始名称
            var original = file.originalname;
            // 获取上传文件的扩展名
            var file_extension = original.split(".");
            // 将文件名设置为当前日期加上扩展名
            let filename = Date.now() + '.' + file_extension[file_extension.length - 1];
            cb(null, filename);
        }
    });
// 创建一个 multer 对象，指定文件的保存方式
    var upload = multer({storage: storage});

}

/**
 * Retrieves information about a bird from the DBpedia knowledge graph.
 * @async
 * @param {string} birdName - The name of the bird to search for.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the bird's name, abstract, and thumbnail, or null if no results are found.
 */
async function getBirdInfoFromGraph(birdName) {
    // birdName = "Domestic goose"
    const sparqlQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?commonName ?scientificName ?description ?uri
    WHERE {
      ?bird rdf:type dbo:Bird ;
            rdfs:label ?commonName ;
            dbo:binomialAuthority ?scientificName ;
            dbo:abstract ?description ;
            foaf:isPrimaryTopicOf ?uri .
      FILTER (langMatches(lang(?commonName), "en"))
      FILTER (langMatches(lang(?description), "en"))
      FILTER (CONTAINS(?commonName, "${birdName}"))
      
    }
    LIMIT 1
  `;
    // FILTER (?commonName = "${birdName}"@en)
    const encodedQuery = encodeURIComponent(sparqlQuery);
    const url = `https://dbpedia.org/sparql?query=${encodedQuery}&format=json`;
    let birdInfo = {
        commonName: "Unknown",
        scientificName: "Unknown",
        description: "Unknown",
        uri: "Unknown"
    }
    try {
        const response = await fetch(url);
        const data = await response.json();
        const results = data.results.bindings[0];

        birdInfo.commonName = results.commonName.value;
        birdInfo.scientificName = results.scientificName.value;
        birdInfo.description = results.description.value;
        birdInfo.uri = results.uri.value;
    } catch (error) {
        return birdInfo
    }
    return birdInfo
}

module.exports = {
    getSightList,
    insertSight,
    getSightsByDate,
    getSightsByLocation,
    initSightCollection,
    getSightById,
    getSightListByDateDesc,
    getBirdInfoFromGraph,
    insertSightFromIndexDB,
    updateSightIdentification
}
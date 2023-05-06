const SightModel = require("../model/sightModel");
const Multer = require('multer');
const ObjectId = require('mongodb').ObjectId;
const path = require('path');

async function insertSight(req) {
    var sightData = req.body;
    let sight = new SightModel({
        identification: sightData.identification,
        description: sightData.description,
        date: sightData.date,
        user_name: sightData.user_name,
        location: sightData.location,
        loc:JSON.parse(sightData.loc),
        image: path.basename(req.file.path)
    })
    let result = await sight.save()
    console.log(result)
}

async function getSightList() {
    let data = SightModel.find({})
    return data
}



async function getSightListByDateDesc() {
    let data = SightModel.find().sort({date: -1})
    return data;
}

async function getSightById(id) {
    let data_id = new ObjectId(id)
    let data = SightModel.findById(data_id)
    return data
}

async function getSightsByLocation( currentLocation) {
    const allSights = await getSightList()
    const sightsWithDistance = allSights.map(sight => {
        const distance = calculateDistance(currentLocation, sight.loc);
        return {sight, distance};
    });
    sightsWithDistance.sort((a, b) => a.distance - b.distance);
    const sortedSights = sightsWithDistance.map(sightWithDistance => sightWithDistance.sight);
    return sortedSights;
}

async function getSightsByDate(model) {
    const sights = await model.find().sort({date: 1});
    return sights
}


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

async function getBirdInfoFromGraph(birdName) {
    const query = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?bird ?label ?abstract ?thumbnail
    WHERE {
      ?bird dbo:class dbo:Bird ;
            rdfs:label ?label ;
            dbo:abstract ?abstract ;
            foaf:depiction ?thumbnail .
     FILTER (LANG(?label) = "en" && LANG(?abstract) = "en" && REGEX(?label, "^${birdName}$", "i")) 
    }`;

    const encodedQuery = encodeURIComponent(query);
    const endpoint = `https://dbpedia.org/sparql?query=${encodedQuery}&format=json`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        if (result.results.bindings.length > 0) {
            const birdInfo = {
                name: result.results.bindings[0].label.value,
                abstract: result.results.bindings[0].abstract.value,
                thumbnail: result.results.bindings[0].thumbnail.value,
            };
            return birdInfo;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching data from DBpedia: ${error}`);
        return null;
    }
}

async function testDBPedia() {
    const query = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?bird ?label
    WHERE {
      ?bird dbo:class dbo:Bird ;
            rdfs:label ?label .
      FILTER (LANG(?label) = "en")
    }
    LIMIT 10
  `;
    const encodedQuery = encodeURIComponent(query);
    const endpoint = `https://dbpedia.org/sparql?query=${encodedQuery}&format=json`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();

        if (result.results.bindings.length > 0) {
            const birds = result.results.bindings.map(bird => {
                return {
                    uri: bird.bird.value,
                    name: bird.label.value
                };
            });

            return birds;
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Error fetching data from DBpedia: ${error}`);
        return [];
    }
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
    testDBPedia
}
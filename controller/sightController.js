const SightModel = require("../model/sightModel");
const Multer = require('multer');

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

async function initSightCollection() {
    let data = [
        {
            identification: "unknown",
            description: "This is a description",
            date: "2023-02-03 ",
            user_name: "crowds",
            location: "Sheffield",
            image: "https://picsum.photos/100"
        },
        {
            identification: "unknown",
            description: "This is a description",
            date: "2023-02-03 ",
            user_name: "crowds",
            location: "Sheffield",
            image: "https://picsum.photos/100"
        }
    ]
    let len = await SightModel.find({}).length
    if (len == 0) {
        SightModel.insertMany(data).then(()=>{
            console.log("Init Successfully")
        })
    }
}

function parseImage(){
    let storage = Multer.diskStorage({
        // 指定上传文件的保存目录
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
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

module.exports = {
    getSightList,
    insertSight,
    getSightsByDate,
    getSightsByLocation,
    initSightCollection
}
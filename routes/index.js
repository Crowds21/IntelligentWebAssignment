var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')
var sightController = require('../controller/sightController')
const {response} = require("express");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const SightModel = require("../model/sightModel");

var storage = multer.diskStorage({
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


/* GET home page. */
router.get('/', async function (req, res, next) {
    res.render('loading')
});

router.get('/index', async function (req, res, next) {
    let location = {
        lat: req.query.lat,
        lng: req.query.lng,
    }
    let byDateData = await sightController.getSightListByDateDesc()
    let byLocationData = await sightController.getSightsByLocation(location)
    res.render('index', {
        byDate: byDateData,
        byLocation: byLocationData,
        title: "sight"
    })
})

router.get('/records', async function (req, res, next) {
    // TODO Get a location from user

    res.render('index', {records: data, title: "sight"});
});

router.get('/maps', function (req, res, next) {
    let result = sightController.testDBPedia()
    // getBirdInfoFromGraph("chicken").then(result =>{
    //     console.log(("BirdInfo"))
    //     console.log(result)
    //
    // })
    res.render('maps')
})
router.get('/sortByDate', async function (req, res, next) {
    let data = await sightController.getSightListByDateDesc()
    console.log(data)
    res.render('index', {records: data});
});

router.get('/sortByDistance', async function (req, res, next) {
    const location = {
        lat: parseFloat(req.query.lat),
        lng: parseFloat(req.query.lng),
    }
    let data = await sightController.getSightsByLocation(location)
    res.render('index', {records: data})
})
router.get('/sightDetails/:id', async function (req, res, next) {
    let id = req.params.id;
    console.log("/sightDetails/" + id)
    let recordData = await sightController.getSightById(id);
    //mock data
    let messages = [{
        username: "Crowds",
        date: "2023/04/10",
        content: "This is a chat msg"
    }, {
        username: "Crowds",
        date: "2023/04/09",
        content: "This is a chat msg"
    }]
    res.render('sightDetails', {record: recordData, messages: messages});
});
router.post('/setUser', function (req, res) {
    userController.createUserInMongo(req, res).then(r => {

    })
});

router.post('/saveSighting', upload.single('image'), async function (req, res) {
    await sightController.insertSight(req)
    return res.status(200).json({message: 'Success'});
});

//Mock
router.get('/sightDetails', function (req, res, next) {
    let data = {
        identification: "unknown",
        description: "This is a description",
        date: "2023-02-03 ",
        user_name: "crowds",
        location: "Sheffield",
        image: "https://picsum.photos/100",
        wiki: "www.baidu.com"
    }

    let messages = [
        {
            username: "Crowds",
            date: "2023/04/10",
            content: "This is a chat msg"
        },
        {
            username: "Crowds",
            date: "2023/04/09",
            content: "This is a chat msg"
        }]
    res.render('sightDetails', {record: data, messages: messages})
})

router.post('/insertToMongo',async function (req,res,next){
// 获取base64字符串
    const base64String = req.body[0].image;

    // 转换为Buffer对象
    const buffer = base64ToBuffer(base64String);

    // 获取文件名和扩展名
    const fileName = Date.now() + '.jpg';
    // 将Buffer对象保存为文件
    console.log("start to generated th filename")
    const filepath = path.join('public', 'uploads', fileName);
    await fs.writeFile(filepath, buffer, (err) => {
        if (err) {
            // 处理错误
            return next(err);
        };
        // Save to MongoDB
        console.log("fileName="+fileName)

        let sight = new SightModel({
            identification: req.body[0].identification,
            description: req.body[0].description,
            date: req.body[0].date,
            user_name: req.body[0].user_name,
            location: req.body[0].location,
            loc:req.body[0].loc,
            image: fileName
        })
        sightController.insertSightFromIndexDB(sight)
        return res.status(200).json({message: 'Success'});
    });
})

function base64ToBuffer(base64) {
    const base64Data = base64.replace(/^data:.+?;base64,/, '');
    return Buffer.from(base64Data, 'base64');
}

module.exports = router;

var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')
var sightController = require('../controller/sightController')
const {response} = require("express");
const multer = require("multer");

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
    console.log("UrlPath: /")
    // await sightController.initSightCollection()
    let data = await sightController.getSightList()
    res.render('index', {records: data});
});
router.get('/maps', function (req, res, next) {
    res.render('maps')
})
router.get('/sortByDate', async function (req, res, next) {
    let data = await sightController.getSightListByDateDesc()
    console.log(data)
    res.render('index', {records: data});
});
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

router.post('/saveSighting',upload.single('image'),async function (req, res) {
    sightController.insertSight(req).then(r => {
        res.send({
            message: "success",
        });
    })
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

module.exports = router;

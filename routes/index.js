var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')
var sightController = require('../controller/sightController')
const {response} = require("express");
/* GET home page. */
router.get('/', async function (req, res, next) {
    await sightController.initSightCollection()
    let data = await sightController.getSightList()
    res.render('index', {records: data});
});

router.get('/sortByDate', async function (req, res, next) {
    let data = await sightController.getSightListByDateDesc()
    console.log(data)
    res.render('index', {records: data});
});
router.get('/sightDetails/:id', async function (req, res, next) {
    const id = req.params.id;
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

router.post('/saveSighting', function (req, res) {
    sightController.insertSight(req.body).then( r => {
    res.send({
            message: "success",
        });
    })
});
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

    let messages = [{
        username: "Crowds",
        date: "2023/04/10",
        content: "This is a chat msg"
    }, {
        username: "Crowds",
        date: "2023/04/09",
        content: "This is a chat msg"
    }]
    res.render('sightDetails', {detail: data, messages: messages})
})

module.exports = router;

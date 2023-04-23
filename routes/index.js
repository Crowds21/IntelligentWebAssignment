var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')
var sightController = require('../controller/sightController')
/* GET home page. */
router.get('/', async function (req, res, next) {
    let data = await sightController.getSightList()
    res.render('index', {records: data});
});
router.get('/detail', function (req, res, next) {
    res.render('detail', {title: 'Sighting Detail'});
});
router.post('/setUser', function (req, res) {
    userController.createUserInMongo(req, res).then(r => {

    })
});

router.post('/saveSighting', function (req, res) {
    sightController.insertSight(req.body).then( r => {
    })
});


module.exports = router;

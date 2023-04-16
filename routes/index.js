var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')

/* GET home page. */
router.get('/', function (req, res, next) {
    userController.createUserInMongo(req, res)
    res.render('index', {title: 'Express'});

});
router.get('/detail', function (req, res, next) {
    res.render('detail', {title: 'Sighting Detail'});
});
router.post('/setUser', function (req, res) {
    userController.createUserInMongo(req, res).then(r => {

    })
});

module.exports = router;

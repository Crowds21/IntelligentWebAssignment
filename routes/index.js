var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Bird Watching'});
});
router.get('/detail', function(req, res, next) {
  res.render('detail', { title: 'Sighting Detail' });
});
router.get('/bird-details', function(req, res, next) {
  res.render('bird-details', { title: 'Bird Watching' });
});
router.get('/bird-details-tabular', function(req, res, next) {
  res.render('bird-details-tabular', { title: 'Bird Watching' });
});
router.post('/setUser', function (req,res){
  userController.createUserInMongo(req, res).then(r =>{
})
})


module.exports = router;
var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/setUser', function (req,res){
  userController.createUserInMongo(req, res).then(r =>{

  })
})

module.exports = router;

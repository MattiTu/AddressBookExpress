var express = require('express');
var router = express.Router();

var db = require('../modules/dbconnection').getUsers;

/* GET home page. */
router.get('/', function(req, res) {
//  res.render('index', { title: 'Express' });
    db(req,res);
});

router.register = function(req,res){
    
    res.render("register",{});
}

/*
router.register_user = function(req,res){
    
    res.render("register_user",{});
}
*/

module.exports = router;

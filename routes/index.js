var express = require('express');
var router = express.Router();
var db = require('./dbconnection');
console.log("db");


/* GET home page. */
router.get('/', function(req, res) {
    console.log("router.get");
    db.connectToDatabase(req,res);
});


/** Register **/

router.register = function(req,res){
    console.log("router.register");
    res.render("register",{errorMsg:'',username:'', password:'', email:''});
}

/** logout **/

router.logout = function(req,res){
    req.session.destroy();
    res.status(301);
    res.setHeader('location','/');
    res.render('index',{title:'Login',error:''});
}

/*
router.showContacts = function(req,res){
    console.log("router.showContacts");
    
    if(req.session.isloggedin){
        db.getContacts(req,res);
    }
    else{
        res.render('index',{title: Login, errorMsg: ''});
    }
}
*/




module.exports = router;

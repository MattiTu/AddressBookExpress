var mongoose = require('mongoose');

var uri = "mongodb://localhost/addressbook";

//Check if we can connect to mongodb...
mongoose.connect(uri,function(err,succ){
    if(err){
        console.log("Error: " + err);
    }
    else{
        console.log("Nicely connected to " + uri);   
    }

});

var Schema = mongoose.Schema;

var addressbookusers = new Schema({
    username:{type:String,index:{unique:true}},
    password:String,
    email:String
});

var AddressBookUser = mongoose.model("AddressBookUser",addressbookusers);

exports.reegisterUser = function(req,res){
    
    console.log(req.body);
    var temp = new AddressBookUser({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
    });
    
    temp.save(function(err){
        if(err){
            res.render('myerror',{});
        }
        else{
            res.redirect('/');
        }
    });
}

exports.getUsers = function(req,res){
    console.log('getUsers');
    AddressBookUser.find(function(err,data){
    
        if(err){
            res.render("myerror",{});
        }
        else{
            res.render('index',{addressbookuser_data:data});
        }
    });
}

exports.getUserInfo = function(req,res){
    
    console.log("function called");
    console.log(req.query);
    AddressBookUser.findById(req.query.id,function(err,data){
        if(err){
            res.render('myerror');
        }
        else {
//            console.log(data);
            res.render('addressbookuserinfo',data);
        }
    });
    
}
// Define database

var mongoose = require('mongoose');
var uri = "mongodb://localhost/addressbook";


//if(process.env.OPENSHIFT_MONGODB_DB_URL){
//  uri = process.env.OPENSHIFT_MONGODB_DB_URL + "addressbook";
//}


/** Connect to database **/

exports.connectToDatabase = function(req,res){

    console.log("connectToDatabase");
    if(!mongoose.connection.readyState){

        //Check if we can connect to mongodb...
        mongoose.connect(uri,function(err,succ){
            if(err){
                console.log("Error in database connection: " + err);
                console.log('<render error>');
                res.render('error', {error: err, error_info: 'Error in database connection!'});
            }
            else{
                console.log("Connected to database: " + uri);   
                console.log('<render index>');
                res.render('index',{title:'Login',errorMsg:'OK. Connected.'});
            }
        });
    }
    else
    {
        console.log("Already connected to database");
        console.log('<render index>');
        res.render('index',{title:'Login',errorMsg:''});
    }
    console.log("connectToDatabase done");   
}


/** Define User database **/

var Schema = mongoose.Schema;

var user = new Schema({
    username:{type:String,index:{unique:true}},
    password:String,
    email:String
});

var User = mongoose.model('User',user);
exports.User = User;


/** Define address book for user **/

var addressbookcol = new Schema({
    owner:String,
    name:String,
    address:String,
    email:String,
    phone:String,
    birthday:Date,
    otherInfo:String,
    imagePath:String
});

var AddressBook = mongoose.model('AddressBook',addressbookcol);
exports.AddressBook = AddressBook;    



/** Create new user **/

exports.registerUser = function(req,res){
    
    console.log('exports.registerUser: '+req.body);
    var temp = new User({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
    });
    
    temp.save(function(err){
        console.log('temp.save');
        if(err){
            console.log('Error');
            if (err.code === 11000) {
                console.log('render register>');
                res.render('register',{errorMsg: 'Username already exists!',
                                       username:req.body.username,
                                       password:req.body.password,
                                       email:req.body.email});
            } 
            else {
                console.log('render register>');
                res.render('register',{errorMsg: 'Cannot add the user to the database!',
                                       username:req.body.username,
                                       password:req.body.password,
                                       email:req.body.email});
            }
        }
        else{
            console.log('User registered to database');
            console.log('render index>');
            res.render('index', {title: 'Login', errorMsg: ''});
        }
    });
    console.log("registerUser done");   
}


/** loginUser
 *
 *    Called in login request (Login button pressed)  
 **/

exports.loginUser = function(req,res) {

    console.log('loginUser: '+req.body.username+' '+req.body.password);

    // Search data from database
    User.findOne({username: req.body.username, password: req.body.password}, function(err,data) {

        if (err) {
            console.log('loginUser: Access to database failed!');
            console.log('<render index>');
            res.render('index', {error: 'Access to database failed! '+err});
        } 
        else {
            console.log('loginUser: database found');
            if (data !== null) {
                console.log('loginUser: data found');
                console.log('Username='+data.username+' Password='+data.password+' logged in');
                console.log('Username='+req.session.username+' Password='+req.session.password+' logged in');
                req.session.isloggedin = true;
                req.session.username = data.username;
                console.log('#redirect /contacts#');
                res.redirect('/contacts');
            } 
            else {
                console.log('loginUser: data is null');
                console.log('<render index>');
                res.render('index', {error: 'Username or password incorrect!'});
            }
        }
    });
}


/** showContacts
 *
 *
 **/

exports.showContacts = function(req,res){
    console.log("exports.showContacts");
    
    if(req.session.isloggedin){

        AddressBook.find({owner:req.session.username},function(err,data){
        
            if(err){
                console.log('showContacts: Access to database failed!');
                console.log('<render error>');
                res.render('error', {errorMsg: 'Access to database failed! '+err});
            }
            else{
                console.log('showContacts: Database found');
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                console.log('<render user_contacts>');
                res.render('user_contacts', {username:req.session.username,addresses:data});
            }
        });
    }
    else{
        console.log('<render index>');
        res.render('index',{title: Login, errorMsg: ''});
    }
}
    

/** 
 *  open newContactForm
 **/

exports.openNewContactForm = function(req,res){
    console.log('exports.openNewContactForm');
    if(req.session.isloggedin){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('new_contact',{errorMsg:'',buttonText:'Save',path:'/new_contact_save',header:'Add new contact',data:{}});
    }
    else{
        res.render('index',{title:'Login',error:''});
    }
    console.log('exports.openNewContactForm done');        
}



/** 
 *  save newContactForm data
 **/

exports.saveNewContactFormData = function(req,res){
    console.log('exports.saveNewContactFormData');

    var path = process.cwd() + '/images/';
    console.log('1 path = '+path);

    console.log(req.files.photo);
    if(req.files.photo === undefined){
        console.log('default photo');
        path += 'default.png';
    }
    else{
        console.log('photo exists');
        path += req.files.photo.name;
    }

    console.log('2 path = '+path);

    console.log("  req.session.username="+req.session.username);   
    console.log("  name="+req.body.name);   
    console.log("  address="+req.body.address);   
    console.log("  email="+req.body.email);   
    console.log("  phone="+req.body.phone);   
    console.log("  birthday="+req.body.birthday);   
    console.log("  extrainfo="+req.body.extrainfo);   
    console.log("  path="+path);   
    
    var temp = new AddressBook({
        owner:req.session.username,
        name:req.body.name,
        address:req.body.address,
        email:req.body.email,
        phone:req.body.phone,
        birthday:new Date(req.body.birthday),
        otherInfo:req.body.extrainfo,
        imagePath:path
    });

    console.log("saveNewContactFormData 2");   
    console.log("  req.session.username="+req.session.username);   
    console.log("  owner="+temp.owner);   
    console.log("  name="+temp.name);   
    console.log("  address="+temp.address);   
    console.log("  email="+temp.email);   
    console.log("  phone="+temp.phone);   
    console.log("  birthday="+temp.birthday);   
    console.log("  otherInfo="+temp.otherInfo);   
    console.log("  imagePath="+temp.imagePath);   

    temp.save(function(err){
        if(err){
            console.log("saveNewContactFormData 4  Error.code="+err.code);   
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            console.log('<render new_contact>');
//            res.redirect('/contacts');
            res.render('new_contact',{errorMsg:'',buttonText:'Save',path:'/new_contact_save',header:'Add new contact',data:{}});
        }
        else{
            console.log("saveNewContactFormData 5");   
            console.log('#redirect /contacts#');
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.redirect('/contacts');
        }
    });
    console.log("saveNewContactFormData done");   
}


/** 
 *  open newContactForm
 **/

exports.getContactInfo = function(req,res){
    console.log('exports.getContactInfo');
    
    if(req.session.isloggedin){
        
        AddressBook.findById(req.query.id,function(err,data){
            if(err){
                console.log('getContactInfo err=');
                console.log('getContactInfo data=');
                res.render('error');
//                res.render('index');
            }
            else {
                console.log('getContactInfo data='+data);
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                console.log('<render contact_info>');        
                res.render('contact_info', data);            
            }
        });
    }
    else{
        console.log('<render index>');        
        res.render('index',{title:'Login',error:''});
    }
    console.log('exports.getContactInfo done');        
}

exports.showImage = function(req,res){

    console.log('exports.showImage');
    
    if(req.session.loggedin)
    {
        database.Address.findById(req.query.id,function(err,data){
            if(err){
                res.render('error');
            }
            else{
                res.sendfile(data.imagePath);
            }
        });
    }
    else{
        res.render('index',{title:'Login',error:''});
    }
    console.log('exports.showImage done');
}


exports.modifyUser = function(req,res){
    
    console.log('exports.modifyUser');

    if(req.session.loggedin)
    {
        AddressBook.findOne(req.query.id,function(err,user_data){
            if(err){
                res.render('error');
            }
            else{
                res.render('modify_contact',user_data);
            }
        });
    }
    else{
        res.render('index',{title:'Login',error:''});
    }
    console.log('exports.modifyUser done');
}

exports.saveModifications = function(req,res){
    
    console.log('exports.saveModifications');

    if(req.session.loggedin){
        
        AddressBook.findOne(req.query.id,function(err,user_data){
            
            user_data.name = req.query.name;
            user_data.address = req.query.address;
            user_data.email = req.query.email;
            user_data.phone = req.query.phone;
            user_data.birthday = user_data.birthday;
            user_data.otherInfo = req.query.extrainfo;
            user_data.imagePath = user_data.imagePath;
            user_data.save(function(err){
                
                if(err){
                    console.log(err);
                    res.render('error');
                }
                else{
                    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    res.render('contact_info',user_data);
                }
            });
        });
    }
    else{
        res.render('index',{title:'Login',error:''});
    }
    console.log('exports.saveModifications done');
}

exports.deleteContact = function(req,res){
    
    console.log('exports.deleteContact');

    AddressBook.findOne(req.query.id,function(err,user_data){
        user_data.remove();
        res.send('OK');
    });

    console.log('exports.deleteContact done');
}
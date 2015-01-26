var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//npm install multer
var multer = require('multer');

var app = express();
var session = require('express-session');
//app.use(session({secret:'asd34gfd4AgsFdfg34234'}));
app.use(session({
  cookie:{path:'/', httpOnly:true, maxAge:null},
  secret: '0',
  resave: false,
  saveUninitialized: true
}));

var index = require('./routes/index');
var db = require('./routes/dbconnection');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './images/'}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/register', index.register);
app.use('/register_user',db.registerUser);
//app.use('/get_users',db.getUsers);
app.use('/login',db.loginUser);
app.use('/contacts',db.showContacts);
app.use('/new_contact',db.openNewContactForm);
app.use('/new_contact_save',db.saveNewContactFormData);
app.use('/logout', index.logout);
app.use('/contact_info',db.getContactInfo);
app.use('/show_image',db.showImage)
app.use('/modify',db.modifyUser);
app.use('/changes',db.saveModifications);
app.use('/delete',db.deleteContact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log('app.js: Error handling');
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

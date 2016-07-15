var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

require('./models/Posts');
require('./models/Comments');
require('./models/Users');
require('./config/passport');


mongoose.connect('mongodb://localhost/news');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// open a connection with the news database running on our Mongo server


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var API500px = require('500px');
api500px = new API500px('NGELN6iDrvzFX5vxJhVJCg9heHNseePK8T5yAFal');

api500px.users.getGallery ('15693715', {image_size: 6, rpp: 100}, function(error, results) {
  if (error) {
    return console.log(error);
  }



  var randomIndex = Math.floor((Math.random() * results.photos.length - 1) + 0);
  console.log(Math.abs(randomIndex));
  var randomImageUrl = results.photos[randomIndex].image_url;
 console.log(randomImageUrl);
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
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

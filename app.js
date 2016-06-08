'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// database connection initialization
require('./lib/connectMongoose').connect();

// load models
require('./models/Advert');
require('./models/PushToken');
require('./models/User');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', require('./routes/api/v1/users'));
app.use('/api/v1/tags', require('./routes/api/v1/tags'));
app.use('/api/v1/tokens', require('./routes/api/v1/tokens'));
app.use('/api/v1/adverts', require('./routes/api/v1/adverts'));

/**
 * @api {get} /images/adverts/:image Get adverts images
 * @apiName GetImages
 * @apiGroup Images
 * @apiVersion 1.0.0
 * @apiDescription This /GET request returns the image associated with an advert.
 *
 * @apiParam {String} image The name of the image to get (i.e. audi.png).
 *
 * @apiSuccess {Image} Returns directly the requested image.
 */
app.use('/images/adverts', express.static('./public/images'));

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
  /*jshint unused: false*/
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    return res.json({ success: false, error: err, description: err.message });
  });
  /*jshint unused: true*/
}

// production error handler
// no stacktraces leaked to user
/*jshint unused: false*/
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.json({ success: false, error: err.message });
});
/*jshint unused: true*/

module.exports = app;

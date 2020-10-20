var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');

var Jimp = require("jimp");
const inputFolder = './public/images/';
const processedFolder = './public/compressed-images/';
const fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { AUTO } = require('jimp');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')))
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// By default, all .png and .jpg images will be scaled to 1920xY and compressed to 70%.
// If you want an image to be skipped, make the file extension in all caps (.PNG instead of .png)
// Images smaller than 1080p may want to be skipped (the logo)

fs.readdir(inputFolder, (err, files) => {
  files.forEach(file => {
    if (file.endsWith(".jpg") || file.endsWith(".png")) {
      resizeImage(file);
    }
  });
});

function resizeImage(fileName) {
  Jimp.read(inputFolder + fileName).then(function (image) {
    if(image.scale)
    image
        .resize(1920, Jimp.AUTO)
        .quality(70)
        .write(processedFolder + fileName);
  })

  console.log("Image compressed: " + processedFolder + fileName)
}

module.exports = app;

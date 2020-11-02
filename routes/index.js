var express = require('express');
var router = express.Router();

var data = require('../database/data-access')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  data.getData()
});

/* GET schedule page. */
router.get('/schedule', function(req, res, next) {
  res.render('schedule', { title: 'Express' });
  data.getData()
});

module.exports = router;

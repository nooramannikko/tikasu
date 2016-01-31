var express = require('express');
var router = express.Router();

var Lippu = require('../models/lippu');
/* GET home page. */
router.get('/', function(req, res, next) {
  Lippu.fetchAll().then(function (collection) {
    console.log(collection.toJSON());
  });
});

module.exports = router;
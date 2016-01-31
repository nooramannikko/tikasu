var express = require('express');
var router = express.Router();

var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');
/* GET home page. */
router.get('/', function(req, res, next) {
  Lippu.fetchAll().then(function (collection) {
    console.log(collection.toJSON());
  });
  Tapahtuma.fetchAll().then(function (collection) {
    console.log(collection.toJSON());
    return collection.toJSON();
  });
});

module.exports = router;
var express = require('express');
var router = express.Router();

var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Tässä api dokumentaatio ehkä mahollisesti");
});

router.get('/tapahtumat', function(req,res,next) {
  Tapahtuma.fetchAll().then(function (collection) {
      console.log("tapahtumatiedot listattu");
      res.send(collection.toJSON());
    });
});



module.exports = router;
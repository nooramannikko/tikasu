var express = require('express');
var router = express.Router();
var lasse = require('../models/lasse')

/* GET home page. */
router.get('/', function(req, res, next) {
  return lasse.print;
});

module.exports = router;
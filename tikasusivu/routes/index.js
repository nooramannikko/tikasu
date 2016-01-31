var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LippuLasse' });
});

var tapahtumat = [{'nimi': 'tapahtuma1', 'paikka': 'areena'}, {'nimi': 'tapahtuma2', 'paikka': 'areena'}];

/* GET event listing */
router.get('/events', function(req, res, next){
    res.render('event/index', {title: 'Tapahtumalistaus', events: tapahtumat});
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LippuLasse' });
});

var events = [{'nimi': 'tapahtuma1', 'paikka': 'hartwall areena'}, {'nimi': 'tapahtuma2', 'paikka': 'cupola'}];

/* GET event listing */
router.get('/events', function(req, res, next){
    res.render('event/index', {title: 'Tapahtumalistaus', events: events});
});

module.exports = router;

var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../auth');

var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');

function logout(req, res){
  userNowLoggedIn = null;
  req.logout();
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}

router.post('/logout', logout);

router.post('/', passport.authenticate('local'),
    function (req, res) {
        res.redirect('/events');
    },
    function(err) {
        res.redirect('index');
    });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LippuLasse' });
});

/* GET event listing */
router.get('/events', auth.check, function(req, res, next){
  Tapahtuma.fetchAll().then(function (events) {
    if (events){
      res.render('event/index', {title: 'Tapahtumalistaus', events: events.toJSON()});
    } else {
      res.status(404).json({error: 'EventNotFound'})
    }
  }).catch(function(err){
    res.status(500).json({error: err});
  });
    
});

module.exports = router;

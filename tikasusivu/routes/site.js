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

router.get('/logout', logout);

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('login', { message: "Tarkista tunnus ja salasana" }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.render('index', { login: true });
    });
  })(req, res, next);

});

/* GET home page. */
router.get('/', auth.check, function(req, res, next) {
  res.render('index', { title: 'LippuLasse', login: req.auth });
});

router.get('/login', function(req,res,next) {
  res.render('login');
});

/* GET event listing */
router.get('/events', auth.check, function(req, res, next){
  if(req.auth) {
    Tapahtuma.fetchAll({withRelated: ['kategoria', 'osoite']}).then(function (events) {
      if (events){
        res.render('event/index', {events: events.toJSON(), login: true});
      } else {
        res.status(404).json({error: 'EventNotFound'})
      }
    }).catch(function(err){
      console.error(err);
      res.status(500).json({error: err});
    });
  }
  else {
    res.render('login', { message: "Ole hyvä ja kirjaudu sisään", login: false});
  }
  
});

/*GET admin panel*/

router.get('/admin', auth.check, function(req,res,next) {
  if(req.auth) {
    res.render('admin', {login: true});
  }
  else {
    res.render('index', {login: false});
  }
});

module.exports = router;

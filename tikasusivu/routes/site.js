var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../auth');

var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');
var Tapahtumanjarjestaja = require('../models/tapahtumanjarjestaja');
var Vastuuhenkilo = require('../models/vastuuhenkilo');

function logout(req, res){
  req.logout();
  req.session.destroy(function (err) {
    if(err) {res.sendStatus(500)}
    res.redirect('/');
  });
}

router.get('/logout', logout);

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) { return next(err); }
    if (!user) { return res.render('login', { message: "Tarkista tunnus ja salasana" }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.render('index', { login: true, name: user.attributes.nimi });
    });
  })(req, res, next);

});

/* GET home page. */
router.get('/', auth.check, function(req, res) {
  if (req.auth) {
    res.render('index', {title: 'LippuLasse', login: true, name: req.user.nimi});
  } else {
    res.render('index', {title: 'LippuLasse', login: false});
  }

});

router.get('/login', function(req,res) {
  res.render('login');
});

/* GET event listing */
router.get('/events', auth.check, function(req, res){
  if(req.auth) {
    Tapahtuma.fetchAll({withRelated: ['kategoria', 'osoite']}).then(function (events) {
      if (events){
        console.log(events.toJSON());
        res.render('event/index', {events: events.toJSON(), login: true, name: req.user.nimi});
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
router.get('/admin', auth.check, function(req,res) {
  if(req.auth) {
    // For whatever reason related tables are not working for anything else than Tapahtuma.......
    Vastuuhenkilo.where({tunnus: req.user.tunnus}).fetch({withRelated: ['tapahtumanjarjestajaobj', 'tapahtumanjarjestajaobj.osoiteobj']}).then(function (vhlo) {
      if (vhlo){
        console.log(vhlo.toJSON());
        //console.log(vhlo.tapahtumanjarjestajaobj.related('osoite').toJSON());
        res.render('admin', {data: vhlo.toJSON(), login: true, name: req.user.nimi});
      } else {
        res.status(404).json({error: 'UserNotFound'})
      }
    }).catch(function(err){
      console.error(err);
      res.status(500).json({error: err});
    });
  } else {
    res.render('index', {login: false});
  }
});

module.exports = router;

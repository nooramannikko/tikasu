var express = require('express');
var router = express.Router();

var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');

var session = require('express-session');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;

var Vastuuhenkilo = require('../models/vastuuhenkilo');

router.use(session({
  secret: 'tikasulaarniottaret',
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new BasicStrategy(
  function(username, password, done) {
    Vastuuhenkilo.where({tunnus: username, salasana: password}).fetch().then(function(user){
        if (user)
        {
            return done(null, user);
        }
        else
        {
            return done(null, false);
        }
    });
  }
));

var basicAuth = passport.authenticate('basic', {session: true});

function checkAuth(req, res, next) {
  if (req.user) {
    next();
  }
  else {
    basicAuth(req, res, next);
  }
}

passport.use(new LocalStrategy( 
  function(username, password, done) {
    Vastuuhenkilo.where({tunnus: username, salasana: password}).fetch().then(function(user){
        if (user)
        {
            return done(null, user);
        }
        else
        {
            return done(null, false);
        }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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

var tapahtumat = [{'nimi': 'tapahtuma1', 'paikka': 'areena'}, {'nimi': 'tapahtuma2', 'paikka': 'areena'}];

/* GET event listing */
router.get('/events', checkAuth, function(req, res, next){
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
router.get('/api/tapahtumat', checkAuth);
router.get('/api/v1/tapahtumat', checkAuth);

module.exports = router;

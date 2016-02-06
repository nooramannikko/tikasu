var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../auth');

var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');
var Tapahtumanjarjestaja = require('../models/tapahtumanjarjestaja');
var Vastuuhenkilo = require('../models/vastuuhenkilo');
var Kategoria = require('../models/kategoria');

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

router.post('/events', auth.check, function(req, res){
  if(req.auth) {
    console.log(req.body);
    Tapahtuma.forge({
      nimi: req.body.eventName,
      alv: parseInt(req.body.alv)
    }).save()
      .then(function (screen) {
        res.render('admin');;
      }).catch(function (error) {
          console.log(error);
          res.status(500).json('An error occured');
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
        //console.log(vhlo.toJSON());
        // Get all vhlos based on organizer
        Vastuuhenkilo.where({tapahtumanjarjestaja: vhlo.toJSON().tapahtumanjarjestaja}).fetchAll().then(function (vhlos) {
          if (vhlos) {
            //console.log(vhlos.toJSON());
            var vhloIds = [];
            for (var i = 0; i < vhlos.length; i++){
              vhloIds.push(vhlos.toJSON()[i].id);
            }
            Tapahtuma.where('vastuuhenkilo', 'IN', vhloIds).fetchAll({withRelated: ['kategoria', 'osoite']}).then(function (events) {
              if (events){
                //console.log(events.toJSON());
                var eventsIds = [];
                for (var i = 0; i < events.length; i++){
                  eventsIds.push(events.toJSON()[i].id);
                }
                // Get tickets for events
                // How to make query with tapahtuma IN evenIds AND tila = 1 ??
                Lippu.where('tapahtuma', 'IN', eventsIds).fetchAll().then(function (tickets) {
                  if (tickets){
                    var eventList = [];
                    for (var j = 0; j < events.length; j++){
                      var count = 0;
                      for (var k = 0; k < tickets.length; k++){
                        if (tickets.toJSON()[k].tila == 1){
                          count += 1;
                        }
                      }
                      eventList.push({
                        nimi: events.toJSON()[j].nimi,
                        alkuaika: events.toJSON()[j].alkuaika,
                        loppuaika: events.toJSON()[j].loppuaika,
                        osoite: events.toJSON()[j].osoite.postiosoite + ', ' + events.toJSON()[j].osoite.postinumero,
                        kategoria: events.toJSON()[j].kategoria.nimi,
                        liput: count
                      });
                    }
                    // Get all categories
                    Kategoria.fetchAll().then(function (categories) {
                      if (categories){
                        console.log(categories.toJSON());
                        res.render('admin', {data: vhlo.toJSON(), events: eventList, categories: categories.toJSON(), vhlos: vhlos.toJSON(), username: req.user.tunnus, login: true, name: req.user.nimi});
                      } else {
                        res.status(404).json({error: 'CategoryNotFound'})
                      }
                    });
                    //res.render('admin', {data: vhlo.toJSON(), events: eventList, login: true, name: req.user.nimi});
                  } else {
                    res.status(404).json({error: 'TicketNotFound'})
                  }
                });
              } else {
                res.status(404).json({error: 'EventNotFound'})
              }
            });
          } else {
            res.status(404).json({error: 'UserNotFound'})
          }
        });
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

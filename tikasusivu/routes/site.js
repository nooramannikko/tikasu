var express = require('express');
var router = express.Router();
var passport = require('passport');
var auth = require('../auth');

var Bookshelf = require('../database');
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
router.get('/', function(req, res) {
  if (req.user) {
    res.render('index', {title: 'LippuLasse', login: true, name: req.user.nimi});
  } else {
    res.render('index', {title: 'LippuLasse', login: false});
  }

});

router.get('/login', function(req,res) {
  res.render('login');
});

/* GET event listing */
router.get('/events', function(req, res){
  if(req.user) {
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

/* POST new event*/
router.post('/events', function(req,res){
  if(req.user) {
    console.log("Creating new event:");
    console.log(req.body);
    // Creating new event
    Tapahtuma.forge({
      nimi: req.body.eventName,
      alv: parseInt(req.body.alv),
      alkuaika: req.body.startTime,
      loppuaika: req.body.endTime,
      vastuuhenkilo: req.body.vhlo,
      kategoria: req.body.category
    }).save()
        .then(function (screen) {
          res.redirect(req.get('referer'));
        }).catch(function (error) {
      console.log(error);
      res.status(500).json('An error occured');
    });
  }
  else {
    res.render('login', { message: "Ole hyvä ja kirjaudu sisään", login: false});
  }
});

router.post('/deleteEvent/:id', function(req, res){
  console.log("delete");
  if(req.user){
    var id = req.params['id'];
    Tapahtuma.forge({id: id}).fetch({require: true}).then(function (event) {
    if (event) {
      event.destroy().then(function() {
        res.redirect(req.get('referer'));
      }).catch(function(err) {
        res.status(500).json({error: err})
      })
    } else {
      res.status(404).json({error: 'EventNotFound'})
    }
  }).catch(function(err) {
    res.status(500).json({error: err});
  })
  }
});

router.get('/editEvent/:id', function(req,res){
  console.log("edit");
  if (req.user){
    var id = req.params['id'];
    Tapahtuma.where({id: id}).fetch({withRelated: ['kategoria', 'osoite']}).then(function (event) {
      if (event){
        var startTime = event.attributes.alkuaika.getFullYear() +  "-" + ("0"+event.attributes.alkuaika.getMonth()).slice(-2) + "-" + ("0"+event.attributes.alkuaika.getDate()).slice(-2) + "T" + ("0"+event.attributes.alkuaika.getHours()).slice(-2) + ":" + ("0"+event.attributes.alkuaika.getMinutes()).slice(-2);
        var endTime = event.attributes.alkuaika.getFullYear() +  "-" + ("0"+event.attributes.loppuaika.getMonth()).slice(-2) + "-" + ("0"+event.attributes.loppuaika.getDate()).slice(-2) + "T" + ("0"+event.attributes.loppuaika.getHours()).slice(-2) + ":" + ("0"+event.attributes.loppuaika.getMinutes()).slice(-2);
        Kategoria.fetchAll().then(function (categories) {
          if (categories) {
            res.render('event/edit', {event: event.toJSON(), categories: categories.toJSON(), username: req.user.tunnus, userid: req.user.id, startTime: startTime, endTime: endTime, login: true, name: req.user.nimi});
          } else {
            res.status(404).json({error: 'CategoryNotFound'})
          }
        })
      } else {
        res.status(404).json({error: 'EventNotFound'})
      }
    }).catch(function(err){
      res.status(500).json({error: err});
    })
  } else {
    res.render('login', { message: "Ole hyvä ja kirjaudu sisään", login: false});
  }
});

/*GET admin panel*/
router.get('/admin', function(req,res) {
  if(req.user) {
    Vastuuhenkilo.where('tunnus', req.user.tunnus).fetch({withRelated: ['tapahtumanjarjestajaobj', 'tapahtumanjarjestajaobj.osoiteobj']}).then(function (vhlo) {
      if (vhlo){
        // Get all vhlos based on organizer
        Vastuuhenkilo.where({tapahtumanjarjestaja: vhlo.attributes.tapahtumanjarjestaja}).fetchAll().then(function (vhlos) {
          if (vhlos) {
            //console.log(vhlos.toJSON());
            var vhloIds = [];
            vhlos.forEach(function(hlo) {
              vhloIds.push(hlo.attributes.id)
            });
            Tapahtuma.where('vastuuhenkilo', 'IN', vhloIds).fetchAll({withRelated: ['kategoria', 'osoite']}).then(function (events) {
              if (events){
                var eventsIds = [];
                var eventsJson = events.toJSON();
                console.log(eventsJson);
                eventsJson.forEach(function(event) {
                  eventsIds.push(event.id)
                });
                // Get tickets for events
                // How to make query with tapahtuma IN evenIds AND tila = 1 ??
                Lippu.where('tapahtuma', 'IN', eventsIds).where('tila', 1).fetchAll().then(function (tickets) {
                  var eventList = [];
                  eventsJson.forEach(function(event) {
                    eventList.push({
                      id: event.id,
                      nimi: event.nimi,
                      alkuaika: event.alkuaika,
                      loppuaika: event.loppuaika,
                      osoite: event.osoite.postiosoite + ', ' + event.osoite.postinumero,
                      kategoria: event.kategoria.nimi,
                      liput: tickets.length
                    });
                  });
                  // Get all categories
                  Kategoria.fetchAll().then(function (categories) {
                    if (categories){
                      res.render('admin', {data: vhlo.toJSON(), events: eventList, categories: categories.toJSON(), vhlos: vhlos.toJSON(), username: req.user.tunnus, login: true, name: req.user.nimi});
                    } else {
                      res.status(404).json({error: 'CategoryNotFound'})
                    }
                  });
                    //res.render('admin', {data: vhlo.toJSON(), events: eventList, login: true, name: req.user.nimi});
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

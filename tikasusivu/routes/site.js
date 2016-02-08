var express = require('express');
var router = express.Router();
var passport = require('passport');
var moment = require('moment');
var Bookshelf = require('../database');
var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');
var Osoite = require('../models/osoite');
var Vastuuhenkilo = require('../models/vastuuhenkilo');
var Kategoria = require('../models/kategoria');
var Postinumero = require('../models/postinumero');
var Postitoimipaikka = require('../models/postitoimipaikka');
var Raportti = require('../models/raportti');

var msg;
function messageBox () {
  var message = "";
  var isReadbool = false;
  return {
    setMessage: function (text) {
      message = text;
      isReadbool = false;
      return message;
    },
    getMessage: function () {
      isReadbool = true;
      return message;
    },
    isRead: function () {
      return isReadbool;
    }
  }
}

msg = messageBox();

var alert;
function alertBox () {
  var message = "";
  var isReadbool = false;
  return {
    setAlert: function (text) {
      message = text;
      isReadbool = false;
      return message;
    },
    getAlert: function () {
      isReadbool = true;
      return message;
    },
    isRead: function () {
      return isReadbool;
    }
  }
}

alert = alertBox();

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
    if (!user) { return res.render('login', { alertmsg: "Tarkista tunnus ja salasana" }); }
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
    Tapahtuma.fetchAll({withRelated: ['kategoria', 'osoite', 'vastuuhenkilo']}).then(function (events) {
      if (events){
        var eventsJson = events.toJSON();
        console.log(eventsJson);

        // Get tickets for events
        var eventList = [];

        eventsJson.map(function(event) {
          var alvToimiNyt = event.alv;
          eventList.push({
              id: event.id,
              nimi: event.nimi,
              alkuaika: moment(event.alkuaika).format("DD.MM.YYYY HH:mm"),
              loppuaika: moment(event.loppuaika).format("DD.MM.YYYY HH:mm"),
              osoite: event.osoite.postiosoite + ', ' + event.osoite.postinumero,
              vastuuhenkilo: event.vastuuhenkilo.nimi,
              kategoria: event.kategoria.nimi,
              alv: alvToimiNyt
          });
        });
        console.log("categories time");
        res.render('event/index', {events: eventList, login: true, name: req.user.nimi});

      } else {
        res.render('event/index', {events: {}, login: true, name: req.user.nimi, notice: "Tapahtumia ei löytynyt"});
      }
    }).catch(function(err){
      console.error(err);
      res.status(500).json({error: err});
    });
  }
  else {
    res.render('login', { alertmsg: "Ole hyvä ja kirjaudu sisään", login: false});
  }
  
});

/* POST new event*/
// TODO: Validate req.body has correct data, this isn't checked now
router.post('/events', function(req,res){
  if(req.user) {
    console.log("Creating new event:");
    console.log(req.body);

    // Check that startTime < endTime
    if (req.body.startTime >= req.body.endTime) {
      alert.setAlert("Loppuajan on oltava alkuajan jälkeen");
      res.redirect('/admin');
    } else {
      // Transaction that will either complete or rollback
      // Postitoimipaikka, Postinumero and Osoite are inserted only if they don't exist already
      Bookshelf.transaction(function(t) {
        return Postitoimipaikka.upsert({
          postalArea: req.body.postalArea,
          transaction: t
        }).then(function (area) {
          return Postinumero.upsert({
            postalCode: req.body.postalCode,
            postalArea: area.attributes.postitoimipaikka,
            transaction: t
          });
        }).then(function (code) {
          return Osoite.upsert({
            address: req.body.address,
            code: code.attributes.postinumero,
            transaction: t
          });
        }).then(function (address) {
          return Tapahtuma.upsert({
            eventName: req.body.eventName,
            alv: req.body.alv,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            vhlo: req.body.vhlo,
            category: req.body.category,
            addressId: address.attributes.id,
            transaction: t
          });
        })
      }).then(function () {
        // Transaction complete, render page
        msg.setMessage("Tapahtuma luotu");
        res.redirect(req.get('referer'));
      }).catch(function (){
        alert.setAlert("Tallennuksessa tapahtui virhe");
        res.redirect(req.get('referer'));
      });
    }
  }
  else {
    res.render('login', { alertmsg: "Ole hyvä ja kirjaudu sisään", login: false});
  }
});

router.post('/deleteEvent/:id', function(req, res){
  console.log("delete");
  if(req.user){
    var id = req.params['id'];
    Tapahtuma.forge({id: id}).fetch({require: true}).then(function (event) {
      if (event) {
        event.destroy().then(function() {
          msg.setMessage("Tapahtuma poistettu");
          res.redirect('../admin');
        }).catch(function() {
          alert.setAlert("Poistossa tapahtui virhe");
          res.redirect('../admin');
        });
      } else {
        res.status(404).json({error: 'EventNotFound'})
      }
    }).catch(function(err) {
      res.status(500).json({error: err});
    });
  }
});

/*GET editEvent panel*/
router.get('/editEvent/:id', function(req,res){
  console.log("edit");
  if (req.user){
    var id = req.params['id'];
    Tapahtuma.where({id: id}).fetch({withRelated: ['kategoria', 'osoite', 'osoite.postinumero']}).then(function (event) {
      if (event){
        var startTime = moment(event.attributes.alkuaika).format("YYYY-MM-DDTHH:mm");
        var endTime = moment(event.attributes.loppuaika).format("YYYY-MM-DDTHH:mm");
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
    res.render('login', { alertmsg: "Ole hyvä ja kirjaudu sisään", login: false});
  }
});


router.post('/saveEvent/:id', function(req, res) {
  if(req.user) {

    console.log("Modifying event:");
    console.log(req.user);
    console.log(req.body);
    var id = req.params['id'];

    // Check that startTime < endTime
    console.log(req.body.startTime >= req.body.endTime);
    if (req.body.startTime >= req.body.endTime) {
      console.log("Väärä aika");
      alert.setAlert("Loppuajan on oltava alkuajan jälkeen");
      res.redirect('../admin');
    } else {
      // Transaction that will either complete or rollback
      // Postitoimipaikka, Postinumero and Osoite are inserted only if they don't exist already
      Bookshelf.transaction(function(t) {
        return Postitoimipaikka.upsert({
          postalArea: req.body.postalArea,
          transaction: t
        }).then(function (area) {
          return Postinumero.upsert({
            postalCode: req.body.postalCode,
            postalArea: area.attributes.postitoimipaikka,
            transaction: t
          });
        }).then(function (code) {
          return Osoite.upsert({
            address: req.body.address,
            code: code.attributes.postinumero,
            transaction: t
          });
        }).then(function (address) {
          return Tapahtuma.upsert({
            id: id,
            eventName: req.body.eventName,
            alv: req.body.alv,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            vhlo: req.user.id,
            category: req.body.category,
            addressId: address.attributes.id,
            transaction: t
          });
        })
      }).then(function () {
        // Transaction complete, render page
        console.log("kukkuu1");
        msg.setMessage("Tapahtuma muokattu");
        console.log("kukkuu2");
        res.redirect('../admin');
      }).catch(function (){
        alert.setAlert("Muokkauksessa tapahtui virhe");
        res.redirect('../admin');
      });
    }
  } else {
    res.render('login', { alertmsg: "Ole hyvä ja kirjaudu sisään", login: false});
  }
});

/*GET admin panel*/
router.get('/admin', function(req,res) {
  if(req.user) {
    Vastuuhenkilo.where('tunnus', req.user.tunnus).fetch({withRelated: ['tapahtumanjarjestaja', 'tapahtumanjarjestaja.osoite']}).then(function (vhlo) {
      if (vhlo){
        // Get all vhlos based on organizer
        Vastuuhenkilo.where({tapahtumanjarjestaja: vhlo.attributes.tapahtumanjarjestaja}).fetchAll().then(function (vhlos) {
          if (vhlos) {
            //console.log(vhlos.toJSON());
            // TODO: This loop should complete before calling Tapahtuma.where, might cause problems with async
            var vhloIds = [];
            vhlos.forEach(function(hlo) {
              vhloIds.push(hlo.attributes.id)
            });
            Tapahtuma.where('vastuuhenkilo', 'IN', vhloIds).fetchAll({withRelated: ['kategoria', 'osoite']}).then(function (events) {
              if (events){
                var eventsJson = events.toJSON();
                console.log(eventsJson);

                // Get tickets for events
                var eventList = [];

                Promise.all(eventsJson.map(function(event) {
                  return Lippu.where({tapahtuma: event.id, tila: 1}).fetchAll().then(function (tickets) {
                    eventList.push({
                      id: event.id,
                      nimi: event.nimi,
                      alkuaika: moment(event.alkuaika).format("DD.MM.YYYY HH:mm"),
                      loppuaika: moment(event.loppuaika).format("DD.MM.YYYY HH:mm"),
                      osoite: event.osoite.postiosoite + ', ' + event.osoite.postinumero,
                      kategoria: event.kategoria.nimi,
                      liput: tickets.length
                    });
                    console.log("pushing event");
                  });
                })).then(function(){
                  // Get all categories
                  console.log("categories time");
                  Kategoria.fetchAll().then(function (categories) {
                    if (categories){
                      res.render('admin', {
                        data: vhlo.toJSON(),
                        events: eventList,
                        categories: categories.toJSON(),
                        vhlos: vhlos.toJSON(),
                        username: req.user.tunnus,
                        login: true, name: req.user.nimi,
                        notice: msg.isRead() ? null : msg.getMessage(),
                        alertmsg: alert.isRead() ? null : alert.getAlert()
                      });
                    } else {
                      res.status(404).json({error: 'CategoryNotFound'})
                    }
                  });
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
    res.render('index', {login: false, alertmsg: "Ole hyvä ja kirjaudu sisään" });
  }
});

/*GET report panel*/
router.get('/report', function(req,res) {
  if (req.user){
    // TODO: Validate inputs, like now kategoriaid might be NaN
    console.log("Got parameteres");
    console.log(req.query);

    // Filter reports conditionally
    // This could probably be done in nicer way with lodash filter
    var reportQuery = Raportti.where({vastuuhenkilo: req.user.id});
    req.query.category ? reportQuery = reportQuery.where('kategoriaid', parseInt(req.query.category)) : null;
    req.query.startTime ? reportQuery = reportQuery.where('alkuaika', '>=', req.query.startTime) : null;
    req.query.endTime ? reportQuery = reportQuery.where('loppuaika', '<=', req.query.endTime) : null;
    reportQuery.fetchAll().then(function (report) {
      if (report && report.toJSON().length != 0){
        res.render('report', { data: report.toJSON(), login: true, name: req.user.nimi });
      } else {
        msg.setMessage("Haulla ei löytynyt raportteja");
        res.redirect('admin');
      }
    }).catch(function(err){
      console.error(err);
      res.status(500).json({error: err});
    });
  } else {
    res.render('login', { alertmsg: "Ole hyvä ja kirjaudu sisään", login: false});
  }
});

module.exports = router;

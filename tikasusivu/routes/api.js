var express = require('express');
var router = express.Router();
var auth = require('../auth');

var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');
var Kategoria = require('../models/kategoria');
var Tapahtumanjarjestaja = require('../models/tapahtumanjarjestaja');

router.get('/', auth.check, function(req, res, next) {
  res.send("Tässä api dokumentaatio ehkä mahollisesti");
});

router.get('/tapahtumat', auth.check, function(req,res,next) {
  Tapahtuma.fetchAll({withRelated: ['kategoria', 'osoite']}).then(function (events) {
    if (events){
      res.send(events.toJSON());
    } else {
      res.status(404).json({error: 'EventNotFound'})
    }
  }).catch(function(err){
    console.error(err);
    res.status(500).json({error: err});
  });
});

router.get('/tapahtumat/:id', auth.check, function(req,res,next) {
  var id = req.params['id'];

  Tapahtuma.where({id: id}).fetch({withRelated: ['kategoria', 'osoite']}).then(function (event) {
    if (event){
      res.send(event.toJSON());
    } else {
      res.status(404).json({error: 'EventNotFound'})
    }
  }).catch(function(err){
    console.error(err);
    res.status(500).json({error: err});
  })
});

router.delete('/tapahtumat/:id', auth.check, function(req,res,next) {
  var id = req.params['id'];

  Tapahtuma.forge({id: id}).fetch({require: true}).then(function (event) {
    if (event) {
      event.destroy().then(function() {
        res.status(200).json();
      }).catch(function(err) {
        res.status(500).json({error: err})
      })
    } else {
      res.status(404).json({error: 'EventNotFound'})
    }
  }).catch(function(err) {
    res.status(500).json({error: err});
  })
});

router.get('/tapahtumanjarjestaja', auth.check, function(req,res,next) {
  Tapahtumanjarjestaja.fetchAll({withRelated: ['osoite']}).then(function (organizers) {
    if (organizers){
      res.send(organizers.toJSON());
    } else {
      res.status(404).json({error: 'OrganizerNotFound'})
    }
  }).catch(function(err){
    console.error(err);
    res.status(500).json({error: err});
  })
});

router.get('/tapahtumanjarjestaja/:id', auth.check, function(req,res,next) {
  var id = req.params['id'];

  Tapahtumanjarjestaja.where({ytunnus : id}).fetch({withRelated: ['osoite']}).then(function (organizer) {
    if (organizer){
      res.send(organizer.toJSON());
    } else {
      res.status(404).json({error: 'OrganizerNotFound'})
    }
  }).catch(function(err){
    console.error(err);
    res.status(500).json({error: err});
  })
});

module.exports = router;
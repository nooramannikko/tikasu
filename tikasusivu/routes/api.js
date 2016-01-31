var express = require('express');
var router = express.Router();
var auth = require('../auth');

var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');
var Kategoria = require('../models/kategoria');

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


module.exports = router;
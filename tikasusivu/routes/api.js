var express = require('express');
var router = express.Router();

var Lippu = require('../models/lippu');
var Tapahtuma = require('../models/tapahtuma');

router.get('/', function(req, res, next) {
  res.send("Tässä api dokumentaatio ehkä mahollisesti");
});

router.get('/tapahtumat', function(req,res,next) {
  Tapahtuma.fetchAll().then(function (events) {
    if (events){
      res.send(events.toJSON());
    } else {
      res.status(404).json({error: 'EventNotFound'})
    }
  }).catch(function(err){
    res.status(500).json({error: err});
  });
});

router.get('/tapahtumat/:id', function(req,res,next) {
  var id = req.params['id'];

  Tapahtuma.where({id: id}).fetch().then(function (event) {
    if (event){
      res.send(event.toJSON());
    } else {
      res.status(404).json({error: 'EventNotFound'})
    }
  }).catch(function(err){
    res.status(500).json({error: err});
  })
});



module.exports = router;
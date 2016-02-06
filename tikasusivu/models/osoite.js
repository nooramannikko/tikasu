'use strict';

var Bookshelf = require('../database');

require('./tapahtuma');
require('./tapahtumanjarjestaja');
var Osoite = Bookshelf.Model.extend({
  tableName: 'osoite',

  tapahtuma: function() {
    return this.hasMany('Tapahtuma', 'osoiteid');
  },

  tapahtumanjarjestaja: function() {
    return this.hasMany('Tapahtumanjarjestaja', 'osoite');
  }
});

module.exports = Bookshelf.model('Osoite', Osoite);

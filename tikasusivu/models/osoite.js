'use strict';

var Bookshelf = require('../database');

require('./tapahtuma');
require('./tapahtumanjarjestaja');
var Osoite = Bookshelf.Model.extend({
  tableName: 'osoite',

  tapahtuma: function() {
    return this.belongsToMany('Tapahtuma', 'osoiteid');
  },

  tapahtumanjarjestaja: function() {
    return this.belongsToMany('Tapahtumanjarjestaja', 'osoite');
  }
});

module.exports = Bookshelf.model('Osoite', Osoite);

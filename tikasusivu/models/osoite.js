'use strict';

var Bookshelf = require('../database');

require('./tapahtuma');
require('./tapahtumanjarjestaja')
var Osoite = Bookshelf.Model.extend({
  tableName: 'osoite',

  tapahtuma: function() {
    return this.belongsToMany('Tapahtuma');
  },

  tapahtumanjarjestaja: function() {
    return this.belongsToMany('Tapahtumanjarjestaja');
  }
});

module.exports = Bookshelf.model('Osoite', Osoite);

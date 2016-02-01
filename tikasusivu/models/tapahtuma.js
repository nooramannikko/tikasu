'use strict';

var Bookshelf = require('../database');

require("./kategoria");
require('./osoite');
var Tapahtuma = Bookshelf.Model.extend({
  tableName: 'tapahtuma',

  kategoria: function() {
    return this.hasOne('Kategoria', 'id');
  },

  osoite: function() {
    return this.hasOne('Osoite', 'id');
  }
});

module.exports = Bookshelf.model('Tapahtuma', Tapahtuma);

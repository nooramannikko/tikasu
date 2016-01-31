'use strict';

var Bookshelf = require('../database');

require('./tapahtuma');
var Osoite = Bookshelf.Model.extend({
  tableName: 'osoite',

  tapahtuma: function() {
    return this.belongsToMany('Tapahtuma');
  }
});

module.exports = Bookshelf.model('Osoite', Osoite);

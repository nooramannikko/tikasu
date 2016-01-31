'use strict';

var Bookshelf = require('../database');

require('./tapahtuma');
var Kategoria = Bookshelf.Model.extend({
  tableName: 'kategoria',

  tapahtuma: function() {
    return this.belongsToMany('Tapahtuma');
  }
});

module.exports = Bookshelf.model('Kategoria', Kategoria);

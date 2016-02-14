'use strict';

var Bookshelf = require('../database');

require('./tapahtuma');
require('./katsomo');
var Tapahtumakatsomo = Bookshelf.Model.extend({
  tableName: 'tapahtumakatsomo',

  tapahtuma: function() {
    return this.belongsTo('Tapahtuma', 'tapahtumaid');
  },

  katsomo: function () {
    return this.belongsTo('Katsomo', 'katsomoid');
  }
});

module.exports = Bookshelf.model('Tapahtumakatsomo', Tapahtumakatsomo);

'use strict';

var Bookshelf = require('../database');

require('./tapahtumakatsomo');
var Katsomo = Bookshelf.Model.extend({
  tableName: 'katsomo',

  tapahtumakatsomo: function() {
    return this.hasMany('Tapahtumakatsomo', 'katsomoid');
  },

  tapahtuma: function() {
    return this.hasMany('Tapahtuma').through('Tapahtumakatsomo', 'katsomoid');
  }
});

module.exports = Bookshelf.model('Katsomo', Katsomo);

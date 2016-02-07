'use strict';

var Bookshelf = require('../database');

require('./postinumero');
var Postitoimipaikka = Bookshelf.Model.extend({
  tableName: 'postitoimipaikka',

  postinumero: function() {
    return this.hasMany('Postinumero', 'postinumero');
  }

});

module.exports = Bookshelf.model('Postitoimipaikka', Postitoimipaikka);

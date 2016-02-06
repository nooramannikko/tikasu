'use strict';

var Bookshelf = require('../database');

require('./osoite');
require('./postitoimipaikka');
var Postinumero = Bookshelf.Model.extend({
  tableName: 'postinumero',

  postinumero: function() {
    return this.hasMany('Osoite', 'postinumero');
  },

  postitoimipaikka: function() {
    return this.belongsTo('Postitoimipaikka', 'id');
  }

});

module.exports = Bookshelf.model('Postinumero', Postinumero);

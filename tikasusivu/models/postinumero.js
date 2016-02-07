'use strict';

var Bookshelf = require('../database');

require('./osoite');
require('./postitoimipaikka');
var Postinumero = Bookshelf.Model.extend({
  tableName: 'postinumero',
  idAttribute: 'postinumero',
  
  osoite: function() {
    return this.hasMany('Osoite', 'postinumero');
  },

  postitoimipaikka: function() {
    return this.belongsTo('Postitoimipaikka', 'postitoimipaikka');
  }

});

module.exports = Bookshelf.model('Postinumero', Postinumero);

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

// Update or insert postinumero
Postinumero.upsert = function (data) {
  return Postinumero.where({
    postinumero: data.postalCode
  }).fetch().then(function(code){
    if (!code){
      return Postinumero.forge({
        postinumero: data.postalCode
      }).save({postitoimipaikka: data.postalArea}, {method: 'insert', transacting: data.transaction});
    } else {
      return Promise.resolve(code);
    }
  });
};

module.exports = Bookshelf.model('Postinumero', Postinumero);

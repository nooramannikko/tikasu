'use strict';

var Bookshelf = require('../database');

require('./postinumero');
var Postitoimipaikka = Bookshelf.Model.extend({
  tableName: 'postitoimipaikka',
  idAttribute: 'postitoimipaikka',

  postinumero: function() {
    return this.hasMany('Postinumero', 'postinumero');
  }

});

// Update or insert postitoimipaikka
Postitoimipaikka.upsert = function(data){
  return Postitoimipaikka.where({
    postitoimipaikka: data.postalArea
  }).fetch().then(function(area){
    if (!area){
      return Postitoimipaikka.forge({
        postitoimipaikka: data.postalArea
      }).save({postitoimipaikka: data.postalArea}, {method: 'insert', transacting: data.transaction});
    } else {
      return Promise.resolve(area);
    }
  });
};

module.exports = Bookshelf.model('Postitoimipaikka', Postitoimipaikka);

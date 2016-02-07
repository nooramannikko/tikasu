'use strict';

var Bookshelf = require('../database');

require('./tapahtuma');
require('./tapahtumanjarjestaja');
var Osoite = Bookshelf.Model.extend({
  tableName: 'osoite',

  tapahtuma: function() {
    return this.hasMany('Tapahtuma', 'osoiteid');
  },

  postinumero: function() {
    return this.belongsTo('Postinumero', 'postinumero');
  },

  tapahtumanjarjestaja: function() {
    return this.hasMany('Tapahtumanjarjestaja', 'osoite');
  }
});

Osoite.upsert = function (data) {
  return Osoite.where({
    postiosoite: data.address,
    postinumero: data.code
  }).fetch().then(function(address){
    if (!address){
      return Osoite.forge().save({
        postiosoite: data.address,
        postinumero: data.code
      }, {method: 'insert', transacting: data.transaction});
    } else {
      return Promise.resolve(address);
    }
  });
};

module.exports = Bookshelf.model('Osoite', Osoite);

'use strict';

var Bookshelf = require('../database');

require('./kategoria');
require('./osoite');
var Tapahtuma = Bookshelf.Model.extend({
  tableName: 'tapahtuma',

  kategoria: function() {
    return this.belongsTo('Kategoria', 'kategoria');
  },

  osoite: function() {
    return this.belongsTo('Osoite', 'osoiteid');
  },

  vastuuhenkilo: function() {
    return this.belongsTo('Vastuuhenkilo', 'vastuuhenkilo')
  },

  tapahtumakatsomo: function() {
    return this.hasMany('Tapahtumakatsomo', 'tapahtumaid');
  },

  katsomo: function() {
    return this.hasMany('Katsomo').through('Tapahtumakatsomo', 'tapahtumaid');
  }

});


// TODO: For event updates, not tested nor used right now
Tapahtuma.upsert = function (data) {
  return Tapahtuma.forge({
    id: data.id
  }).fetch().then(function (event) {
    if (!event) {
      return Tapahtuma.forge({
        nimi: data.eventName,
        alv: data.alv,
        alkuaika: data.startTime,
        loppuaika: data.endTime,
        vastuuhenkilo: data.vhlo,
        kategoria: data.category,
        osoiteid: data.addressId
      }).save(null, {method: 'insert', transacting: data.transaction});
    } else {
      return event.save({
        nimi: data.eventName,
        alv: data.alv,
        alkuaika: data.startTime,
        loppuaika: data.endTime,
        vastuuhenkilo: data.vhlo,
        kategoria: data.category,
        osoiteid: data.addressId
      }, {method: 'update', transacting: data.transaction});
    }
  });
}

module.exports = Bookshelf.model('Tapahtuma', Tapahtuma);

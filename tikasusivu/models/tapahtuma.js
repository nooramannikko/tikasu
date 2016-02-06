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
  }

});

module.exports = Bookshelf.model('Tapahtuma', Tapahtuma);

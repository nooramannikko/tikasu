'use strict';

var Bookshelf = require('../database');

require('./tapahtumanjarjestaja');
var Vastuuhenkilo = Bookshelf.Model.extend({
  tableName: 'vastuuhenkilo',

  tapahtumanjarjestaja: function() {
    return this.hasOne('Tapahtumanjarjestaja', 'ytunnus');
  }
});

module.exports = Bookshelf.model('Vastuuhenkilo', Vastuuhenkilo);
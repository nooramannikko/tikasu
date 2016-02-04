'use strict';

var Bookshelf = require('../database');

require('./osoite');
var Tapahtumanjarjestaja = Bookshelf.Model.extend({
  tableName: 'tapahtumanjarjestaja',

  osoiteobj: function() {
    return this.hasOne('Osoite', 'id');
  }
});

module.exports = Bookshelf.model('Tapahtumanjarjestaja', Tapahtumanjarjestaja);
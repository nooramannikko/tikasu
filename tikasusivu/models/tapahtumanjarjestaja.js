'use strict';

var Bookshelf = require('../database');

require('./osoite');
var Tapahtumanjarjestaja = Bookshelf.Model.extend({
  tableName: 'tapahtumanjarjestaja',

  osoite: function() {
    return this.belongsTo('Osoite', 'osoite');
  }
});

module.exports = Bookshelf.model('Tapahtumanjarjestaja', Tapahtumanjarjestaja);
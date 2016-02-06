'use strict';

var Bookshelf = require('../database');

require('./tapahtumanjarjestaja');
var Vastuuhenkilo = Bookshelf.Model.extend({
  tableName: 'vastuuhenkilo',

  tapahtumanjarjestaja: function() {
    return this.belongsTo('Tapahtumanjarjestaja', 'tapahtumanjarjestaja');
  }
});

module.exports = Bookshelf.model('Vastuuhenkilo', Vastuuhenkilo);
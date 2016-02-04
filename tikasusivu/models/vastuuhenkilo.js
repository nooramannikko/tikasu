'use strict';

var Bookshelf = require('../database');

require('./tapahtumanjarjestaja');
var Vastuuhenkilo = Bookshelf.Model.extend({
  tableName: 'vastuuhenkilo',

  tapahtumanjarjestajaobj: function() {
    return this.hasOne('Tapahtumanjarjestaja', 'id');
  }
});

module.exports = Bookshelf.model('Vastuuhenkilo', Vastuuhenkilo);
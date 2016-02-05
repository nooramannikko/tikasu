'use strict';

var Bookshelf = require('../database');

require('./tapahtuma');
var Lippu = Bookshelf.Model.extend({
  tableName: 'lippu',

  tapahtuma: function() {
  	return this.belongsTo('Tapahtuma', 'tapahtuma');
  }
});

module.exports = Bookshelf.model('Lippu', Lippu);

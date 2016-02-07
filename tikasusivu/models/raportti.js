'use strict';

var Bookshelf = require('../database');

var Raportti = Bookshelf.Model.extend({
  tableName: 'raportti'
});

module.exports = Bookshelf.model('Raportti', Raportti);

'use strict';

var Bookshelf = require('../database');

var Kategoria = Bookshelf.Model.extend({
  tableName: 'kategoria'
});

module.exports = Bookshelf.model('Kategoria', Kategoria);

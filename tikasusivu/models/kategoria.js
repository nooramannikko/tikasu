'use strict';

var Bookshelf = require('../database');

var Tapahtuma = Bookshelf.Model.extend({
  tableName: 'kategoria'
});

module.exports = Bookshelf.model('Kategoria', Kategoria);

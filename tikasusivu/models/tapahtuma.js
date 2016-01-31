'use strict';

var Bookshelf = require('../database');

var Tapahtuma = Bookshelf.Model.extend({
  tableName: 'tapahtuma'
});

module.exports = Bookshelf.model('Tapahtuma', Tapahtuma);

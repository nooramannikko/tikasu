'use strict';

var Bookshelf = require('../database');

var Lippu = Bookshelf.Model.extend({
  tableName: 'lippu'
});

module.exports = Bookshelf.model('Lippu', Lippu);

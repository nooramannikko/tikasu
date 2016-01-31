'use strict';

var Bookshelf = require('../database');

var Vastuuhenkilo = Bookshelf.Model.extend({
  tableName: 'vastuuhenkilo'
});

module.exports = Bookshelf.model('Vastuuhenkilo', Vastuuhenkilo);
'use strict';

var knex = require('knex')({
  client: 'postgresql',
  connection: {
    host     : 'localhost',
    port     : '5432',
    user     : 'admin',
    password : 'jee',
    database : 'LippuLasse'
  }
});
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry'); // Resolve circular dependencies with relations

module.exports = bookshelf;
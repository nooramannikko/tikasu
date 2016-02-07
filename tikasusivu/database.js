'use strict';

var knexfile = require('./knexfile');
var knex = require('knex')(knexfile.development);
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry'); // Resolve circular dependencies with relations

module.exports = bookshelf;
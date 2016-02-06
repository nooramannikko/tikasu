'use strict';

var knexfile = require('./knexfile');
var knex = require('knex')(knexfile.development, {debug: true});
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry'); // Resolve circular dependencies with relations

module.exports = bookshelf;
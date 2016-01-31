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

var lasse = {
  lippu = bookshelf.Model.extend({
    tableName: 'lippu'
  }),
  tapahtuma = bookshelf.Model.extend({
    tableName: 'tapahtuma'
  }),
  print = function(){
    lippu.collection().fetch().then(function (collection) {
    return collection.ToJSON();
  })
}

/*

*/

module.exports = lasse;
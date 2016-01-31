"use strict";

module.exports = function(bookshelf) {

  var Tapahtuma = bookshelf.Model.extend({
    tableName: 'tapahtuma'
  });

  return Tapahtuma;
}
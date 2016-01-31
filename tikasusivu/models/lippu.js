"use strict";

module.exports = function(bookshelf) {

  var Lippu = bookshelf.Model.extend({
    tableName: 'lippu'
  });

  return Lippu;
}
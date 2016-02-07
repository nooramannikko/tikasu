'use strict';

var Bookshelf = require('../database');

require('./tapahtumanjarjestaja');
var Vastuuhenkilo = Bookshelf.Model.extend({
  tableName: 'vastuuhenkilo',

  tapahtumanjarjestaja: function() {
    return this.belongsTo('Tapahtumanjarjestaja', 'tapahtumanjarjestaja');
  },

  tapahtuma: function (){
    return this.hasMany('Tapahtuma', 'vastuuhenkilo');
  }
});

module.exports = Bookshelf.model('Vastuuhenkilo', Vastuuhenkilo);
'use strict';

var Bookshelf = require('../database');

require('./tapahtumanjarjestaja');
var Vastuuhenkilo = Bookshelf.Model.extend({
  // Vastuuhenkilo with limited access to only users who belong to organizer tapahtumalaarnio
  tableName: 'tapahtumalaarnio_vastuuhenkilo',

  tapahtumanjarjestaja: function() {
    return this.belongsTo('Tapahtumanjarjestaja', 'tapahtumanjarjestaja');
  },

  tapahtuma: function (){
    return this.hasMany('Tapahtuma', 'vastuuhenkilo');
  }
});

module.exports = Bookshelf.model('Vastuuhenkilo', Vastuuhenkilo);
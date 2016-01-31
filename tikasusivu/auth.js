var Vastuuhenkilo = require('./models/vastuuhenkilo');
var passport = require('passport');

var basicAuth = passport.authenticate('basic', {session: true});

function auth() {
  return{
    check: function(req, res, next) {
      if (req.user) {
        next();
      }
      else {
        basicAuth(req, res, next);
      }
    }
  }  
}

module.exports = auth();
var Vastuuhenkilo = require('./models/vastuuhenkilo');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

passport.use(new BasicStrategy(
  function(username, password, done) {
    Vastuuhenkilo.where({tunnus: username}).fetch().then(function(user){
      if (user) {
        bcrypt.compare(password, user.attributes.salasana, function(err, res) {
          if (!err && res === true){
            return done(null, user);
          } else {
            console.log("Login for user " + username + " failed!");
            // password didnt match
            return done(null, false);
          }
        });
      } else {
        // user did not exist
        return done(null, false);
      }
    });
  }
));

passport.use(new LocalStrategy( 
  function(username, password, done) {
    Vastuuhenkilo.where({tunnus: username}).fetch().then(function(user){
      if (user) {
        bcrypt.compare(password, user.attributes.salasana, function(err, res) {
          if (!err && res === true){
            return done(null, user);
          } else {
            console.log("Login for user " + username + " failed!");
            // password didnt match
            return done(null, false);
          }
        });
      } else {
        // user did not exist
        return done(null, false);
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function auth() {
  return{
    check: function(req, res, next) {
      console.log("AUTH.CHECK EI OLE TARPEELLINEN, KÄYTÄ LOGGAAMISEN TUNNISTAMISEEN REQ.USER:ia")
      next()
    }
  }  
}

module.exports = auth();
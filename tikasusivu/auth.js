var Vastuuhenkilo = require('./models/vastuuhenkilo');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;

passport.use(new BasicStrategy(
  function(username, password, done) {
    Vastuuhenkilo.where({tunnus: username, salasana: password}).fetch().then(function(user){
        if (user)
        {
            return done(null, user);
        }
        else
        {
            return done(null, false);
        }
    });
  }
));

passport.use(new LocalStrategy( 
  function(username, password, done) {
    Vastuuhenkilo.where({tunnus: username, salasana: password}).fetch().then(function(user){
        if (user)
        {
            return done(null, user);
        }
        else
        {
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
'use strict';

// require('./mongoose')();
const passport = require('passport');
const Player = require('mongoose').model('Player');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const config = require('./config');

module.exports = () => {

  passport.use(new FacebookTokenStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret
  }, (accessToken, refreshToken, profile, next) => {
    Player.upsertFbUser(accessToken, refreshToken, profile, (err, user) => {
      return next(err, user);
    });
  }));

  passport.use(new GoogleTokenStrategy({
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret
  }, (accessToken, refreshToken, profile, next) => {
    Player.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
      return next(err, user);
    });
  }));
};

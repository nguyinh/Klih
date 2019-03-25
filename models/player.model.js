const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const playerScheme = mongoose.Schema({
  _id: ObjectId,
  email: {
    type: String,
    // required: true
  },
  password: {
    type: String,
    // required: true
  },
  firstName: {
    type: String,
    // required: true
  },
  lastName: {
    type: String,
    // required: true
  },
  fullName: {
    type: String,
    // required: true
  },
  alias: {
    type: String
  },
  teams: {
    type: [ObjectId]
  },
  avatar: {
    data: Buffer,
    contentType: String
  },
  createdAt: {
    type: Date,
    // required: true
  },
  updatedAt: {
    type: Date,
    // required: true
  },
  lastConnectionAt: {
    type: Date
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  googleProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  }
});

playerScheme.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
  var that = this;
  return this.findOne({
    'facebookProvider.id': profile.id
  }, function(err, user) {
    // no user was found, lets create a new one
    if (!user) {
      var newUser = new that({
        _id: new mongoose.Types.ObjectId(),
        fullName: profile.displayName,
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastConnectionAt: Date.now()
      });

      newUser.save(function(error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

playerScheme.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
  var that = this;
  return this.findOne({
    'googleProvider.id': profile.id
  }, function(err, user) {
    // no user was found, lets create a new one
    if (!user) {
      var newUser = new that({
        _id: new mongoose.Types.ObjectId(),
        fullName: profile.displayName,
        email: profile.emails[0].value,
        googleProvider: {
          id: profile.id,
          token: accessToken
        }
      });

      newUser.save(function(error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

const Player = mongoose.model('Player', playerScheme);

module.exports = Player;
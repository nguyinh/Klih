const mongoose = require('mongoose');
const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');

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
      let avatar = {
        data: fs.readFileSync('./image.png'),
        contentType: 'image/png'
      };
      let newUser = new that({
        _id: new mongoose.Types.ObjectId(),
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        fullName: profile.name.givenName + ' ' + profile.name.familyName,
        email: profile.emails[0].value,
        facebookProvider: {
          id: profile.id,
          token: accessToken
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastConnectionAt: Date.now(),
        avatar: avatar // TODO: get Fb avatar
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
  }, async function(err, user) {
    // no user was found, lets create a new one
    if (!user) {
      let avatar = {
        data: fs.readFileSync('./image.png'),
        contentType: 'image/png'
      };
      // console.log(profile._json.picture);
      try {
        // const imgRes = await axios.get(profile._json.picture, {});
        // console.log(imgRes);
        // const resizedImg = await sharp(profile._json.picture).resize(300, 300).toBuffer();
        let newUser = new that({
          _id: new mongoose.Types.ObjectId(),
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          fullName: profile.displayName,
          email: profile.emails[0].value,
          googleProvider: {
            id: profile.id,
            token: accessToken
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastConnectionAt: Date.now(),
          avatar: avatar
          // avatar: {
          //   data: Buffer.from(resizedImg.toString('base64'), 'base64'),
          //   contentType: 'image/png'
          // }
        });

        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return cb(err, user);
    }
  });
};

const Player = mongoose.model('Player', playerScheme);

module.exports = Player;

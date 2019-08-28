const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId;

const teamPlayerScheme = mongoose.Schema({
  _id: ObjectId,
  AddedAt: {
    type: Date,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  player: {
    type: ObjectId,
    ref: 'Player',
    required: true
  }
});

const teamScheme = mongoose.Schema({
  _id: ObjectId,
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  teamTag: {
    type: String,
    required: true
  },
  players: {
    type: [teamPlayerScheme],
    required: true
  },
  avatar: {
    data: Buffer,
    contentType: String
  },
  createdAt: {
    type: Date,
    required: true
  },
  seasons: {
    type: [
      {
        _id: {
          type: ObjectId,
          ref: 'Season',
          required: true
        },
        isActive: {
          type: Boolean,
          required: true
        }
      }],
    default: []
  }
});

const Team = mongoose.model('Team', teamScheme);

module.exports = Team;

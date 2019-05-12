const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const matchEventScheme = mongoose.Schema({
  _id: ObjectId,
  goalTime: {
    type: Number
  },
  deltaScore: {
    type: Number
  },
  byPlayer: {
    type: ObjectId
  },
  isBetray: {
    type: Boolean
  },
  placement: {
    type: String
  },
  fullName: {
    type: String
  },
  team: {
    type: String
  }
});

const playingMatchScheme = mongoose.Schema({
  _id: ObjectId,
  score1: {
    type: Number,
    required: true,
    default: 0
  },
  score2: {
    type: Number,
    required: true,
    default: 0
  },
  player1: {
    type: ObjectId,
    required: false
  },
  player2: {
    type: ObjectId,
    required: false
  },
  player3: {
    type: ObjectId,
    required: false
  },
  player4: {
    type: ObjectId,
    required: false
  },
  publisher: {
    type: ObjectId,
    required: false
  },
  history: {
    type: [matchEventScheme],
    required: true,
    default: []
  },
  createdAt: {
    type: Date,
    required: true
  },
  table: {
    type: ObjectId
  },
  lastUpdateAt: {
    type: Date,
    required: true
  }
});

const PlayingMatch = mongoose.model('PlayingMatch', playingMatchScheme);

module.exports = PlayingMatch;

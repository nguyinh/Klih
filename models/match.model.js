const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const matchEventScheme = mongoose.Schema({
  _id: ObjectId,
  goalTime: {
    type: Number,
    required: true
  },
  deltaScore: {
    type: Number,
    required: true
  },
  byPlayer: {
    type: ObjectId,
    ref: 'Player',
    required: true
  },
  isBetray: {
    type: Boolean,
    required: true
  },
  placement: {
    type: String
  }
});

const matchScheme = mongoose.Schema({
  _id: ObjectId,
  score1: {
    type: Number,
    required: true
  },
  score2: {
    type: Number,
    required: true
  },
  player1: {
    type: ObjectId,
    ref: 'Player',
    required: false
  },
  player2: {
    type: ObjectId,
    ref: 'Player',
    required: false
  },
  player3: {
    type: ObjectId,
    ref: 'Player',
    required: false
  },
  player4: {
    type: ObjectId,
    ref: 'Player',
    required: false
  },
  publisher: {
    type: ObjectId,
    ref: 'Player',
    required: false
  },
  history: {
    type: [matchEventScheme],
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  table: {
    type: ObjectId
  }
});

const Match = mongoose.model('Match', matchScheme);

module.exports = Match;

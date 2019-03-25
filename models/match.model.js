const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const matchEventScheme = mongoose.Schema({
  _id: ObjectId,
  createdAt: {
    type: Date,
    required: true
  },
  deltaScore: {
    type: Number,
    required: true
  },
  byPlayer: {
    type: ObjectId,
    required: true
  },
  opponentTeam: {
    type: Number,
    required: true
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
  createdAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  history: {
    type: [matchEventScheme],
    required: true
  },
  team: {
    type: ObjectId,
    required: true
  },
  table: {
    type: ObjectId
  }
});

const Match = mongoose.model('Match', matchScheme);

module.exports = Match;
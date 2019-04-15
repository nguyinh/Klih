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
  playerId: {
    type: ObjectId,
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
  }
});

const Team = mongoose.model('Team', teamScheme);

module.exports = Team;

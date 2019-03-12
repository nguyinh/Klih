const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const playerScheme = mongoose.Schema({
  _id: ObjectId,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
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
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  lastConnectionAt: {
    type: Date
  }
});

const Player = mongoose.model('Player', playerScheme);

module.exports = Player;

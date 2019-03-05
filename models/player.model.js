var mongoose = require('mongoose');

const playerScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    required: true
  }
});

const Player = mongoose.model('Player', playerScheme);

module.exports = Player;
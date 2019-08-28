const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const seasonScheme = mongoose.Schema({
  _id: ObjectId,
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  endedAt: {
    type: Date
  }
});

const Season = mongoose.model('Season', seasonScheme);

module.exports = Season;

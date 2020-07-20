const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  takenAt: {
    type: String,
    default: (new Date()).toUTCString()
  },
  score: Number
})

module.exports = mongoose.model('Score', scoreSchema);
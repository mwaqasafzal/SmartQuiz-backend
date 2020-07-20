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
  takenAt: String,//will be stored in UTC date i.e string..can to coverted to particular zone at client side
  score: Number
})

module.exports = mongoose.model('Score', scoreSchema);
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  key: {
    type:String,
    unique:[true,'Something went wrong,try again']
  },
  name: String,
  deadline: String,//string ...utc date,
  createdAt: {
    type: String,
    default: new Date().toUTCString()
  },
  questions: [
    {
      questionType: {
        type: String,
        enum: ['blank', 'mcq'],
        default: 'mcq'
      },
      question: String,
      answer: String,
      options: [String]
    }
  ],
  duration: {
    hrs: Number,
    mins: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'a quiz must belong to a user']
  }

});

module.exports = mongoose.model('Quiz', quizSchema);
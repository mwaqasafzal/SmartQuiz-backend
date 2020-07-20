const express = require("express");
const {
  createQuiz,
  getQuiz,
  getQuizzes,
  receiveQuizAttempted,
  quizzesAttempted,
  getQuizAttempts
} = require("../Controllers/quizController");
const { protect } = require("../Controllers/authController");

const Router = express.Router();


Router.get("/attempted", quizzesAttempted);//all quizez attempted
Router.get("/:quizId/attempts", getQuizAttempts);
Router.route('/:quizKey')
  .get( getQuiz)
  .post( receiveQuizAttempted);

Router.route('/')
  .get( getQuizzes)
  .post( createQuiz);

module.exports = Router;
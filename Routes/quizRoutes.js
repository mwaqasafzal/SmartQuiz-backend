const express = require("express");
const {
  createQuiz,
  getQuiz,
  getQuizzes,
  receiveQuizAttempted,
  quizzesAttempted
} = require("../Controllers/quizController");

const Router = express.Router();


Router.get("/attempted", quizzesAttempted);//all quizez attempted
Router.get("/:quizId/attempts",)
Router.route('/:quizKey')
  .get(getQuiz)
  .post(receiveQuizAttempted);

Router.route('/')
  .get(getQuizzes)
  .post(createQuiz);

module.exports = Router;
const express = require("express");
const {
  createQuiz,
  getQuiz,
  getQuizzes,
  receiveQuizAttempted,
  quizzesAttempted,
  getQuizAttempts,
  removeQuiz
} = require("../Controllers/quizController");
const { protect } = require("../Controllers/authController");

const Router = express.Router();



Router.delete('/:quizId',protect,removeQuiz)

Router.get("/attempted", protect,quizzesAttempted);//all quizez attempted
Router.get("/:quizId/attempts",protect, getQuizAttempts);
Router.route('/:quizKey')
  .get( protect,getQuiz)
  .post( protect,receiveQuizAttempted);

Router.route('/')
  .get( protect,getQuizzes)
  .post(protect, createQuiz);


module.exports = Router;
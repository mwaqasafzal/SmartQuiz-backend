const Quiz = require("../Models/quizModel");
const Score = require("../Models/scoreModel");
const AppError = require("../utils/AppError");

exports.createQuiz = async (req, res, next) => {
  //get the userId from heaader
  const userId = '5f1533313a26cf4044fd92bb';
  const { name, key, questions, duration, deadline } = req.body;
  try {
    const quiz = await Quiz.create({
      name,
      key,
      questions,
      duration,
      deadline,
      createdBy: userId
    });
    quiz.createdBy = undefined;
    res.json({
      status: 'success',
      data: {
        quiz
      }
    })
  } catch (error) {
    res.status(500).json({
      success: 'failed',
      message: error.message
    })
  }
}

//getting quiz by key..to attempt the quiz
exports.getQuiz = async (req, res, next) => {
  try {
    const { quizKey } = req.params;
    const quiz = await Quiz.findOne({ key: quizKey }).populate('createdBy', '-_id -password');
    if (!quiz)
      throw new AppError(404, "Quiz Not Found");

    //checking deadline  
    const deadline = new Date(quiz.deadline);
    const today = new Date();
    if (deadline < today)
      throw new AppError(403, 'Key has been Expired');

    res.json({
      status: "success",
      data: {
        quiz
      }
    })
  } catch (error) {
    const code = error.code || 500;
    res.status(code).json({
      status: "failed",
      message: error.message
    })
  }
}

//all quizzez created by particular user
exports.getQuizzes = async (req, res, next) => {
  //get the userId from cookie sent
  const userId = '5f1533313a26cf4044fd92bb';
  const quizzes = await Quiz.find({ createdBy: userId }).select('-createdBy');
  if (quizzes.length === 0)
    throw new AppError(404, 'no quizzes found');
  res.json({
    status: 'success',
    data: {
      quizzes
    }
  });
}


exports.receiveQuizAttempted = async (req, res, next) => {
 
  //get user id from headers...based upon kind of authentication
  const user = "5f15493d7beceb413ce262d5";
  const { quizKey } = req.params;
  const { score } = req.body;
  try {
    const { _id } = await Quiz.findOne({ key: quizKey });

    await Score.create({
      quiz: _id,
      user,
      score
    });
    res.json({
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message
    })
  }
}

//quizzes a user has attempted
exports.quizzesAttempted = async (req, res, next) => {
  //first get user id from headers...kind of auth
  const userId = '5f15493d7beceb413ce262d5';

  try {
    const attempts = await Score.find({ user: userId }).select("-user")
      .populate({
        path: 'quiz',
        select: '-_id -duration -deadline',
        populate: {
          path: 'createdBy',
          select: "-_id -password"
        }
      });

    if (attempts.length === 0)
      throw new AppError('404', "user have not taken any quiz yet");
    const quizzesAttempted = attempts.map(attempt => {
      const { quiz, score, takenAt } = attempt;//after populating quizId is replaced by whole quiz
      const total = quiz.questions.length;
      const { name, createdBy } = quiz;

      return {
        quizName: name,
        score,
        takenAt,
        score,
        total,
        createdBy
      }

    });

    res.json({
      status: 'success',
      data: {
        quizzesAttempted
      }
    })
  } catch (error) {
    const errorCode = error.code || 500;
    res.status(errorCode).json({
      status: "failed",
      message: error.message
    })
  }
}

//NEEDS TO BE REVIEWED

//all attempts for particular quiz
exports.getQuizAttempts = async (req, res, next) => {
  const { quizId } = req.params;
  const result = await Score.find({ quizId })
    .select("-quizId")
    .populate({ path: 'user', select: "username,fullName,email" })

  res.json({
    result
  })
}
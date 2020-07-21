const Quiz = require("../Models/quizModel");
const Score = require("../Models/scoreModel");
const AppError = require("../utils/AppError");
const catchAsync = require('../utils/catchAsync')

exports.createQuiz = catchAsync(
  async (req, res, next) => {
    // const { userId } = req;
    const userId = "5f169583f0812d103d8c5e08";
    const { name, key, questions, duration, deadline } = req.body;
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
  }
  
);
//getting quiz by key..to attempt the quiz
exports.getQuiz = catchAsync(
  async (req, res, next) => {
    const { quizKey } = req.params;
      const quiz = await Quiz.findOne({ key: quizKey }).populate('createdBy', '-_id -password');
      if (!quiz)
        throw new AppError(404, "Quiz Not Found");
  
      //checking deadline  
      const deadline = new Date(quiz.deadline);
      const today = new Date();
      if (deadline < today)
        throw new AppError(403, 'Key has been Expired');
  }
  
);

//all quizzez created by particular user
exports.getQuizzes = catchAsync(
  async (req, res, next) => {
    // const { userId } = req;
    const userId = "5f169583f0812d103d8c5e08";
    const quizzes = await Quiz.find({ createdBy: userId }).select('-createdBy');

    res.json({
      status: 'success',
      data: {
        quizzes
      }
    });
  }
  
);

exports.receiveQuizAttempted =catchAsync(
  async (req, res, next) => {

    // const {userId:user} = req;
    const user = "5f169583f0812d103d8c5e08";
    const { quizKey } = req.params;
    const { score,takenAt } = req.body;
   
    const { _id } = await Quiz.findOne({ key: quizKey });//no doubt request does have quiz id but 
    //this makes it sure that quiz is there,not deleted by creator
      await Score.create({
            quiz: _id,
            user,
            score,
            takenAt
          });

      res.json({
      status: 'success'
      });
  }
  
);
//quizzes a user has attempted
exports.quizzesAttempted = catchAsync(
  async (req, res, next) => {
    // const { userId } = req;
    const userId = "5f169583f0812d103d8c5e08";
    const attempts = await Score.find({ user: userId }).select("-user")
        .populate({
          path: 'quiz',
          select: '-_id -duration -deadline',
          populate: {
            path: 'createdBy',
            select: "-_id -password"
          }
        });
  
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
          quizzes:quizzesAttempted
        }
      })
  }
  
);

//all attempts for particular quiz
exports.getQuizAttempts = catchAsync(
  async (req, res, next) => {
    const { quizId } = req.params;
    const results = await Score.find({ quiz:quizId })
      .select("-quiz")
      .populate({ path: 'user', select: "fullName email" })
  
    const attendees = await results.map(result=>{
      const {user,score,takenAt} = result;
      const {fullName,email} = user;
      return {
        fullName,
        email,
        score,
        takenAt
      }
    })
    res.json({
      status:"success",
      data:{
        attendees
      }
     
    })
  }
);
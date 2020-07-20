const Quiz = require("../Models/quizModel");
const Score = require("../Models/scoreModel");
const AppError = require("../utils/AppError");

exports.createQuiz = async (req, res, next) => {
  // const { userId } = req;
  const userId = "5f15fe95fc98df353d730196";
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
      status: 'failed',
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
  // const { userId } = req;
  const userId = "5f15fe95fc98df353d730196";
  try {
    const quizzes = await Quiz.find({ createdBy: userId }).select('-createdBy');
    res.json({
      status: 'success',
      data: {
        quizzes
      }
    });
  } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        status:"failed",
        message:error.message
      })
  }
}


exports.receiveQuizAttempted = async (req, res, next) => {

  // const {userId:user} = req;
  const user = "5f15fe95fc98df353d730196";
  const { quizKey } = req.params;
  const { score,takenAt } = req.body;
  try {
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
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message
    })
  }
}

//quizzes a user has attempted
exports.quizzesAttempted = async (req, res, next) => {
  // const { userId } = req;
  const userId = "5f15fe95fc98df353d730196";
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
  const results = await Score.find({ quiz:quizId })
    .select("-quiz")
    .populate({ path: 'user', select: "fullName,email" })

  const attendees = await results.map(result=>{
    const {quiz,score,takenAt} = result;
    const {fullName,email} = quiz;
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
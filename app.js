const app = require("express")();
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require("cookie-parser")
const userRouter = require("./Routes/userRoutes");
const quizRouter = require("./Routes/quizRoutes");
// const {addUser} =require("./Seeders/user")
// addUser();

//middlewares
app.use(cors({
  origin:(origin,callback)=>{
    callback(null,true);
  },
  credentials: true,
}));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use('/users', userRouter);
app.use('/quizzes', quizRouter);

app.get('/', (req, res, next) => {
  res.json({
    status: "success",
    data: {
      message: 'Welcome to Smart Quiz API,visit smartquiz.ml',
    }
  })
})


//global error handler
app.use((error,req,res,next)=>{
 
  let code = error.code || 500;
  console.log(error.message);
  if(code===11000)//duplicate key error,mongoose error code
    code = 403;

  console.log(error.code," ",error.message);
  res.status(code).json({
    status:"failed",
    message:error.message
  })
})

module.exports = app;

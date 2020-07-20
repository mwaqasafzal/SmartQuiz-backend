const app = require("express")();
const bodyParser = require('body-parser');
const cors = require("cors");
const userRouter = require("./Routes/userRoutes");
const quizRouter = require("./Routes/quizRoutes");


//middlewares
app.use(cors());
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

module.exports = app;

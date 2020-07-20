const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({
  path: './config.env'
});
const PORT = process.env.PORT || 5000;

let DB = process.env.LOCAL_DB;
// if (process.env.NODE_ENV === "development")
//   DB = process.env.LOCAL_DB;
// else
//   DB = process.env.DB;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log('DB connected Succesfully'))
  .catch(() => console.log('could not establish the connection to db'));


app.listen(PORT, console.log.bind(this, "Server Started...."));
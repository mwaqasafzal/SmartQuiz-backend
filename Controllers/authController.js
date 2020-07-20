const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/AppError");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  })

}

const createSendToken = (user, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  });
  user.password = undefined;
  res.json({
    status: "success",
    data: {
      user,
      token
    }
  })

}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      throw new Error("404 User Not Found");
    const isValidPass = await user.comparePassword(password);
    if (!isValidPass)
      throw new Error("Email or Password incorrect");

    createSendToken(user, res);

  } catch (error) {
    res.json({
      status: "failed",
      message: error.message
    })
  }
}

exports.signUp = async (req, res, next) => {
  const { username, fullName, password, email } = req.body;
  try {
    const user = await User.create({
      username,
      fullName,
      password,
      email
    });

    createSendToken(user, res);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message
    });
  }

}

exports.protect = async (req, res, next) => {
  let token;
  console.log(req.headers);
  if (req.headers.authorization
    && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  try {
    if (!token)
      throw new AppError(401, 'you are not logged to to access this resource');
    //verifying the token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //checking if the user still exists
    const currentUser = await User.findById(decode.id);
    if (!currentUser)
      throw new AppError(401, 'user belongs to this token does not exists anymore')

    //persisting it on request object so that it could be accessable across different middlewares
    req.userId = currentUser._id;
    next();

  } catch (error) {
    const statusCode = error.code || 500;
    res.status(statusCode).json({
      status: "failed",
      message: error.message
    });
  }

}
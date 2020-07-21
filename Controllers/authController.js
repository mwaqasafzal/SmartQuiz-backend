const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

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
  
  res.status(201).json({
    status: "success",
    data: {
      user,
      token
    }
  })

}

exports.login = catchAsync(
  async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      throw new AppError(404,"User Not Found");
  
    const isValidPass = await user.comparePassword(password);
    if (!isValidPass)
      throw new AppError(403,"Email or Password incorrect");
    createSendToken(user,res);
    
  }
);

exports.signUp = catchAsync(
  async (req,res,next) => {
    const { fullName, password, email } = req.body;
    const user = await User.create({
      fullName,
      password,
      email
    });
  
    createSendToken(user, res);
  
  }
);
exports.logout=(req,res,next)=>{
  res.cookie('jwt','loggedout',{
    expires:new Date(Date.now()+1000*100),
    httpOnly:true
  });
  res.status(200).json({
    status:"success"
  });
}

exports.protect = catchAsync(
  async (req, res, next) => {
    let token;

    if (req.headers.authorization
      && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
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
  
  }
);
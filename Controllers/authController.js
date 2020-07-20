const User = require("../Models/userModel");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = User.findOne({ email });
    if (!user)
      throw new Error("404 User Not Found");

    const isValidPass = await user.comparePass(password);
    if (!isValidPass)
      throw new Error("Email or Password incorrect");

    res.json({
      status: "success",
      //create and share json web token
    });

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
    await User.create({
      username,
      fullName,
      password,
      email
    });

    res.json({
      status: "success",
      //create and send jwt
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message
    });
  }

}
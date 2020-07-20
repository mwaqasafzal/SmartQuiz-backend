const mongoose = require("mongoose")
const validator = require("validator");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    minlength: [3, 'username length  cannot be less then 3 characters'],
    required: true,
    unique: [true, 'username already exists']
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Invalid Email Provided'],
    unique: [true, 'email already exists']
  },
  password: {
    type: String,
    required: [true, 'Please Provide a Password'],
    minlength: [8, 'Password should be at least 8 characters']
  }
})

userSchema.pre('save', async function () {
  this.password = await bycrypt.hash(this.password, 10);
  console.log(this.password);

});

userSchema.methods.comparePass = async function (userPass) {
  return await bycrypt.compare(this.password.compare, userPass);
}

module.exports = mongoose.model('User', userSchema);
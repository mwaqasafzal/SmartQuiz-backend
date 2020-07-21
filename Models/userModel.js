const mongoose = require("mongoose")
const validator = require("validator");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
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
  this.password = await bycrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (userPass) {
  return await bycrypt.compare(userPass, this.password);
}

module.exports = mongoose.model('User', userSchema);
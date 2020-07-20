const { model } = require("../Models/userModel");

class AppError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = AppError;
const express = require("express");
const Router = express.Router();
const auth = require("../Controllers/authController");

Router.post('/login',auth.login);
Router.post('/signup',auth.signUp);

module.exports = Router;
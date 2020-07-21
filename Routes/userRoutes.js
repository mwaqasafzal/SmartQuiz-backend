const express = require("express");
const Router = express.Router();
const {login,signUp} = require("../Controllers/authController");
const {getSelf} = require("../Controllers/userController")


Router.post('/login',login);
Router.post('/signup',signUp);
Router.get('/me',getSelf);

module.exports = Router;
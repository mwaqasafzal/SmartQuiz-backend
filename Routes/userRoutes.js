const express = require("express");
const Router = express.Router();
const {login,signUp,protect} = require("../Controllers/authController");
const {getSelf} = require("../Controllers/userController")


Router.post('/login',login);
Router.post('/signup',signUp);
Router.get('/me',protect,getSelf);

module.exports = Router;
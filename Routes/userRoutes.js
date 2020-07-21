const express = require("express");
const Router = express.Router();
const {login,signUp,logout,protect} = require("../Controllers/authController");
const {getSelf} = require("../Controllers/userController")


Router.post('/login',login);
Router.post('/signup',signUp);
Router.get('/me',protect,getSelf);
Router.get('/me',protect,logout)

module.exports = Router;
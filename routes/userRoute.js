const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController');
const userSignupVal = require('../utils/userValidation');
const { librarianAuth } = require('../middleware/auth');

Router.post('/signup', librarianAuth, userSignupVal, userController.register);
Router.get('/', librarianAuth, userController.all);

module.exports = Router;
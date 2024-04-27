const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController');
const userSignupVal = require('../utils/userValidation');
const { librarianAuth } = require('../middleware/auth');

Router.get('/', librarianAuth, userController.all);
Router.get('/:id', librarianAuth, userController.getOne);
Router.post('/signup', librarianAuth, userSignupVal, userController.register);
Router.patch('/:id', librarianAuth, userController.modify);
Router.delete('/:id', librarianAuth, userController.remove);

module.exports = Router;
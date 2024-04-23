const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController');

Router.post('/signup', userController.register);

module.exports = Router;
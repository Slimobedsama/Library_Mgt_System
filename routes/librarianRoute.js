const express = require('express');
const Router = express.Router();
const librarianController = require('../controller/librarianController');

Router.post('/signup', librarianController.create);

module.exports = Router;
const express = require('express');
const Router = express.Router();
const librarianController = require('../controller/librarianController');
const adminAuth = require('../middleware/adminAuth')

Router.get('/all', adminAuth, librarianController.all);
Router.post('/signup', adminAuth, librarianController.create);

module.exports = Router;
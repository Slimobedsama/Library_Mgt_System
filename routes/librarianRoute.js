const express = require('express');
const Router = express.Router();
const librarianController = require('../controller/librarianController');
const { adminAuth, librarianAuth, resetAuth } = require('../middleware/auth');
const librarianSignupVal = require('../utils/librarianValidation');
const librarianUpdateVal = require('../utils/librarianValidation');

Router.get('/all', adminAuth, librarianController.all);
Router.get('/:id', adminAuth, librarianController.getOne);
Router.post('/signup', adminAuth, librarianSignupVal, librarianController.create);
Router.post('/login', librarianController.gainAccess);
Router.post('/forgot-password', librarianController.lostPassword);
Router.post('/reset-password', resetAuth, librarianController.resetePass);
Router.patch('/:id', librarianUpdateVal, librarianAuth, librarianController.modify);
Router.delete('/:id', adminAuth, librarianController.remove);

module.exports = Router;
const express = require('express');
const Router = express.Router();
const librarianController = require('../controller/librarianController');
const {adminAuth, librarianAuth} = require('../middleware/auth');

Router.get('/all', adminAuth, librarianController.all);
Router.get('/:id', adminAuth, librarianController.getOne);
Router.post('/signup', adminAuth, librarianController.create);
Router.post('/login', librarianController.gainAccess);
Router.patch('/:id', librarianAuth, librarianController.modify);
Router.delete('/:id', adminAuth, librarianController.remove);

module.exports = Router;
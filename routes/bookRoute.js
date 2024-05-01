const express = require('express');
const Router = express.Router();
const bookController = require('../controller/bookController');
const validateCreateBook = require('../utils/bookValidation');
const { librarianAuth } = require('../middleware/auth');

Router.get('/', bookController.getAll);
Router.get('/:id', bookController.getOne);
Router.post('/create', librarianAuth, validateCreateBook, bookController.create);
Router.delete('/:id', librarianAuth, bookController.remove);

module.exports = Router;
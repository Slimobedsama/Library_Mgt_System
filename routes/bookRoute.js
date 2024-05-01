const express = require('express');
const Router = express.Router();
const bookController = require('../controller/bookController');
const validateCreateBook = require('../utils/bookValidation');

Router.get('/', bookController.getAll);
Router.get('/:id', bookController.getOne);
Router.post('/create', validateCreateBook, bookController.create);
Router.delete('/:id', bookController.remove);

module.exports = Router;
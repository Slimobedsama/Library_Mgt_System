const express = require('express');
const Router = express.Router();
const bookController = require('../controller/bookController');

Router.get('/', bookController.getAll);
Router.get('/:id', bookController.getOne);
Router.post('/create', bookController.create);
Router.delete('/:id', bookController.remove);

module.exports = Router;
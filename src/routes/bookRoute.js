import express from 'express';
const Router = express.Router();
import { getAllBooks, getOneBook, createBook, removeBook } from '../controller/bookController.js';
import validateCreateBook from '../utils/bookValidation.js';
import { librarianAuth } from '../middleware/auth.js';

Router.get('/', getAllBooks);
Router.get('/:id', getOneBook);
Router.post('/create', librarianAuth, validateCreateBook, createBook);
Router.delete('/:id', librarianAuth, removeBook);

export default Router;
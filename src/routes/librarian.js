import express from 'express';
const Router = express.Router();
import { getEveryLibrarian, getOneLibrarian, reqisterLibrarian, accessLibrarian, modifyLabrarian, removeLibrarian, librarianLostPassword, librarianResetPass } from '../controller/librarian.js';
import { adminAuth, librarianAuth } from '../middleware/auth.js';
import { librarianSingupVal, librarianLoginVal, librarianUpdateVal, resetPassValidate } from '../middleware/validator/librarianValidation.js';
Router.get('/', adminAuth, getEveryLibrarian);
Router.get('/:id', adminAuth, getOneLibrarian);
Router.post('/signup', adminAuth, librarianSingupVal, reqisterLibrarian);
Router.post('/login', librarianLoginVal, accessLibrarian);
Router.post('/forgot-password', librarianLostPassword);
Router.patch('/:id', librarianUpdateVal, librarianAuth, modifyLabrarian);
Router.patch('/reset-password/:id', resetPassValidate, librarianResetPass);
Router.delete('/:id', adminAuth, removeLibrarian);

export default Router;
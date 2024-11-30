import express from 'express';
const Router = express.Router();
import { getEveryLibrarian, getOneLibrarian, reqisterLibrarian, accessLibrarian, modifyLabrarian, removeLibrarian, librarianLostPassword, librarianResetPass } from '../controller/librarianController.js';
import { adminAuth, librarianAuth, resetAuth } from '../middleware/auth.js';
import { librarianSingupVal, librarianUpdateVal } from '../utils/librarianValidation.js';

Router.get('/all', adminAuth, getEveryLibrarian);
Router.get('/:id', adminAuth, getOneLibrarian);
Router.post('/signup', adminAuth, librarianSingupVal, reqisterLibrarian);
Router.post('/login', accessLibrarian);
Router.post('/forgot-password', librarianLostPassword);
Router.post('/reset-password', resetAuth, librarianResetPass);
Router.patch('/:id', librarianUpdateVal, librarianAuth, modifyLabrarian);
Router.delete('/:id', adminAuth, removeLibrarian);

export default Router;
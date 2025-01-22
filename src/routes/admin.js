import express from 'express';
const Router = express.Router();
import { allAdmin, registerAdmin, accessAdmin, adminLostPass, adminRetrievePass, adminLogout, adminViewLogin, dashBoardAdmin, lostPassword, resetPassword } from '../controller/admin.js';
import { adminAuth, checkAdmin } from '../middleware/auth.js';
import { adminSingupVal, resetPassValidate, loginValAdmin } from '../utils/adminValidation.js';

// ADMIN VIEW ROUTES
Router.get('*', checkAdmin);
Router.get('/login', adminViewLogin);
Router.get('/dash-board', adminAuth, dashBoardAdmin);
Router.get('/forgotten-password', lostPassword);
Router.get('/reset-password/:id', resetPassword);

// ADMIN ROUTES
Router.get('/', allAdmin);
Router.get('/logout', adminLogout);
Router.post('/is-admin-signup', adminSingupVal, registerAdmin);
Router.post('/login', loginValAdmin, accessAdmin);
Router.post('/forgotten-password', adminLostPass);
Router.post('/reset-password/:id', resetPassValidate, adminRetrievePass);

export default Router;
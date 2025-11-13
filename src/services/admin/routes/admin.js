import express from 'express';
const Router = express.Router();
import { accessAdmin, adminLostPass, adminRetrievePass, adminLogout, adminViewLogin, dashBoardAdmin, lostPassword, resetPassword } from '../controller/admin.js';
import { adminAuth, checkAdmin } from '../../../middleware/auth.js';
import { resetPassValidate, loginValAdmin, validateAdminEmail } from '../validator/adminValidation.js';

// ADMIN VIEW ROUTES
Router.get('*', checkAdmin);
Router.get('/login', adminViewLogin);
Router.get('/dash-board', adminAuth, dashBoardAdmin);
Router.get('/forgotten-password', lostPassword);
Router.get('/reset-password/:id', resetPassword);

// ADMIN ROUTES
Router.get('/logout', adminLogout);
Router.post('/login', loginValAdmin, accessAdmin);
Router.post('/forgotten-password', validateAdminEmail, adminLostPass);
Router.post('/reset-password/:id', resetPassValidate, adminRetrievePass);

export default Router;
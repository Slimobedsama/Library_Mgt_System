import express from 'express';
const Router = express.Router();
import { adminLoginController, adminLostPassController, adminResendOtpController, adminVerifyOtpController, adminResetPasswordController, adminLogoutContoller, loginView, dashboardView, forgottenPasswordView, verifyOtpView, resetPasswordView } from '../controller/admin.js';
import { adminAuth, checkAdmin } from '../../../middleware/auth.js';
import { validatePasswordReset, validateAdminLogin, validateAdminEmail, validateAdminOtp } from '../validator/adminValidation.js';

// ADMIN VIEW ROUTES
Router.get('*', checkAdmin);
Router.get('/login', loginView);
Router.get('/dash-board', adminAuth, dashboardView);
Router.get('/forgotten-password', forgottenPasswordView);
Router.get('/forgotten-password-otp', verifyOtpView);
Router.get('/reset-password', adminAuth, resetPasswordView);

// ADMIN ROUTES
Router.get('/logout', adminLogoutContoller);
Router.post('/login', validateAdminLogin, adminLoginController);
Router.post('/forgotten-password', validateAdminEmail, adminLostPassController);
Router.get('/resend-otp', adminResendOtpController);
Router.post('/forgotten-password-otp', validateAdminOtp, adminVerifyOtpController);
Router.post('/reset-password', adminAuth, validatePasswordReset, adminResetPasswordController);

export default Router;
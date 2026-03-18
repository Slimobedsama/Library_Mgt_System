import express from 'express';
const Router = express.Router();
import { 
    loginView, 
    dashboardView, 
    forgottenPasswordView,
    adminResendOtpController, 
    verifyOtpView, 
    resetPasswordView
}  from '../../controller/views/admin.views.js';
import { adminAuth, checkAdmin } from '../../../../middleware/auth.js';

// ADMIN VIEW ROUTES
// Router.get('*', checkAdmin);
Router.get('/login', loginView);
Router.get('/dash-board', checkAdmin, dashboardView);
Router.get('/forgotten-password', forgottenPasswordView);
Router.get('/resend-otp', adminResendOtpController);
Router.get('/forgotten-password-otp', verifyOtpView);
Router.get('/reset-password', adminAuth, resetPasswordView);

export default Router;
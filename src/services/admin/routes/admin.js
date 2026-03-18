import express from 'express';
const Router = express.Router();
import { adminAuth } from '../../../middleware/auth.js';
import { 
    adminLoginController, 
    adminLostPassController, 
    adminVerifyOtpController, 
    adminResetPasswordController, 
    adminLogoutContoller,
 } from '../controller/admin.js';

import { 
    validatePasswordReset, 
    validateAdminLogin, 
    validateAdminEmail, 
    validateAdminOtp 
} from '../validator/adminValidation.js';

// ADMIN ROUTES
Router.get('/logout', adminLogoutContoller);
Router.post('/login', validateAdminLogin, adminLoginController);
Router.post('/forgotten-password', validateAdminEmail, adminLostPassController);
Router.post('/forgotten-password-otp', validateAdminOtp, adminVerifyOtpController);
Router.post('/reset-password', adminAuth, validatePasswordReset, adminResetPasswordController);

export default Router;
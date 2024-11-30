import express from 'express';
const Router = express.Router();
import { allAdmin, registerAdmin, accessAdmin, adminLostPass, adminRetrievePass } from '../controller/adminController.js';
import { resetAuth } from '../middleware/auth.js';
import { adminSingupVal, resetPassValidate } from '../utils/adminValidation.js';

Router.get('/', allAdmin);
Router.post('/is-admin-signup', adminSingupVal, registerAdmin);
Router.post('/login', accessAdmin);
Router.post('/forgotten-password', adminLostPass);
Router.post('/reset-password/:id', resetAuth, resetPassValidate, adminRetrievePass);

export default Router;